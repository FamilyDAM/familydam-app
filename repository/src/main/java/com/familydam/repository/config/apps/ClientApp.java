package com.familydam.repository.config.apps;

import lombok.Getter;
import lombok.Setter;

import java.util.Collections;
import java.util.List;

public class ClientApp
{
    public ClientApp() { }

    /**
     * Show in the left menu
     * @return
     */
    @Getter
    @Setter
    Boolean primary = true;


    /**
     * Show in the header ... more menu
     * @return
     */
    @Getter
    @Setter
    Boolean secondary = false;


    /**
     * keep inside dashboard shell, in an iFrame
     * @return
     */
    @Getter
    @Setter
    Boolean embedded = false;


    /**
     * Order in menu
     */
    @Getter
    @Setter
    Integer order = 1;


    /**
     * Internal name, to use as i18n key for translation or for code lookups (is app X registered)
     * @return
     */
    @Getter
    @Setter
    String slug = "";


    /**
     * Name displayed in UI
     */
    @Getter
    @Setter
    String label = "";


    /**
     * Path to new app.
     * if it starts with "://" it will reload the whole browser, if it doesn't it will be a local page in the app-dashboard app
     * @return
     */
    @Getter
    @Setter
    String path = "://";


    /**
     * No roles means that everyone can see it
     * @return
     */
    @Getter
    @Setter
    List<String> roles = Collections.EMPTY_LIST;

}
