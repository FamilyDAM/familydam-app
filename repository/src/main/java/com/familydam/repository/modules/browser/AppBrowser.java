package com.familydam.repository.modules.browser;

import com.familydam.repository.models.ContentNode;
import com.familydam.repository.modules.auth.models.AdminUser;
import com.familydam.repository.modules.files.services.FsListService;
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
import org.springframework.web.servlet.ModelAndView;

import javax.jcr.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;
import java.util.List;

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
    public ModelAndView listHtml(Principal principal, Model model, HttpServletResponse response,  @RequestParam(name="path", defaultValue = "/") String path) throws LoginException, RepositoryException
    {
        ModelAndView mv = new ModelAndView();

        if( false && principal == null ){
            try {
                response.sendRedirect("/index.html");
            }catch (IOException ex){}

            return null;
        }


        Session session = repo.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
        List<ContentNode> nodes = fsListService.listNodes(session, path);
        mv.addObject("nodes", nodes);


        Node node = JcrUtils.getNodeIfExists( path, session );
        mv.addObject("properties", NodeToMapUtil.convert(node, false) );


        if(  path.startsWith("/") ){
            mv.addObject("parent", session.getRootNode().getPath());
        }else {
            mv.addObject("parent", session.getNode(path).getParent().getPath());
        }


        mv.setViewName("browser/browser");
        return mv;
    }


}
