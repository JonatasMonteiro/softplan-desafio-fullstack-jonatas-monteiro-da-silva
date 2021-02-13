package com.fullstackchallenge.backend.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

// Classe que modela um usuario
public class User {
    private static int idCount = 4;

    public static void increaseIdCount(){
        idCount += 1;
    }

    @JsonIgnore
    public int getIdCount(){
        return idCount;
    }

    private long id;

    private String username;


    private String password;

    private Role role;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @JsonIgnore
    public String getPassword() {
        return password;
    }

    @JsonProperty
    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public User(String username, String password, Role role){
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public User(long id, String username, String password, Role role){
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public User(){}
}