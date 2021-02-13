package com.fullstackchallenge.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fullstackchallenge.backend.config.TokenProvider;
import com.fullstackchallenge.backend.exception.DuplicateUsernameException;
import com.fullstackchallenge.backend.model.AuthToken;
import com.fullstackchallenge.backend.model.Process;
import com.fullstackchallenge.backend.service.UserService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class ProcessControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenProvider jwtTokenUtil;

    private AuthToken tokenTriador;

    private AuthToken tokenFinalizador;

    private Authentication authenticationTriador;

    private Authentication authenticationFinalizador;


    private ObjectMapper mapper;

    private ObjectWriter ow;

    @Before
    public void setup() throws DuplicateUsernameException {
        authenticationTriador = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        "triador",
                        "1234"
                )
        );
        authenticationFinalizador = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        "finalizador",
                        "1234"
                )
        );


        mapper = new ObjectMapper();
        mapper.configure(SerializationFeature.WRAP_ROOT_VALUE, false);
        ow = mapper.writer().withDefaultPrettyPrinter();
    }

    @Test
    public void testListAll() throws Exception{
        SecurityContextHolder.getContext().setAuthentication(authenticationTriador);
        tokenTriador = jwtTokenUtil.generateToken(authenticationTriador);
        MvcResult result = mockMvc.perform(get("/processes/list")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization","Bearer "+tokenTriador.getToken()))
                .andExpect(status().isOk())
                .andReturn();
        String resultAsString = result.getResponse().getContentAsString();
        assertTrue(resultAsString.contains("title"));
        assertTrue(resultAsString.contains("second_title"));

    }

    @Test
    public void testListAllUsersFinalizadores() throws Exception{
        SecurityContextHolder.getContext().setAuthentication(authenticationTriador);
        tokenTriador = jwtTokenUtil.generateToken(authenticationTriador);
        MvcResult result = mockMvc.perform(get("/processes/listUsersFinalizador")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization","Bearer "+tokenTriador.getToken()))
                .andExpect(status().isOk())
                .andReturn();
        String resultAsString = result.getResponse().getContentAsString();
        assertTrue(resultAsString.contains("FINALIZADOR"));

    }

    @Test
    public void testGetProcess() throws Exception{
        SecurityContextHolder.getContext().setAuthentication(authenticationTriador);
        tokenTriador = jwtTokenUtil.generateToken(authenticationTriador);
        MvcResult result = mockMvc.perform(get("/processes/1")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization","Bearer "+tokenTriador.getToken()))
                .andExpect(status().isOk())
                .andReturn();
        String resultAsString = result.getResponse().getContentAsString();
        assertTrue(resultAsString.contains("title"));
    }

    @Test
    public void testCreateProcess() throws Exception{
        Process processToBeCreated = new Process(3,"third_title","another description");
        String requestJson=ow.writeValueAsString(processToBeCreated);
        SecurityContextHolder.getContext().setAuthentication(authenticationTriador);
        tokenTriador = jwtTokenUtil.generateToken(authenticationTriador);
        MvcResult result = mockMvc.perform(post("/processes/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson)
                .header("Authorization","Bearer "+tokenTriador.getToken()))
                .andExpect(status().isOk())
                .andReturn();
        String resultAsString = result.getResponse().getContentAsString();
        assertTrue(resultAsString.contains("third_title"));
    }

    @Test
    public void testInsertUserToOpinate() throws Exception{
        SecurityContextHolder.getContext().setAuthentication(authenticationTriador);
        tokenTriador = jwtTokenUtil.generateToken(authenticationTriador);
        MvcResult result = mockMvc.perform(put("/processes/2/finalizador")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization","Bearer "+tokenTriador.getToken()))
                .andExpect(status().isOk())
                .andReturn();
        String resultAsString = result.getResponse().getContentAsString();
        assertEquals(resultAsString,"User of username: finalizador included to opinate into process of id 2 - second_title");
    }

    @Test
    public void testGetProcessToOpinate() throws Exception{
        SecurityContextHolder.getContext().setAuthentication(authenticationFinalizador);
        tokenFinalizador = jwtTokenUtil.generateToken(authenticationFinalizador);
        MvcResult result = mockMvc.perform(get("/processes/processToOpinate/finalizador")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization","Bearer "+tokenFinalizador.getToken()))
                .andExpect(status().isOk())
                .andReturn();
        String resultAsString = result.getResponse().getContentAsString();
        assertTrue(resultAsString.contains("title"));

    }

    @Test
    public void testOpinate() throws Exception{
        SecurityContextHolder.getContext().setAuthentication(authenticationFinalizador);
        tokenFinalizador = jwtTokenUtil.generateToken(authenticationFinalizador);
        MvcResult result = mockMvc.perform(post("/processes/1/finalizador")
                .contentType(MediaType.TEXT_PLAIN)
                .content("Opinion test")
                .header("Authorization","Bearer "+tokenFinalizador.getToken()))
                .andExpect(status().isOk())
                .andReturn();
        String resultAsString = result.getResponse().getContentAsString();
        assertEquals(resultAsString,"User of username finalizador opinated on process of id 1 - title");
    }
}
