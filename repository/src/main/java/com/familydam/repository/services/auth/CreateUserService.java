package com.familydam.repository.services.auth;

import com.familydam.repository.Constants;
import com.familydam.repository.utils.NodeToMapUtil;
import org.apache.jackrabbit.JcrConstants;
import org.apache.jackrabbit.api.JackrabbitSession;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.api.security.user.UserManager;
import org.apache.jackrabbit.value.BooleanValue;
import org.apache.jackrabbit.value.StringValue;
import org.springframework.stereotype.Service;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.Map;


@Service
public class CreateUserService {


    public Map createUser(Session session_, Map user_) throws RepositoryException {
        UserManager userManager = ((JackrabbitSession) session_).getUserManager();

        Object username = user_.get(":name").toString().toLowerCase();
        Object pwd = user_.get("pwd").toString();
        Object isFamilyAdmin = new Boolean(user_.get(Constants.IS_FAMILY_ADMIN).toString());
        User _user = userManager.createUser((String) username, (String) pwd);


        _user.setProperty(Constants.FIRST_NAME, new StringValue((String)user_.get(Constants.FIRST_NAME)));
        _user.setProperty(Constants.LAST_NAME, new StringValue((String)user_.get(Constants.LAST_NAME)));
        _user.setProperty(Constants.EMAIL, new StringValue((String)user_.get(Constants.EMAIL)));
        _user.setProperty(Constants.IS_FAMILY_ADMIN, new BooleanValue( (Boolean)isFamilyAdmin ));
        session_.save();


        // make sure the user has an UUID
        Node userNode = session_.getNode(_user.getPath());
        userNode.addMixin(JcrConstants.MIX_REFERENCEABLE);
        //userNode.addMixin(Constants.MIXIN_DAM_EXTENSIBLE);
        //userNode.addMixin(Constants.MIXIN_DAM_USER);
        session_.save();


        return NodeToMapUtil.convert(userNode);
    }
}
