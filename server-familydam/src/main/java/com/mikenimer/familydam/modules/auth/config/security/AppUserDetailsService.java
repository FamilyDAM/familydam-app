package com.mikenimer.familydam.modules.auth.config.security;

import com.mikenimer.familydam.modules.auth.models.User;
import com.mikenimer.familydam.modules.auth.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

public class AppUserDetailsService  implements UserDetailsService {

    UserRepository userRepository;

    @Autowired
    public AppUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        // the ui lets us use ID as the "username"
        Optional<User> user = userRepository.findById(s);
        if (!user.isPresent()) {
            throw new UsernameNotFoundException("Could not find user");
        }
        return new AppUserDetails(user.get());
    }
}
