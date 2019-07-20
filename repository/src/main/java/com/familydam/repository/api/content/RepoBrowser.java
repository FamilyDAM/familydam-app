package com.familydam.repository.api.content;

import com.familydam.repository.services.fs.FsListService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.jcr.*;
import java.util.List;

@Controller
public class RepoBrowser {

    Logger log = LoggerFactory.getLogger(RepoBrowser.class);


    @Autowired
    Repository repo;

    @Autowired
    FsListService fsListService;



    @GetMapping(value = {"/dam:content", "/dam:content/**"})
    @ResponseBody
    public List listPath(ServerHttpRequest request) throws LoginException, RepositoryException
    {
        Session session = repo.login(new SimpleCredentials("admin", "admin".toCharArray()));
        String path = request.getURI().getPath().replaceFirst("\\/repo\\/?", "");

        return fsListService.listNodes(session, path);
    }


}
