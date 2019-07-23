package com.familydam.repository.api.v1.auth;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
public class Login {

    @PostMapping(value = {"/api/v1/auth/login"})
    @ResponseBody
    public Map listUssers(HttpServletRequest request) throws Exception {
        return null;
    }
}