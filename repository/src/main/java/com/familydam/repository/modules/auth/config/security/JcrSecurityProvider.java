package com.familydam.repository.modules.auth.config.security;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.jcr.Repository;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import java.util.ArrayList;
import java.util.List;

public class JcrSecurityProvider implements AuthenticationProvider
{
    Repository repository;

    public JcrSecurityProvider(Repository repository) {
        this.repository = repository;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }



    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        Object credentials = authentication.getCredentials();
        String name = authentication.getName();
        String password = credentials.toString();
        //System.out.println("credentials class: " + credentials.getClass());


        try {
            //BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            String pwd = password.trim();//encoder.encode(password);

            SimpleCredentials simpleCredentials = new SimpleCredentials(name, pwd.toCharArray());
            Session session = repository.login(simpleCredentials);

            List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
            grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_FAMILY_ADMIN"));
            grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_FAMILY_MEMBER"));
            Authentication auth = new JcrAuthToken(name, simpleCredentials, grantedAuthorities);


            return auth;
        }catch( Exception ex){
            throw new BadCredentialsException(ex.getMessage(), ex);
        }
    }
}
