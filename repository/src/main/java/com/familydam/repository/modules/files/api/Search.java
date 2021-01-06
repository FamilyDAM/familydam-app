package com.familydam.repository.modules.files.api;

import com.familydam.repository.modules.auth.config.security.JcrAuthToken;
import com.familydam.repository.modules.auth.models.AdminUser;
import com.familydam.repository.modules.files.services.FsListService;
import com.familydam.repository.modules.files.services.FsSearchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.jcr.Repository;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
public class Search {

    Logger log = LoggerFactory.getLogger(Search.class);


    @Autowired
    AdminUser adminUser;

    @Autowired
    Repository repo;

    @Autowired
    FsListService fsListService;

    @Autowired
    FsSearchService fsSearchService;


    @PostMapping(value = {"/search"})
    @ResponseBody
    public ResponseEntity searchPath(Principal principal, HttpServletRequest request) throws IOException, RepositoryException
    {
        //Session session = repo.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
        Session session = repo.login(((JcrAuthToken)principal).getCredentials());

        String path = request.getParameter("path");
        String type = request.getParameter("type");
        String group = request.getParameter("group");
        String orderField = request.getParameter("order.field");
        String orderDirection = request.getParameter("order.direction");
        int offset = request.getParameter("offset")!=null?new Integer(request.getParameter("offset")):0;
        int limit = request.getParameter("limit")!=null?new Integer(request.getParameter("limit")):200;

        List<Map> results = fsSearchService.search(session, path, type, group, orderField, orderDirection, limit, offset);
        return ResponseEntity.ok(results);
    }


}
