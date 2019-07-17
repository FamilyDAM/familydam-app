package com.familydam.repository.config;

import org.apache.commons.io.FileUtils;
import org.apache.jackrabbit.commons.cnd.CndImporter;
import org.apache.jackrabbit.commons.cnd.ParseException;
import org.apache.jackrabbit.oak.Oak;
import org.apache.jackrabbit.oak.jcr.Jcr;
import org.apache.jackrabbit.oak.segment.SegmentNodeStore;
import org.apache.jackrabbit.oak.segment.SegmentNodeStoreBuilders;
import org.apache.jackrabbit.oak.segment.file.FileStore;
import org.apache.jackrabbit.oak.segment.file.FileStoreBuilder;
import org.apache.jackrabbit.oak.segment.file.InvalidFileStoreVersionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import javax.annotation.PreDestroy;
import javax.jcr.*;
import javax.jcr.nodetype.NodeType;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

@Service
@Profile("local")
public class RepositoryConfig
{
    Logger log = LoggerFactory.getLogger(RepositoryConfig.class);

    @Value("${familydam.home}")
    String HOME = "./fd-repo";

    @PreDestroy
    @Profile("test")
    public void wipeRepo() throws  IOException {
        FileUtils.deleteDirectory(new File(HOME));
    }

    @Bean
    public Repository Repository() throws RepositoryException, InvalidFileStoreVersionException, ParseException, IOException {

        FileStore fs = FileStoreBuilder.fileStoreBuilder(new File(HOME +"/repo")).build();

        SegmentNodeStore ns = SegmentNodeStoreBuilders.builder(fs).build();

        Repository repo = new Jcr(
            new Oak(ns)
                //.with("FamilyDAM")
                //.with(new InitialDAMContent(segmentNodeStore))  // add initial content and folder structure
                //.with(new SecurityProviderImpl())  // use the default security
                //.with(new DefaultTypeEditor())     // automatically set default types
                //.with(new NameValidatorProvider()) // allow only valid JCR names
                //.with(new OpenSecurityProvider())
                //.with(new PropertyIndexHook())     // simple indexing support
                //.with(new PropertyIndexProvider()) // search support for the indexes
                //.with(new JcrAllCommitHook())
                //.withAsyncIndexing()
        ).createRepository();

        registerMixins(repo);
        initializeRepo(repo);

        return repo;
    }



    private void registerMixins(Repository repo) throws RepositoryException, ParseException, IOException {

        Session session = repo.login(new SimpleCredentials("admin", "admin".toCharArray()));

        InputStream cnd = this.getClass().getClassLoader().getResourceAsStream("nodetypes.cnd");
        NodeType[] nodeTypes = CndImporter.registerNodeTypes(new InputStreamReader(cnd), session);

        session.save();
    }



    private void initializeRepo(Repository repo) throws RepositoryException {

        Session session = repo.login(new SimpleCredentials("admin", "admin".toCharArray()));



        Node root = session.getRootNode();
        if (!root.hasNode("content")) {
            Node content = root.addNode("content");
            

            //debug
            //todo - remove
            Node t1 = content.addNode("test1");
            t1.addNode("test1a");
            Node t2 = content.addNode("test2");
            t2.addNode("test2a");

            session.save();
            log.trace("Root 'Content' Node was created");
        }
        session.save();

    }
}
