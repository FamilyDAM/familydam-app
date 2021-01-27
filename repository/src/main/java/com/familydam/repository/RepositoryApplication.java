package com.familydam.repository;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;

import javax.annotation.PostConstruct;

@SpringBootApplication
public class RepositoryApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(RepositoryApplication.class, args);
        //PhotoExifParserService p = context.getBean(PhotoExifParserService.class);
        //AddUserFilesService a = context.getBean(AddUserFilesService.class);
        //System.out.println(a.toString());
    }

    @PostConstruct
    public void doS(ApplicationContext context){
        System.out.println("start");
    }

}
