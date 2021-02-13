package com.fullstackchallenge.backend.service.impl;

import com.fullstackchallenge.backend.model.Process;
import com.fullstackchallenge.backend.service.ProcessService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

// Implemetação da camada de serviço dos processos
@Service(value = "processService")
public class ProcessServiceImpl implements ProcessService {
    // Como não há acesso a banco de dados, os processos são armazenados em uma lista estática
    private List<Process> processList = new ArrayList<>(Arrays.asList(
            new Process(1,"title","description",new ArrayList<String>(
                    Arrays.asList("finalizador"))),
            new Process(2,"second_title","other description",new ArrayList<String>(
                    Arrays.asList("finalizador")))));


    // Metodo que corresponde a criação de um processo
    @Override
    public Process create(Process process){
        process.setId(processList.size()+1);
        processList.add(process);
        return process;
    }

    // Metodo que corresponde a busca de um processo pelo seu id
    @Override
    public Process findById(long id){
        try {
            return processList.stream().filter(process -> process.getId() == id).findFirst().get();
        }
        catch (NoSuchElementException e){
            return null;
        }
    }

    // Método que retorna todos os processos
    @Override
    public List<Process> findAll(){
        return processList;
    }

    // Método onde se é incluido um usuário a dar um parecer em um processo
    @Override
    public void includeUserToOpinate(long processId,String username){
        Process processFromId = processList.stream().filter(process -> process.getId() == processId).findFirst().get();
        processFromId.getUsersToOpinate().add(username);

    }

    // Metodo que retorna todos os processos a dar parecer de um determinado usuário
    @Override
    public List<Process> getProcessToOpinateFromUser(String username){
        return processList.stream().filter(process -> process.getUsersToOpinate().contains(username)).collect(Collectors.toList());
    }

    // Metodo onde o usuário realiza um parecer em um determinado processo
    @Override
    public void opinate(long processId,String username,String opinion){
        Process process = findById(processId);
        process.getOpinions().put(username,opinion);
        process.getUsersToOpinate().removeIf(usrname -> usrname == username);
    }

}
