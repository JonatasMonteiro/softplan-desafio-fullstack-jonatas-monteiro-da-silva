package com.fullstackchallenge.backend.service;

import com.fullstackchallenge.backend.model.Process;

import java.util.List;

// Interface que corresponde a camada de serviço do processo
public interface ProcessService {
    Process create(Process process);
    Process findById(long id);
    List<Process> findAll();
    void includeUserToOpinate(long processId,String username);
    List<Process> getProcessToOpinateFromUser(String username);
    void opinate(long processId,String username,String opinion);
}
