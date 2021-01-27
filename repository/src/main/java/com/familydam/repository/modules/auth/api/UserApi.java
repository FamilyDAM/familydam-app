package com.familydam.repository.modules.auth.api;

import com.familydam.repository.Constants;
import com.familydam.repository.modules.auth.config.security.JcrAuthToken;
import com.familydam.repository.modules.auth.models.AdminUser;
import com.familydam.repository.modules.auth.models.User;
import com.familydam.repository.modules.auth.services.CreateUserService;
import com.familydam.repository.modules.auth.services.GetUserService;
import com.familydam.repository.modules.auth.services.UpdateUserService;
import com.familydam.repository.modules.auth.services.UserListService;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.Authorizable;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.mediatype.hal.HalModelBuilder;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.jcr.Repository;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;
import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;


@RestController
@RequestMapping("/api/v1/auth")
public class UserApi {

    @Autowired
    Repository repository;

    @Autowired
    CreateUserService createUserService;

    @Autowired
    GetUserService getUserService;

    @Autowired
    UpdateUserService updateUserService;

    @Autowired
    UserListService userListService;

    @Autowired
    AdminUser adminUser;


    @CrossOrigin
    @GetMapping(value = {"/user/me"})
    @ResponseBody
    public EntityModel<User> authenticatedUser(Principal principal) throws Exception
    {
        if( principal == null ){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        Session session = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));

        User user = getUserService.getUser(session, (String)((JcrAuthToken) principal).getPrincipal() );
        if( user == null ){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        //self link
        Link link = WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserApi.class).authenticatedUser(principal)).withSelfRel();

        return EntityModel.of(user, link);
    }



    @GetMapping(value = {"/user/{username}"})
    @ResponseBody
    public ResponseEntity getUserByName(Principal principal, @PathVariable String username)
    {
        if( principal == null ){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        try {
            Session session = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));

            User user = getUserService.getUser(session, username);
            if (user == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }

            return ResponseEntity.ok(user);
        }catch (RepositoryException ex){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }


    /**
     * Create New User or update user
     * @param principal
     * @param request
     * @return
     * @throws Exception
     */
    @PostMapping(value={"/user", "/user/{username}"})
    public ResponseEntity createUser(Principal principal, HttpServletRequest request, @PathVariable(required = false) String username) throws Exception
    {
        Session session = null;
        Session adminSession = repository.login(new SimpleCredentials(adminUser.username, adminUser.password.toCharArray()));
        if( principal != null ){
            //Check permission of user, needs to be family admin
            session = repository.login(((JcrAuthToken)principal).getCredentials());
        }

        Map newParams = new HashMap();
        Map params = request.getParameterMap();
        for (Object key : params.keySet()) {
            if( key.equals("id") ) {
                newParams.put(key, UUID.randomUUID().toString());
            }else{
                newParams.put(key, request.getParameter((String) key));
            }
        }

        Map user;
        try {
            if (username == null) {
                //Create
                if(userListService.listUsers(adminSession, true).size() == 0) {
                    newParams.put(Constants.IS_SYSTEM_ADMIN, true);
                }

                user = createUserService.createUser(adminSession, newParams);


            } else {
                //Edit
                UserManager userManager = ((JackrabbitSession) adminSession).getUserManager();
                Authorizable authorizable = userManager.getAuthorizable(principal.getName());

                if( authorizable.getID().equalsIgnoreCase(username )  //edit yourself
                    || authorizable.getProperty(Constants.IS_FAMILY_ADMIN)[0].getBoolean() //family admins can edit anyone
                    || (authorizable.hasProperty(Constants.IS_SYSTEM_ADMIN) && authorizable.getProperty(Constants.IS_SYSTEM_ADMIN)[0].getBoolean()) //super admins can edit anyone
                 ) {
                    //update isFamilyAdmin, if it's a super admin - just in case someone tries to turn off the isFamilyAdmin flag
                    if( authorizable.getID().equalsIgnoreCase(username )
                        && (authorizable.hasProperty(Constants.IS_SYSTEM_ADMIN)
                            && authorizable.getProperty(Constants.IS_SYSTEM_ADMIN)[0].getBoolean()) ){
                        newParams.put(Constants.IS_FAMILY_ADMIN, true);
                    }

                    user = updateUserService.updateUser(adminSession, username, newParams);
                }else{
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN);
                }
            }


            //convert map to model
            User _user = User.builder().withMap(user).build();

            //return with Hateos link
            RepresentationModel model = HalModelBuilder
                .emptyHalModel()
                .embed(EntityModel.of(_user))
                .link(WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(UserApi.class).getUserByName(principal, _user.getName())).withSelfRel())
                .build();

            return ResponseEntity.ok(model);

        }catch (Exception ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }

    }

}