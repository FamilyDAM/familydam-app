package com.familydam.repository.apps.browser;

import com.familydam.repository.models.AdminUser;
import com.familydam.repository.services.fs.FsListService;
import com.familydam.repository.utils.NodeToMapUtil;
import org.apache.jackrabbit.commons.JcrUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.jcr.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/app")
public class AppBrowser {

    Logger log = LoggerFactory.getLogger(AppBrowser.class);


    @Autowired
    Repository repo;

    @Autowired
    FsListService fsListService;

    @Autowired
    AdminUser adminUser;


    @GetMapping(value = {"/browse", "/browse.html", "/browser", "/browser.html"})
    public String listHtml(Principal principal, Model model, HttpServletResponse response,  @RequestParam(name="path", defaultValue = "/") String path) throws LoginException, RepositoryException
    {
        if( false && principal == null ){
            try {
                response.sendRedirect("/index.html");
            }catch (IOException ex){}

            return "";
        }

        //Session session = repo.login( ((JcrAuthToken)principal).getCredentials() );
        Session session = repo.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
        List<Map> nodes = fsListService.listNodes(session, path);
        model.addAttribute("nodes", nodes);

        if( nodes.size() == 0 ){
            Node node = JcrUtils.getNodeIfExists( path, session );
            model.addAttribute("properties", NodeToMapUtil.convert(node) );
        }

        if(  path.startsWith("/") ){
            model.addAttribute("parent", session.getRootNode().getPath());
        }else {
            model.addAttribute("parent", session.getNode(path).getParent().getPath());
        }


        return "browser";
    }


}
