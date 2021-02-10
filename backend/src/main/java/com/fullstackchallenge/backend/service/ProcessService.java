package com.fullstackchallenge.backend.service;

import com.fullstackchallenge.backend.model.Process;

import java.util.List;

// Interface que corresponde a camada de serviço do processo
public interface ProcessService {
    Process create(Process process);
    Process findById(long id);
    List<Process> findAll();
    void includeUserToOpinate(long processId,long userId);
    List<Process> getProcessToOpinateFromUser(long userId);
    void opinate(long processId,long userId,String opinion);
}
