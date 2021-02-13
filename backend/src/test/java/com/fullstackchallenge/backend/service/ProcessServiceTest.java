package com.fullstackchallenge.backend.service;

import com.fullstackchallenge.backend.model.Process;
import org.apache.tomcat.jni.Proc;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.stream.Collectors;

import static org.junit.Assert.*;
import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ProcessServiceTest {
    @Autowired
    private ProcessService processService;

    @Test
    public void testFindAll(){
        List<Process> processes = processService.findAll();
        assertThat(processes).isNotNull().isNotEmpty().allMatch(process -> process.getTitle().contains("title"));
    }

    @Test
    public void testFindById(){
        Process process = processService.findById(1);
        assertEquals(process.getTitle(),"title");
    }

    @Test
    public void testCreate(){
        processService.create(new Process("third_title","another_description"));
        Process process = processService.findById(3);
        assertEquals(process.getTitle(),"third_title");
    }

    @Test
    public void testIncludeUserToOpinate(){
        processService.includeUserToOpinate(2,"finalizador");
        Process process = processService.findById(2);
        assertTrue(process.getUsersToOpinate().contains("finalizador"));
    }

    @Test
    public void testGetProcessToOpinateFromUser(){
        List<Process> processes = processService.getProcessToOpinateFromUser("finalizador");
        assertTrue(processes.get(0).getUsersToOpinate().contains("finalizador"));
    }

    @Test
    public void testOpinate(){
        processService.opinate(1,"finalizador","Opinion test");
        Process process = processService.findById(1);
        assertEquals(process.getOpinions().get("finalizador"),"Opinion test");

    }
}
