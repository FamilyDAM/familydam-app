package com.familydam.repository.config;

import com.familydam.repository.config.repo.InitialDAMContent;
import com.familydam.repository.models.AdminUser;
import org.apache.commons.io.FileUtils;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.commons.cnd.CndImporter;
import org.apache.jackrabbit.commons.cnd.ParseException;
import org.apache.jackrabbit.core.data.FileDataStore;
import org.apache.jackrabbit.oak.Oak;
import org.apache.jackrabbit.oak.jcr.Jcr;
import org.apache.jackrabbit.oak.plugins.blob.datastore.DataStoreBlobStore;
import org.apache.jackrabbit.oak.plugins.blob.datastore.OakFileDataStore;
import org.apache.jackrabbit.oak.security.internal.SecurityProviderBuilder;
import org.apache.jackrabbit.oak.segment.SegmentNodeStore;
import org.apache.jackrabbit.oak.segment.SegmentNodeStoreBuilders;
import org.apache.jackrabbit.oak.segment.file.FileStore;
import org.apache.jackrabbit.oak.segment.file.FileStoreBuilder;
import org.apache.jackrabbit.oak.segment.file.InvalidFileStoreVersionException;
import org.apache.jackrabbit.oak.segment.tool.iotrace.IOTraceLogWriter;
import org.apache.jackrabbit.oak.spi.blob.BlobStore;
import org.apache.jackrabbit.oak.spi.security.SecurityProvider;
import org.apache.jackrabbit.oak.spi.state.NodeStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.AbstractEnvironment;
import org.springframework.core.env.EnumerablePropertySource;
import org.springframework.core.env.Environment;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.stereotype.Service;

import javax.annotation.PreDestroy;
import javax.jcr.*;
import javax.jcr.nodetype.NodeType;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.Properties;
import java.util.stream.StreamSupport;

@Service
@Profile("local")
public class RepositoryConfig {
    Logger log = LoggerFactory.getLogger(RepositoryConfig.class);

    @Value("${familydam.home}")
    String HOME = "./fd-repo";

    @Autowired
    private Environment environment;



    @Autowired
    public RepositoryConfig(Environment environment) {

        //Extract all oak.* properties and set as System Properties for Oak
        Properties props = new Properties();
        MutablePropertySources propSrcs = ((AbstractEnvironment) environment).getPropertySources();
        StreamSupport.stream(propSrcs.spliterator(), false)
            .filter(ps -> ps instanceof EnumerablePropertySource)
            .map(ps -> ((EnumerablePropertySource) ps).getPropertyNames())
            .flatMap(Arrays::<String>stream)
            .forEach(propName -> props.setProperty(propName, environment.getProperty(propName)));

        for (Object key : props.keySet()) {
            if (((String) key).startsWith("oak.")) {
                String property = ((String) key).substring(4);
                System.getProperties().setProperty(property, environment.getProperty(((String) key)));
            }
        }

    }


    @PreDestroy
    @Profile("test")
    public void wipeRepo() throws IOException {
        String[] profiles = this.environment.getActiveProfiles();
        if (Arrays.asList(profiles).contains("test")) {
            FileUtils.deleteDirectory(new File(HOME));
        }
    }



    @Bean
    public BlobStore fileDataStore() {
        //FileDataStore fds = new FileDataStore();
        FileDataStore fds = new OakFileDataStore();
        fds.setMinRecordLength(100);
        fds.setPath(HOME + "/repo/files");
        fds.init(HOME + "/repo/files");
        return new DataStoreBlobStore(fds);
    }


    @Bean
    public FileStore fileStore(BlobStore blobStore) throws InvalidFileStoreVersionException, IOException {
        log.info("Initialize Home Dir = " +new File(HOME).getAbsolutePath());

        FileStore fs = FileStoreBuilder
            .fileStoreBuilder(new File(HOME + "/repo"))
            .withIOLogging(LoggerFactory.getLogger(IOTraceLogWriter.class))
            .withBlobStore(blobStore)
            .withMaxFileSize(256)
            .build();
        return fs;
    }


    @Bean
    public SegmentNodeStore segmentNodeStore(FileStore fileStore) {
        SegmentNodeStore ns = SegmentNodeStoreBuilders.builder(fileStore).build();
        return ns;
    }


