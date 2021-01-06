package com.familydam.repository.modules.auth.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        //registry.addMapping("/**");
        registry.addMapping("/**")
            .allowCredentials(true)
            .allowedHeaders("*")
            .allowedMethods("*")
            .allowedOriginPatterns("*");
            //.allowedOrigins("http://localhost:9000", "http://localhost:3000");
            //.allowedMethods("OPTIONS", "PUT", "POST", "GET", "DELETE")
//        //.allowedOrigins("*")
//
//        registry.addMapping("/**")
//            .allowedHeaders("*")
//            .allowedMethods("*")
//            .allowedOriginPatterns("*")
//            .allowCredentials(true);
    }

}
