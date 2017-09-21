package com.familydam.core.registry;

import java.util.List;

public interface IClientApp
{
    public Boolean isPrimary();
    public void setIsPrimary(Boolean isPrimary);

    public Boolean isSecondary();
    public void setIsSecondary(Boolean isSecondary);

    public String getLabel();
    public void setLabel(String label);

    public String getPath();
    public void setPath(String path);

    public List<String> getRoles();
    public void setRoles(List<String> roles);
}
