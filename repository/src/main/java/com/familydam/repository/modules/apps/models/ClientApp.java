package com.familydam.repository.modules.apps.models;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.hateoas.server.core.Relation;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "with")
@Relation(collectionRelation = "apps", itemRelation = "app")
public class ClientApp
{

    /**
     * Show in the left menu
     * @return
     */
    Boolean primary = true;


    /**
     * Show in the header ... more menu
     * @return
     */
    Boolean secondary = false;


    /**
     * keep inside dashboard shell, in an iFrame
     * @return
     */
    Boolean embedded = false;


    /**
     * Order in menu
     */
    Integer order = 1;


    /**
     * Internal name, to use as i18n key for translation or for code lookups (is app X registered)
     * @return
     */
    String slug = "";


    /**
     * Name displayed in UI
     */
    String label = "";


    /**
     * Path to new app.
     * if it starts with "://" it will reload the whole browser, if it doesn't it will be a local page in the app-dashboard app
     * @return
     */
    String path = "://";


    /**
     * No roles means that everyone can see it
     * @return
     */
    List<String> roles = Collections.EMPTY_LIST;


    public static class ClientAppBuilder {
        Boolean primary = true;
        Boolean secondary = false;
        Boolean embedded = false;
        Integer order = 0;
        String slug;
        String label;
        String path;
        List<String> roles;

        public ClientAppBuilder withResource(Resource resource) throws IOException {
            ClientApp app = new ObjectMapper().readValue(resource.getInputStream(), ClientApp.class);

            this.primary = app.primary;
            this.secondary = app.secondary;
            this.embedded = app.embedded;
            this.order = app.order;
            this.slug = app.slug;
            this.label = app.label;
            this.path = app.path;
            this.roles = app.roles;

            return this;
        }
    }
}
