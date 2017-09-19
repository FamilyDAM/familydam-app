package com.familydam.apps.files.registry;

import com.familydam.core.registry.IClientApp;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.osgi.service.component.ComponentContext;

@Service({IClientApp.class})
@Component(immediate = true)
public class FilesClientApp implements IClientApp
{
    ComponentContext context;
    String label = "Files";
    String path = "/apps/app-files/index.html";

    @Activate
    protected void activate(ComponentContext context) {
        this.context = context;
    }

    protected void deactivate(ComponentContext context) {
        this.context = null;
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
}
