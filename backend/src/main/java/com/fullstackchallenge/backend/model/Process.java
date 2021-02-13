package com.fullstackchallenge.backend.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

// Classe que modela um prcesso
public class Process {
    private long id;

    private String title;

    private String description;

    private List<String> usersToOpinate;

    private HashMap<String,String> opinions;


    public Process(String title,String description){
        this.title = title;
        this.description = description;
        this.usersToOpinate = new ArrayList<>();
        this.opinions = new HashMap<>();
    }

    public Process(long id,String title,String description){
        this.id = id;
        this.title = title;
        this.description = description;
        this.usersToOpinate = new ArrayList<>();
        this.opinions = new HashMap<>();
    }
    public Process(long id,String title,String description, List<String> usersToOpinate){
        this.id = id;
        this.title = title;
        this.description = description;
        this.usersToOpinate = usersToOpinate;
        this.opinions = new HashMap<>();
    }
    public Process(){}

    public HashMap<String, String> getOpinions() {
        return opinions;
    }

    public void setOpinions(HashMap<String, String> opinions) {
        this.opinions = opinions;
    }

    public List<String> getUsersToOpinate() {
        return usersToOpinate;
    }

    public void setUsersToOpinate(List<String> usersToOpinate){
        this.usersToOpinate = usersToOpinate;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
