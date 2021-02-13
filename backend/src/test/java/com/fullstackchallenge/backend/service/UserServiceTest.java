package com.fullstackchallenge.backend.service;

import com.fullstackchallenge.backend.exception.DuplicateUsernameException;
import com.fullstackchallenge.backend.exception.RoleChangeException;
import com.fullstackchallenge.backend.model.Role;
import com.fullstackchallenge.backend.model.User;
import org.junit.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserServiceTest {
    @Autowired
    private UserService userService;



    @Test
    public void testFindAll(){
        List<User> userList = userService.findAll();
        assertThat(userList).isNotNull().isNotEmpty();
    }

    @Test
    public void testFindAllFinalizadores(){
        List<User> userList = userService.findAllFinalizador();
        assertThat(userList).isNotNull().isNotEmpty().allMatch(user -> user.getRole().getName().equals("FINALIZADOR"));
    }

    @Test
    public void testFindById(){
        User user = userService.findById(1);
        assertTrue(user.getId() == 1);
    }

    @Test
    public void testFindByUsername(){
        User user = userService.findByUsername("admin");
        assertEquals(user.getUsername(),"admin");
    }

    @Test
    public void testUpdate(){
        User user = new User(1,"adm","3214",new Role(1,"ADMIN","admin"));
        try{
            userService.update(user);
        }
        catch (RoleChangeException e){
            e.printStackTrace();
        }
        User testUser = userService.findByUsername("adm");
        assertEquals(testUser.getUsername(),"adm");
    }

    @Test
    public void testCreate(){
        User user = new User("tester","3214",new Role(2,"TRIADOR","Usuario Triador"));
        try {
            System.out.println(user.getIdCount());
            userService.create(user);
        }
        catch (DuplicateUsernameException e){
            e.printStackTrace();
        }
        User testUser = userService.findByUsername("tester");
        assertEquals(user.getUsername(),testUser.getUsername());
    }

    @Test
    public void testDelete(){
        userService.delete(3);
        User testUser = userService.findById(3);
        assertNull(testUser);
    }


}
