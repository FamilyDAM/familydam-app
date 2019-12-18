package com.familydam.repository.config;

import com.familydam.repository.apps.webdav.WebDavServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import javax.jcr.Repository;

@Service
public class WebDavConfig {

    Logger log = LoggerFactory.getLogger(WebDavConfig.class);

    @Autowired
    Repository repository;

    @Value("${server.port}")
    String port;


    @Bean
    public ServletRegistrationBean webdav(){
        log.info("Initializing WEBDAV server: http://<username>:<password>@localhost:" +port +"/webdav/");
        return new ServletRegistrationBean(new WebDavServer(repository), "/webdav/*");
    }



}
