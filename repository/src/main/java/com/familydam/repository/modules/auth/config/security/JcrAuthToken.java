package com.familydam.repository.modules.auth.config.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import javax.jcr.Credentials;
import java.util.Collection;

public class JcrAuthToken extends UsernamePasswordAuthenticationToken implements Credentials
{
    public JcrAuthToken(Object principal, Object credentials) {
        super(principal, credentials);
    }

    public JcrAuthToken(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities) {
        super(principal, credentials, authorities);
    }

    public Credentials getCredentials() {
        return (Credentials)super.getCredentials();
    }

    @Override
    public Object getPrincipal() {
        return super.getPrincipal();
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        super.setAuthenticated(isAuthenticated);
    }

    @Override
    public void eraseCredentials() {
        super.eraseCredentials();
    }

    @Override
    public void setDetails(Object details) {
        super.setDetails(details);
    }


}
