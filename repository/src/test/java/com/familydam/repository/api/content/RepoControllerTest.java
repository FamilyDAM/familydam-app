package com.familydam.repository.api.content;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import javax.jcr.Repository;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = RepoBrowser.class)
public class RepoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private Repository repository;


    // Get request with Param
    @Test
    public void repoHtml() throws Exception {
        MockitoAnnotations.initMocks(this);

        mockMvc.perform(get("/repo.html"))
            .andExpect(status().isOk())
            .andExpect(view().name("repo"));
            //.andExpect(model().attribute("node", equals("I Love Kotlin!")))
            //.andExpect(content().string(containsString("Hello, I Love Kotlin!")));
    }

    // Get request with Param
    @Test
    public void repoJson() throws Exception {
        MockitoAnnotations.initMocks(this);

        mockMvc.perform(get("/repo"))
            .andExpect(status().isOk())
            .andExpect(view().name("repo"));
            //.andExpect(model().attribute("node", equals("I Love Kotlin!")))
            //.andExpect(content().string(containsString("Hello, I Love Kotlin!")));
    }
}
