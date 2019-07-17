package com.familydam.repository.apps.browser;

import com.familydam.repository.services.fs.FsListService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.jcr.*;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Controller
public class AppBrowser {

    Logger log = LoggerFactory.getLogger(AppBrowser.class);


    @Autowired
    Repository repo;

    @Autowired
    FsListService fsListService;



    @GetMapping(value = {"/app/browse", "/app/browse.html", "/app/browser", "/app/browser.html"})
    public ModelAndView listHtml(HttpServletRequest request, Model model, @RequestParam(name="path", defaultValue = "/") String path) throws LoginException, RepositoryException
    {

        Session session = repo.login(new SimpleCredentials("admin", "admin".toCharArray()));
        List<Map> nodes = fsListService.listNodes(session, path);
        model.addAttribute("nodes", nodes);

        if(  path.startsWith("/") ){
            model.addAttribute("parent", session.getRootNode().getPath());
        }else {
            model.addAttribute("parent", session.getNode(path).getParent().getPath());
        }


        ModelAndView mv = new ModelAndView();
        mv.setViewName("browser");
        return mv;
    }


}
