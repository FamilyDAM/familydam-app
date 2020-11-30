package com.mikenimer.familydam.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;


@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter
{
    //Logger log = LoggerFactory.getLogger(WebSecurityConfig.class);


    @Override
    public void configure(AuthenticationManagerBuilder builder) throws Exception {
        builder.eraseCredentials(false);
        //builder.authenticationProvider(new JcrSecurityProvider(repository));
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .cors().and().csrf().disable()
            .sessionManagement().invalidSessionUrl("/index.html")
            .and()
            .httpBasic()
            .and()
                .authorizeRequests()
                .antMatchers("/**").permitAll()
                .anyRequest().authenticated()
            //.loginProcessingUrl("/perform_login")
            .and()
                .logout()
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID");

    }



}
