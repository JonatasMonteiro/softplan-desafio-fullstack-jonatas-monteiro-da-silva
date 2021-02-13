package com.fullstackchallenge.backend.service;

import com.fullstackchallenge.backend.exception.DuplicateUsernameException;
import com.fullstackchallenge.backend.exception.RoleChangeException;
import com.fullstackchallenge.backend.model.User;

import java.util.List;

// Inteface que corresponde a camada de serviço de usuario
public interface UserService {
    User create(User user) throws DuplicateUsernameException;
    User findByUsername(String username);
    List<User> findAll();
    User findById(long id );
    void update(User user) throws RoleChangeException;
    List<User> findAllFinalizador();
    void delete(long id);
}
