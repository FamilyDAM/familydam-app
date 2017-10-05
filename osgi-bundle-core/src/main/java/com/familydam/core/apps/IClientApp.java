package com.familydam.core.apps;

import java.util.List;

public interface IClientApp
{
    /**
     * Show in the left menu
     * @return
     */
    public Boolean getPrimary();
    public void setPrimary(Boolean isPrimary);

    /**
     * Show in the header ... more menu
     * @return
     */
    public Boolean getSecondary();
    public void setSecondary(Boolean isSecondary);

    /**
     * keep inside dashboard shell, in an iFrame
     * @return
     */
    public Boolean getEmbedded();
    public void setEmbedded(Boolean isSecondary);


    public Integer getOrder();
    public void setOrder(Integer order);

    /**
     * Internal name, to use as i18n key for translation or for code lookups (is app X registered)
     * @return
     */
    public String getSlug();
    public void setSlug(String slug);

    public String getLabel();
    public void setLabel(String label);

    /**
     * Path to new app.
     * if it starts with "://" it will reload the whole browser, if it doesn't it will be a local page in the app-dashboard app
     * @return
     */
    public String getPath();
    public void setPath(String path);

    /**
     * No roles means that everyone can see it
     * @return
     */
    public List<String> getRoles();
    public void setRoles(List<String> roles);
}
