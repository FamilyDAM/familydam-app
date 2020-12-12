package com.mikenimer.familydam.modules.auth.config;


import com.mikenimer.familydam.modules.auth.config.security.AppUserDetailsService;
import com.mikenimer.familydam.modules.auth.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@Configuration
@EnableWebSecurity(debug = false)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    //Logger log = LoggerFactory.getLogger(WebSecurityConfig.class);

    UserRepository userRepository;

    @Autowired
    public WebSecurityConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Bean
    public UserDetailsService userDetailsService() {
        return new AppUserDetailsService(userRepository);
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authenticationProvider());
    }


    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .cors().and().csrf().disable()
            .sessionManagement().invalidSessionUrl("/index.html")
            .and()
                .authorizeRequests()
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


}
