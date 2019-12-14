package com.familydam.repository.config;

import com.familydam.repository.models.AdminUser;
import net.east301.keyring.BackendNotSupportedException;
import net.east301.keyring.Keyring;
import net.east301.keyring.PasswordRetrievalException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import javax.jcr.RepositoryException;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Configuration
public class AdminUserConfig
{
    Logger log = LoggerFactory.getLogger(WebSecurityConfig.class);

    @Value("${familydam.home}")
    String HOME = "./fd-repo";

    @Value("${spring.security.user.name}")
    String adminUserName;

    @Value("${spring.security.user.password}")
    String adminUserPassword;


    @Bean
    public AdminUser adminCredentials(Keyring keyring) throws RepositoryException {

        // Retrieve password from key store
        try {
            String password = keyring.getPassword("FamilyDAM", adminUserName);
            AdminUser adminUser = new AdminUser(adminUserName, password);
            return adminUser;
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            throw new RepositoryException("Error Setting up User nin Keyring");
        }


    }


    @Bean
    public Keyring keyring() throws RepositoryException {

        //
        // setup a Keyring instance
        //
        Keyring keyring = null;

        // create an instance of Keyring by invoking Keyring.create method
        //
        // Keyring.create method finds appropriate keyring backend, and sets it up for you.
        // On Mac OS X environment, OS X Keychain is used, and On Windows environment,
        // DPAPI is used for encryption of passwords.
        // If no supported backend is found, BackendNotSupportedException is thrown.
        try {
            keyring = Keyring.create();
        } catch (BackendNotSupportedException ex) {
            log.error(ex.getMessage(), ex);
            throw new RepositoryException("Error Setting up User Credentials - Creating Keyring");
        }

        // some backend directory handles a file to store password to disks.
        // in this case, we must set path to key store file by Keyring.setKeyStorePath
        // before using Keyring.getPassword and Keyring.getPassword.
        if (keyring.isKeyStorePathRequired()) {
            try {
                File dir = new File(HOME +"/config");
                if( !dir.exists()){
                    dir.mkdirs();
                }
                File keyStoreFile = File.createTempFile("keystore", ".keystore", dir);
                keyring.setKeyStorePath(keyStoreFile.getPath());
            } catch (IOException ex) {
                log.error(ex.getMessage(), ex);
                throw new RepositoryException("Error Setting up User Credentials Path");
            }
        }

        //
        // store password to key store
        //

        // Password can be stored to key store by using Keyring.setPassword method.
        // PasswordSaveException is thrown when some error happened while saving password.
        // LockException is thrown when keyring backend failed to lock key store file.
        try {
            String password = keyring.getPassword("FamilyDAM", adminUserName);
            log.trace("Admin User Exists in Keyring");
        }catch (PasswordRetrievalException pre){
            try {
                //Set initial password
                if (StringUtils.isEmpty(adminUserPassword)) {
                    //create random/unique default password
                    adminUserPassword = UUID.randomUUID().toString().replaceAll("-", "");
                }
                keyring.setPassword("FamilyDAM", adminUserName, adminUserPassword);
            }catch (Exception ex) {
                log.error(ex.getMessage(), ex);
                throw new RepositoryException("Error Setting up User Keyring");
            }
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            throw new RepositoryException("Error Setting up User Keyring - Lock Exception");
        }

        if( keyring == null ){
            throw new RepositoryException("Error Setting up Admin User");
        }else{
            return keyring;
        }
    }
}
