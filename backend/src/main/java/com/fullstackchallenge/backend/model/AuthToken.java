package com.fullstackchallenge.backend.model;

// Classe modelo do token de autenticação
public class AuthToken {

    private String token;

    private String role;

    private String username;


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }


    public String getRole(){
        return this.role;
    }

    public void setRole(String role){
        this.role = role;
    }

    public AuthToken(String token, String role){
        this.token = token;
        this.role = role;

    }

    public AuthToken(){}

    public AuthToken(String token){
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

}