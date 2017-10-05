package com.familydam.core.apps;

import com.familydam.core.FamilyDAMCoreConstants;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;

import java.util.Arrays;
import java.util.List;


@Service({IClientApp.class})
@Component(immediate = true)
public class SystemConsoleClientApp implements IClientApp
{
    Boolean primary = false;
    Boolean secondary = true;
    Boolean embedded = false;
    Integer order = 11;
    String slug = "system_console";
    String label = "System Console";
    String path = "://system/console";
    List<String> roles = Arrays.asList(FamilyDAMCoreConstants.FAMILY_ADMIN_GROUP);


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
