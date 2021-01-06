package com.familydam.repository.config;

import com.familydam.repository.modules.auth.config.security.JcrSecurityProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import javax.jcr.Repository;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter
{
    Logger log = LoggerFactory.getLogger(WebSecurityConfig.class);

    @Autowired
    Repository repository;



    @Override
    public void configure(AuthenticationManagerBuilder builder) throws Exception {
        builder.eraseCredentials(false);
        builder.authenticationProvider(new JcrSecurityProvider(repository));
    }


    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors()
            .and()
                .csrf().disable()
                .sessionManagement().invalidSessionUrl("/index.html")
            .and()
                .authorizeRequests()
                .antMatchers(HttpMethod.OPTIONS,"*").permitAll()
                .antMatchers("/index.html").permitAll()
                .antMatchers("/init.html").permitAll()
                .antMatchers("/login").permitAll()
                .antMatchers("/logout").permitAll()
                .antMatchers("/auth/**/*.*").permitAll()
                .antMatchers("/fonts/**/*.*").permitAll()
                .antMatchers("/images/**/*.*").permitAll()
                .antMatchers("/core/api/**").permitAll()
                .anyRequest().authenticated()
            //.loginProcessingUrl("/perform_login")
            .and()
                .httpBasic()
                .realmName("FamilyDAM")
            .and()
                .formLogin()
                .loginProcessingUrl("/login")
                .loginPage("/index.html")
                .usernameParameter("user")
                .passwordParameter("password")
                .defaultSuccessUrl("/home/index.html", true)
                .failureUrl("/index.html?m=invalidLogin")
                .permitAll()
            .and()
                // If user isn't authorised to access a path...
                .exceptionHandling()
                // ...redirect them to /403
                .accessDeniedPage("/index.html?m=notAuthorized")
            .and()
                .logout()
                .logoutUrl("/logout")
                .logoutSuccessUrl("/index.html")
                .invalidateHttpSession(true)
                .clearAuthentication(true)
                .deleteCookies("JSESSIONID");

    }

//
//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//        http
//            .cors()
//            .and()
//                .csrf().disable()
//                .sessionManagement()
//                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
//                .invalidSessionUrl("/index.html")
//            .and()
//                .authorizeRequests()
//                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//                .antMatchers("/index.html").permitAll()
//                .antMatchers("/auth/**/*.*").permitAll()
//                .antMatchers("/fonts/**/*.*").permitAll()
//                .antMatchers("**/fonts/**/*.*").permitAll()
//                .antMatchers("/images/**/*.*").permitAll()
//                .antMatchers("**/images/**/*.*").permitAll()
//                .antMatchers("/static/css/**/*.*").permitAll()
//                .antMatchers("**/templates/css/**/*.*").permitAll()
//                .antMatchers("/static/js/**/*.*").permitAll()
//                .antMatchers("**/templates/js/**/*.*").permitAll()
//                .antMatchers("/favicon.ico").permitAll()
//                .antMatchers("*.js").permitAll()
//                .antMatchers("*.*.js").permitAll()
//                .antMatchers("/manifest.json").permitAll()
//                .antMatchers("/**/manifest.json").permitAll()
//                .antMatchers("/precache-manifest.*.js").permitAll()
//                .antMatchers("/service-worker.js").permitAll()
//                .antMatchers("/webdav").permitAll()
//                .antMatchers("/api/v1/auth/user").permitAll()
//                .antMatchers("/api/v1/auth/users").permitAll()
//                .antMatchers("/api/v1/core/clientapps").permitAll()
//                .antMatchers("/app/**").permitAll()
//                .anyRequest().authenticated()
//            //.loginProcessingUrl("/perform_login")
//            .and()
//                .httpBasic()
//                .realmName("FamilyDAM")
//            .and()
//                .formLogin()
//                .loginProcessingUrl("/login")
//                .loginPage("/index.html")
//                .usernameParameter("username")
//                .passwordParameter("password")
//                .defaultSuccessUrl("/home/index.html", true)
//                .failureUrl("/index.html?m=invalidLogin")
//                .permitAll()
//            .and()
//                // If user isn't authorised to access a path...
//                .exceptionHandling()
//                // ...redirect them to /403
//                .accessDeniedPage("/index.html?m=notAuthorized")
//            .and()
//                .logout()
//                .logoutUrl("/logout")
//                .logoutSuccessUrl("/index.html?m=loggedout")
//                .invalidateHttpSession(true)
//                .clearAuthentication(true)
//                .deleteCookies("JSESSIONID");
//
//    }



}
