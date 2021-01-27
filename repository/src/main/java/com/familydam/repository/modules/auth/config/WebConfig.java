package com.familydam.repository.modules.auth.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowCredentials(true)
            .allowedHeaders("*")
            .allowedMethods("*")
            .allowedOriginPatterns("*");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/home").setViewName("forward:/home/index.html");
        registry.addViewController("/files").setViewName("forward:/files/index.html");
        registry.addViewController("/usermanager").setViewName("forward:/usermanager/index.html");
    }
}
