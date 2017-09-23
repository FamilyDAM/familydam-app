package com.familydam.apps.files.registry;

import com.familydam.core.registry.IClientApp;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.osgi.service.component.ComponentContext;

import java.util.ArrayList;
import java.util.List;

@Service({IClientApp.class})
@Component(immediate = true)
public class UserManagerClientApp implements IClientApp
{

    ComponentContext context;
    Boolean isPrimary = true;
    Boolean isSecondary = false;
    List<String> roles = new ArrayList<>();
    String label = "User Manager";
    String path = "/app-usermanager/index.html";

    @Activate
    protected void activate(ComponentContext context) {
        this.context = context;
    }

    protected void deactivate(ComponentContext context) {
        this.context = null;
    }


    public Boolean isPrimary() {
        return isPrimary;
    }

    public void setIsPrimary(Boolean isPrimary) {
        isPrimary = isPrimary;
    }

    public Boolean isSecondary() {
        return isSecondary;
    }

    public void setIsSecondary(Boolean isSecondary) {
        isSecondary = isSecondary;
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

    @Override
    public List<String> getRoles() {
        return roles;
    }

    @Override
    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
