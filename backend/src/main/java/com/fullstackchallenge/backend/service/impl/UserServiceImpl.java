package com.fullstackchallenge.backend.service.impl;

import java.util.*;
import java.util.stream.Collectors;

import com.fullstackchallenge.backend.exception.DuplicateUsernameException;
import com.fullstackchallenge.backend.exception.RoleChangeException;
import com.fullstackchallenge.backend.model.Role;
import com.fullstackchallenge.backend.model.User;
import com.fullstackchallenge.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

// Classe que implementa a camada de serviço dos usuários
@Service(value = "userService")
public class UserServiceImpl implements UserDetailsService, UserService {
    // Aqui como não foi utilizado banco de dados, os usuarios ficam contidos em uma lista estática
    private List<User> userList = new ArrayList<>(Arrays.asList(

            new User(1,"admin","$2y$12$ARKRNDgIdQDJFcIP7yh/EOyKQwqnoxSI74Qw4kU.5ieKXfqZ7m02.",new Role(1,"ADMIN","admin")),
            new User(2,"adm","$2y$12$ARKRNDgIdQDJFcIP7yh/EOyKQwqnoxSI74Qw4kU.5ieKXfqZ7m02.",new Role(1,"ADMIN","admin")),
            new User(3,"triador","$2y$12$ARKRNDgIdQDJFcIP7yh/EOyKQwqnoxSI74Qw4kU.5ieKXfqZ7m02.",new Role(2,"TRIADOR","Usuario Triador")),
            new User(4,"finalizador","$2y$12$ARKRNDgIdQDJFcIP7yh/EOyKQwqnoxSI74Qw4kU.5ieKXfqZ7m02.",new Role(3,"FINALIZADOR","Usuario Finalizador"))

    ));


    private BCryptPasswordEncoder bcryptEncoder;

    @Autowired
    public UserServiceImpl(BCryptPasswordEncoder bcryptEncoder){
        this.bcryptEncoder = bcryptEncoder;
    }


    // Metodo que carrega um usuario pelo seu username
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = findByUsername(username);
        if(user == null){
            throw new UsernameNotFoundException("Invalid username or password.");
        }
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), getAuthority(user));
    }

    // Metodo que gera um cargo para um usuario
    private Set<SimpleGrantedAuthority> getAuthority(User user) {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName()));
        return authorities;
    }

    // Método que retorna todos os usuários
    @Override
    public List<User> findAll() {
        return userList;
    }

    // Metodo que retorna todos os usuarios finalizadores
    @Override
    public List<User> findAllFinalizador(){
        return userList.stream().filter(user -> user.getRole().getName().equals("FINALIZADOR")).collect(Collectors.toList());
    }

    // Metodo que retorna um usuário pelo seu username
    @Override
    public User findByUsername(String username){
        try {
            return userList.stream().filter(user -> user.getUsername().equals(username)).findFirst().get();
        }
        catch (NoSuchElementException e){
            return null;
        }
    }

    // Método que retorna um usuário pelo seu id
    @Override
    public User findById(long id){
        try {
            return userList.stream().filter(user -> user.getId() == id).findFirst().get();
        }
        catch (NoSuchElementException e){
            return null;
        }
    }

    // Método que atualiza os dados de um usuário.
    // Caso haja uma tentativa de trocar o cargo de um usuário, retorna-se uma exceção
    @Override
    public void update(User user) throws RoleChangeException {
        user.setPassword(bcryptEncoder.encode(user.getPassword()));
        int counter = 0;
        for(User userItem : userList){
            if(userItem.getId() == user.getId()){
                if(userItem.getRole().getName().equals(user.getRole().getName())){
                    userList.set(counter,user); }
                else{
                    throw new RoleChangeException("Changing role of user is forbidden");
                }
            }
            counter++;
        }
    }

    // Método que se exclui um usuário dado seu id
    @Override
    public void delete(long id){
        userList.removeIf(user -> user.getId() == id);
    }

    // Método onde se é criado um usuário.
    @Override
    public User create(User user)  throws DuplicateUsernameException {
        User checkUser = findByUsername(user.getUsername());
        if(checkUser != null){
            throw new DuplicateUsernameException("This username already exists: "+ user.getUsername());
        }
        user.setPassword(bcryptEncoder.encode(user.getPassword()));

        user.setId(user.getIdCount() + 1);
        user.increaseIdCount();
        userList.add(user);
        return user;
    }
}
