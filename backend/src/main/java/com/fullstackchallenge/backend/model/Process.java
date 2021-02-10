package com.fullstackchallenge.backend.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

// Classe que modela um prcesso
public class Process {
    private long id;

    private String title;

    private String description;

    private List<Long> usersToOpinate;

    private HashMap<Long,String> opinions;


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
    public Process(long id,String title,String description, List<Long> usersToOpinate){
        this.id = id;
        this.title = title;
        this.description = description;
        this.usersToOpinate = usersToOpinate;
        this.opinions = new HashMap<>();
    }
    public Process(){}

    public HashMap<Long, String> getOpinions() {
        return opinions;
    }

    public void setOpinions(HashMap<Long, String> opinions) {
        this.opinions = opinions;
    }

    public List<Long> getUsersToOpinate() {
        return usersToOpinate;
    }

    public void setUsersToOpinate(List<Long> usersToOpinate){
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
