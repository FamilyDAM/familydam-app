package com.familydam.repository.config.apps;

import org.springframework.stereotype.Controller;

import java.util.Collections;
import java.util.List;

@Controller
public class RepoBrowserClientApp implements IClientApp
{
    Boolean primary = false;
    Boolean secondary = true;
    Boolean embedded = false;
    Integer order = 10;
    String slug = "repository_browser";
    String label = "Repository Browser";
    String path = "://bin/browser.html";
    List<String> roles = Collections.EMPTY_LIST;


    public Boolean getPrimary() {
        return primary;
    }

    public void setPrimary(Boolean primary) {
        primary = primary;
    }

    public Boolean getSecondary() {
        return secondary;
    }

    public void setSecondary(Boolean secondary) {
        secondary = secondary;
    }

    public Boolean getEmbedded() {
        return embedded;
    }

    public void setEmbedded(Boolean embedded) {
        embedded = embedded;
    }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    @Override
    public String getSlug() {
        return slug;
    }

    @Override
    public void setSlug(String slug) {
        this.slug = slug;
    }

    @Override
    public String getLabel() {
        return label;
    }

    @Override
    public void setLabel(String label) {
        this.label = label;
    }

    @Override
    public String getPath() {
        return path;
    }

    @Override
    public void setPath(String path) {
        this.path = path;
    }

    @Override
    public List<String> getRoles() {
        return roles;
    }

    @Override
    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
