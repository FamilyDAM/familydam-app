package com.mikenimer.familydam;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.hateoas.config.EnableHypermediaSupport;

@Slf4j
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
@EnableHypermediaSupport(type = EnableHypermediaSupport.HypermediaType.HAL)
public class FamilyGraphApplication {
    public static void main(String[] args) {
        SpringApplication.run(FamilyGraphApplication.class, args);
    }
}
