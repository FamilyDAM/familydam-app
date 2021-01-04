package com.mikenimer.familydam.modules.files.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.ModelAndView;

import java.security.Principal;

@Controller
public class FileImageController {

    @GetMapping(path = "/files/image/{id}.{ext}")
    public ModelAndView getImage(Principal principal, @PathVariable String id, @PathVariable String ext) {
        //todo: @see https://www.baeldung.com/spring-mvc-image-media-data
        return null;
    }
}
