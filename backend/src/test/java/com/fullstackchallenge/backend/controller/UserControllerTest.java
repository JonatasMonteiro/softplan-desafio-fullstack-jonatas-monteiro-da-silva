package com.fullstackchallenge.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fullstackchallenge.backend.config.TokenProvider;
import com.fullstackchallenge.backend.exception.DuplicateUsernameException;
import com.fullstackchallenge.backend.model.LoginUser;
import com.fullstackchallenge.backend.model.Role;
import com.fullstackchallenge.backend.model.User;
import com.fullstackchallenge.backend.service.UserService;
import com.fullstackchallenge.backend.service.impl.UserServiceImpl;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;


    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenProvider jwtTokenUtil;

    private static UserService userService;

    private String token;


    private ObjectMapper mapper;

    private ObjectWriter ow;


    @Before
    public void setup() throws DuplicateUsernameException {
        final Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        "admin",
                        "1234"
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        token = jwtTokenUtil.generateToken(authentication);
        mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.WRAP_ROOT_VALUE, false);
        ow = mapper.writer().withDefaultPrettyPrinter();
    }

    @Test
    public void testAuthentication() throws JsonProcessingException,Exception {
        LoginUser anObject = new LoginUser();
        anObject.setUsername("admin");
        anObject.setPassword("1234");
        String requestJson=ow.writeValueAsString(anObject );

        MvcResult result = mockMvc.perform(post("/users/authenticate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isOk()).andReturn();
        assertTrue(result.getResponse().getContentAsString().contains("token"));
    }

    @Test
    public void testList() throws Exception {
        MvcResult result = mockMvc.perform(get("/users/list")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization","Bearer "+token))
                .andExpect(status().isOk())
                .andReturn();
        String resultAsString = result.getResponse().getContentAsString();
        assertTrue(resultAsString.contains("admin"));
    }

    @Test
    public void testGetUser() throws  Exception{
        MvcResult result = mockMvc.perform(get("/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization","Bearer "+token))
                .andExpect(status().isOk())
                .andReturn();
        String resultAsString = result.getResponse().getContentAsString();
        assertTrue(resultAsString.contains("admin"));
    }

    @Test
    public void testCreateUser() throws Exception{
        User userToCreate = new User("triador_two","1234",new Role(2,"TRIADOR","Usuario Triador"));

        String requestJson=ow.writeValueAsString(userToCreate);
        MvcResult result = mockMvc.perform(post("/users/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson)
                .header("Authorization","Bearer "+token))
                .andExpect(status().isOk())
                .andReturn();
        String resultAsString = result.getResponse().getContentAsString();
        assertTrue(resultAsString.contains("triador"));
    }

    @Test
    public void testUpdateUser() throws Exception{
        User userToUpdate = new User(2,"adminn","1234",new Role(2,"ADMIN","admin"));

        String requestJson=ow.writeValueAsString(userToUpdate);
        MvcResult result = mockMvc.perform(put("/users/2")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson)
                .header("Authorization","Bearer "+token))
                .andExpect(status().isOk())
                .andReturn();
        String resultAsString = result.getResponse().getContentAsString();
        assertEquals(resultAsString,"User of id 2 was updated sucessfully");
    }

    @Test
    public void testDeleteUser() throws Exception{
        MvcResult result = mockMvc.perform(delete("/users/2")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
        String resultAsString = result.getResponse().getContentAsString();
        assertEquals(resultAsString,"User of id 2 was deleted sucessfully");
    }

}
