package com.mikenimer.familydam.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class TemplatesConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**").addResourceLocations("classpath:/static/");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        //registry.addViewController("/").setViewName("index");
        registry.addViewController("/").setViewName("forward:/index.html");
        //forward requests to /admin and /user to their index.html
        //registry.addViewController("/files").setViewName("forward:/files/index.html");
        //registry.addViewController("/user").setViewName("forward:/user/index.html");
    }

    @ResponseStatus(HttpStatus.NOT_IMPLEMENTED)
    public class NotYetImplemented extends Exception {
        public NotYetImplemented(String message) {
            super(message);
        }
    }

    @ResponseStatus(HttpStatus.FORBIDDEN)
    public class ForbiddenException extends Exception {
        public ForbiddenException(String message) {
            super(message);
        }
    }
}
