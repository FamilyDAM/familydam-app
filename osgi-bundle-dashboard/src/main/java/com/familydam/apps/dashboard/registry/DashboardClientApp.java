package com.familydam.apps.dashboard.registry;

import com.familydam.core.apps.IClientApp;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;

import java.util.Collections;
import java.util.List;

@Service({IClientApp.class})
@Component(immediate = true)
public class DashboardClientApp implements IClientApp
{
    Boolean primary = true;
    Boolean secondary = false;
    Boolean embedded = false;
    Integer order = 0;
    String slug = "home";
    String label = "Home";
    String path = "://index.html";
    List<String> roles = Collections.EMPTY_LIST;

    
    public Boolean getPrimary() {
        return primary;
    }

    public void setPrimary(Boolean primary) {
        this.primary = primary;
    }

    public Boolean getSecondary() {
        return secondary;
    }

    public void setSecondary(Boolean secondary) {
        this.secondary = secondary;
    }

    public Boolean getEmbedded() {
        return embedded;
    }

    public void setEmbedded(Boolean embedded) {
        this.embedded = embedded;
    }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    
    public String getSlug() {
        return slug;
    }

    
    public void setSlug(String slug) {
        this.slug = slug;
    }

    
    public String getLabel() {
        return label;
    }

    
    public void setLabel(String label) {
        this.label = label;
    }

    
    public String getPath() {
        return path;
    }

    
    public void setPath(String path) {
        this.path = path;
    }

    
    public List<String> getRoles() {
        return roles;
    }

    
    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
