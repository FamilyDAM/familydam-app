package com.familydam.repository.modules.apps.services;

import com.familydam.repository.modules.apps.models.ClientApp;
import com.familydam.repository.services.IRestService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Get a list of all apps/modules registerd in the app
 */
@Service
public class ClientAppsService implements IRestService
{

    List<ClientApp> clientApps = new ArrayList();

    public ClientAppsService() throws IOException {
        ClassLoader cl = this.getClass().getClassLoader();
        ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(cl);

        //Dynamically look for Config files, used to define each application
        Resource[] resources = resolver.getResources("/static/**/*.config.json");
        for (Resource resource : resources) {
            clientApps.add(ClientApp.builder().withResource(resource).build());
        }
    }

    public List<ClientApp> getClientApps() {
        return this.clientApps;
    }
}
