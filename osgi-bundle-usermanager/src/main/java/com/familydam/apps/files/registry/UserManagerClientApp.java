package com.familydam.apps.files.registry;

import com.familydam.core.apps.IClientApp;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;

import java.util.Collections;
import java.util.List;

@Service({IClientApp.class})
@Component(immediate = true)
public class UserManagerClientApp implements IClientApp
{
    Boolean primary = false;
    Boolean secondary = true;
    Boolean embedded = false;
    Integer order = 1;
    String slug = "user_manager";
    String label = "User Manager";
    String path = "://app-usermanager/index.html";
    List<String> roles = Collections.EMPTY_LIST;

    @Override
    public Boolean getPrimary() {
        return primary;
    }

    @Override
    public void setPrimary(Boolean primary) {
        this.primary = primary;
    }

    @Override
    public Boolean getSecondary() {
        return secondary;
    }

    @Override
    public void setSecondary(Boolean secondary) {
        this.secondary = secondary;
    }

    @Override
    public Boolean getEmbedded() {
        return embedded;
    }

    @Override
    public void setEmbedded(Boolean embedded) {
        this.embedded = embedded;
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
