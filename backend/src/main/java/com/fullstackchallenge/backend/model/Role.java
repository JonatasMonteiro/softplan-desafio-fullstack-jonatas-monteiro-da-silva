package com.fullstackchallenge.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;


// Classe que modela um cargo de usuario
public class Role {

    private long id;

    private String name;

    private String description;

    @JsonIgnore
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Role(long id,String name,String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public Role(){}
}