    @Bean
    public SecurityProvider securityProvider() {
        SecurityProvider sp = SecurityProviderBuilder.newBuilder().build();
        return sp;
    }

    @Bean
    public Oak oak(NodeStore nodeStore, SecurityProvider securityProvider) throws InvalidFileStoreVersionException, IOException {

        //ContentNodeAddedObserver contentNodeAddedObserver = new ContentNodeAddedObserver("/content/files", "jcr:name");
        //contentNodeAddedObserver.setPhotoSizeInfoService(photoSizeInfoService);

        Oak oak = new Oak(nodeStore)
            .with("default")
            .with(securityProvider)
            .with(new InitialDAMContent());
        // add initial content and folder structure
        //.with(new DefaultTypeEditor())     // automatically set default types
        //.with(new NameValidatorProvider()) // allow only valid JCR names
        //.with(new PropertyIndexHook())     // simple indexing support
        //.with(new PropertyIndexProvider()) // search support for the indexes
        //.with(new JcrAllCommitHook())
        //.withAsyncIndexing()
        //.with(contentNodeAddedObserver);
        return oak;
    }

    @Bean
    public Jcr jcr(Oak oak, SecurityProvider securityProvider) throws InvalidFileStoreVersionException, IOException {
        Jcr jcr = new Jcr(oak).with(securityProvider);
        return jcr;
    }

    @Bean
    public Repository Repository(Jcr jcr, AdminUser adminUser) throws RepositoryException, InvalidFileStoreVersionException, ParseException, IOException {

        //System.out.println("Checking admin user | " +adminUser.username +":" +adminUser.password);
        Repository repo = jcr.createRepository();

        //get admin user and change pwd
        checkAndSetAdminPassword(repo, adminUser);

        registerMixIns(repo, adminUser);
        //registerPermissions(repo, adminUser   );

        return repo;
    }


    /**
     * If the password matches the userId we need to change this.
     * We do not want to keep the default admin/admin login.
     * @param repo
     */
    private void checkAndSetAdminPassword(Repository repo, AdminUser adminUser) throws RepositoryException {
        try{
            //System.out.println("checkAndSetAdminPassword | " +adminUser.username +":" +adminUser.password);
            String adminId = adminUser.username; //environment.getProperty("oak.PARAM_ADMIN_ID");
            Session session = repo.login(new SimpleCredentials( adminId, adminId.toCharArray() ));

            Authorizable auth = ((JackrabbitSession)session).getUserManager().getAuthorizable(adminId);
            ((User) auth).changePassword(adminUser.password, adminUser.username);
            session.save();
            session.logout();

        }catch (LoginException ex){
            //ex.printStackTrace();
            System.out.println("default admin/admin login did not work, password has already been reset");
            //password has been changed so admin/admin is no longer valid. This is what we want so skip the rest
        }

    }

//    private void registerPermissions(Repository repo, SimpleCredentials adminCredentials) throws RepositoryException {
//        Session session = repo.login(adminCredentials);
//        // remove all access for the anonymouse user
//        UserManager userManager = ((JackrabbitSession) session).getUserManager();
//        User anonUser = (User) userManager.getAuthorizable("anonymous");
//        //assignPermission(activeSession, anonUser.getPrincipal(), activeSession.getRootNode().getNode("home"), null, new String[]{Privilege.JCR_WRITE});
//        assignPermission(session_, anonUser.getPrincipal(), securityNode, null, new String[]{Privilege.JCR_ALL});
//    }


    private void registerMixIns(Repository repo, AdminUser adminUser) throws RepositoryException, ParseException, IOException {

        //System.out.println("registerMixIns | " +adminUser.username +":" +adminUser.password);
        Credentials adminCredentials = new SimpleCredentials(adminUser.username, adminUser.password.toCharArray());
        Session session = repo.login(adminCredentials);

        InputStream cnd = this.getClass().getClassLoader().getResourceAsStream("nodetypes.cnd");
        NodeType[] nodeTypes = CndImporter.registerNodeTypes(new InputStreamReader(cnd), session);

        session.save();
        session.logout();
    }


}
