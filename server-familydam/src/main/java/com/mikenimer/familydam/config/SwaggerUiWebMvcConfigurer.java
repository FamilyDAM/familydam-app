package com.mikenimer.familydam.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
public class SwaggerUiWebMvcConfigurer implements WebMvcConfigurer {
    private final String baseUrl;

    public SwaggerUiWebMvcConfigurer(String baseUrl) {
        this.baseUrl = baseUrl;
    }


    @Bean
    public Docket coreApi() {
        return new Docket(DocumentationType.SWAGGER_2)
            .groupName("System")
                .select()
                .apis(RequestHandlerSelectors.basePackage("org.springframework.boot.actuate"))
                .paths(PathSelectors.any())
                .build()
            .groupName("Core")
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.mikenimer.familydam.modules.core"))
                .paths(PathSelectors.any())
                .build()
            .groupName("Files")
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.mikenimer.familydam.modules.files"))
                .paths(PathSelectors.any())
                .build()
            .useDefaultResponseMessages(false)
            .apiInfo(getApiInfo())
            .pathMapping("/");
    }

    private ApiInfo getApiInfo() {
        //Contact contact = Contact("Mike Nimer", "", "");
        return new ApiInfoBuilder()
            .title("FamilyDAM Api")
            .description("API to access FamilyDAM Resources")
            .version("1.0.0")
            .build();
    }



    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String baseUrl = StringUtils.trimTrailingCharacter(this.baseUrl, '/');
        registry.
            addResourceHandler(baseUrl + "/swagger-ui/**")
            .addResourceLocations("classpath:/META-INF/resources/webjars/springfox-swagger-ui/")
            .resourceChain(false);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController(baseUrl + "/swagger-ui/")
            .setViewName("forward:" + baseUrl + "/swagger-ui/index.html");
    }
}