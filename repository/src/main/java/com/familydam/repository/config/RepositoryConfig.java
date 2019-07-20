package com.familydam.repository.config;

import com.familydam.repository.config.repo.InitialDAMContent;
import com.familydam.repository.observers.ContentNodeAddedObserver;
import org.apache.commons.io.FileUtils;
import org.apache.jackrabbit.api.observation.JackrabbitEventFilter;
import org.apache.jackrabbit.api.observation.JackrabbitObservationManager;
import org.apache.jackrabbit.commons.cnd.CndImporter;
import org.apache.jackrabbit.commons.cnd.ParseException;
import org.apache.jackrabbit.oak.Oak;
import org.apache.jackrabbit.oak.jcr.Jcr;
import org.apache.jackrabbit.oak.jcr.observation.filter.FilterFactory;
import org.apache.jackrabbit.oak.jcr.observation.filter.OakEventFilter;
import org.apache.jackrabbit.oak.segment.SegmentNodeStore;
import org.apache.jackrabbit.oak.segment.SegmentNodeStoreBuilders;
import org.apache.jackrabbit.oak.segment.file.FileStore;
import org.apache.jackrabbit.oak.segment.file.FileStoreBuilder;
import org.apache.jackrabbit.oak.segment.file.InvalidFileStoreVersionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import javax.annotation.PreDestroy;
import javax.jcr.Repository;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import javax.jcr.nodetype.NodeType;
import javax.jcr.observation.ObservationManager;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.UUID;

@Service
@Profile("local")
public class RepositoryConfig
{
    Logger log = LoggerFactory.getLogger(RepositoryConfig.class);

    @Value("${familydam.home}")
    String HOME = "./fd-repo";

    @Autowired
    private Environment environment;


    @PreDestroy
    @Profile("test")
    public void wipeRepo() throws  IOException {
        String[] profiles = this.environment.getActiveProfiles();
        if(Arrays.asList(profiles).contains("test")) {
            FileUtils.deleteDirectory(new File(HOME));
        }
    }

    @Bean
    public Repository Repository() throws RepositoryException, InvalidFileStoreVersionException, ParseException, IOException {

        FileStore fs = FileStoreBuilder.fileStoreBuilder(new File(HOME +"/repo")).build();

        SegmentNodeStore ns = SegmentNodeStoreBuilders.builder(fs).build();

        Repository repo = new Jcr(
            new Oak(ns)
                .with("default")
                .with(new InitialDAMContent())  // add initial content and folder structure
                //.with(new SecurityProviderImpl())  // use the default security
                //.with(new DefaultTypeEditor())     // automatically set default types
                //.with(new NameValidatorProvider()) // allow only valid JCR names
                //.with(new PropertyIndexHook())     // simple indexing support
                //.with(new PropertyIndexProvider()) // search support for the indexes
                //.with(new JcrAllCommitHook())
                //.withAsyncIndexing()
                .with(new ContentNodeAddedObserver("/content/files", "jcr:name"))
        ).createRepository();

        registerMixins(repo);
        registerObservers(repo);


        Session session = repo.login(new SimpleCredentials("admin", "admin".toCharArray()));
        session.getNode("/content/files").addNode("1-" +UUID.randomUUID().toString());
        session.getNode("/content/files").addNode("2-" +UUID.randomUUID().toString());
        session.getNode("/content/files").addNode("3-" +UUID.randomUUID().toString());
        log.debug("Added test nodes | Thread=" +Thread.currentThread().getId());
        session.save();

        return repo;
    }


    private void registerMixins(Repository repo) throws RepositoryException, ParseException, IOException {

        Session session = repo.login(new SimpleCredentials("admin", "admin".toCharArray()));

        InputStream cnd = this.getClass().getClassLoader().getResourceAsStream("nodetypes.cnd");
        NodeType[] nodeTypes = CndImporter.registerNodeTypes(new InputStreamReader(cnd), session);

        session.save();
    }


    private void registerObservers(Repository repo) throws RepositoryException {
        Session session = repo.login(new SimpleCredentials("admin", "admin".toCharArray()));
        ObservationManager om = session.getWorkspace().getObservationManager();
        //Cast to JackrabbitObservationManager
        JackrabbitObservationManager jrom = (JackrabbitObservationManager) om;

        //Construct a JackrabbitEventFilter
        JackrabbitEventFilter jrFilter = new JackrabbitEventFilter();

        //Wrap it as OakEventFilter
        OakEventFilter oakFilter = FilterFactory.wrap(jrFilter);

        oakFilter.withIncludeSubtreeOnRemove();
        //Set other filtering criteria

        //EventListener listener = new ContentNodeAddedObserver();
        //jrom.addEventListener(listener, oakFilter);
        //session.save();
    }

}
