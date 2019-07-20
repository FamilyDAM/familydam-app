package com.familydam.repository.apps.browser;

import com.familydam.repository.services.fs.FsListService;
import com.familydam.repository.utils.NodeToMapUtil;
import org.apache.jackrabbit.commons.JcrUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.jcr.*;
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
    public String listHtml(Model model, @RequestParam(name="path", defaultValue = "/") String path) throws LoginException, RepositoryException
    {

        Session session = repo.login(new SimpleCredentials("admin", "admin".toCharArray()));
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
