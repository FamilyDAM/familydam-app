package com.familydam.repository.config;

import com.familydam.repository.models.AdminUser;
import com.github.javakeyring.BackendNotSupportedException;
import com.github.javakeyring.Keyring;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import javax.jcr.RepositoryException;
import java.util.Optional;
import java.util.UUID;

@Configuration
public class AdminUserConfig
{
    Logger log = LoggerFactory.getLogger(WebSecurityConfig.class);

    @Value("${familydam.home}")
    String HOME = "./familydam-repo";

    @Value("${spring.security.user.name}")
    String adminUserName;

    @Value("${spring.security.user.password}")
    String adminUserPassword;


    @Bean
    public AdminUser adminCredentials(Optional<Keyring> keyring) throws RepositoryException {

        // Retrieve password from key store
        try {
            if( keyring.isPresent() ) {
                String password = keyring.get().getPassword("FamilyDAM", adminUserName);
                AdminUser adminUser = new AdminUser(adminUserName, password);
                return adminUser;
            }else{
                log.warn("Unable to access or initialize Keyring on this OS, using unsecure u/p instead");
            }
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            //throw new RepositoryException("Error Setting up User nin Keyring");
        }

        AdminUser adminUser = new AdminUser(adminUserName, StringUtils.isEmpty(adminUserPassword)?adminUserName:adminUserPassword);
        return adminUser;
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
            return null;
            //log.error(ex.getMessage(), ex);
            //throw new RepositoryException("Error Setting up User Credentials - Creating Keyring");
        }

        // some backend directory handles a file to store password to disks.
        // in this case, we must set path to key store file by Keyring.setKeyStorePath
        // before using Keyring.getPassword and Keyring.getPassword.
        /** not supported in new lib, was supported in xafero dependency.
        if (keyring.isKeyStorePathRequired()) {
            try {
                File dir = new File(HOME + "/config");
                if (!dir.exists()) {
                    dir.mkdirs();
                }
                File keyStoreFile = new File(dir.getPath() + "/familydam.keystore");
                keyring.setKeyStorePath(keyStoreFile.getPath());
            } catch (Exception ex) {
                log.error(ex.getMessage(), ex);
                throw new RepositoryException("Error Setting up User Credentials Path");
            }
        }**/



        //
        // store password to key store
        //

        // Password can be stored to key store by using Keyring.setPassword method.
        // PasswordSaveException is thrown when some error happened while saving password.
        // LockException is thrown when keyring backend failed to lock key store file.
        try {
            String password = keyring.getPassword("FamilyDAM", adminUserName);

            if( password != null) {
                log.trace("Admin User Exists in Keyring");
            }
        }catch (Exception pre){
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
        }

        if( keyring == null ){
            throw new RepositoryException("Error Setting up Admin User");
        }else{
            return keyring;
        }
    }



}
