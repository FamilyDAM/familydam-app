package com.familydam.repository.modules.auth.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Service
public class SystemAccountFilter implements Filter {

    private ServletContext context;

    @Value("${spring.security.user.name}")
    String adminUserName;

    @Override
    public void init(FilterConfig fConfig) throws ServletException {
        this.context = fConfig.getServletContext();
        this.context.log("RequestLoggingFilter initialized");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication auth = securityContext.getAuthentication();

        if( auth.getPrincipal().toString().equalsIgnoreCase(adminUserName) ) {
            HttpServletResponse resp = (HttpServletResponse) response;
            response.resetBuffer();
            resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
        }else {
            // pass the request along the filter chain
            chain.doFilter(request, response);
        }
    }
}
