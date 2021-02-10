package com.fullstackchallenge.backend.controller;

import com.fullstackchallenge.backend.config.TokenProvider;
import com.fullstackchallenge.backend.model.Process;
import com.fullstackchallenge.backend.model.User;
import com.fullstackchallenge.backend.service.ProcessService;
import com.fullstackchallenge.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


/* Classe controladora que gerencia os endpoints dos processos */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/processes")
public class ProcessController {
    @Autowired
    private ProcessService processService;

    @Autowired
    private TokenProvider jwtTokenUtil;

    @Autowired
    private UserService userService;

    // Endpoint onde se é criado um processo.
    // Os dados do processo são enviados no corpo da requisição
    // Apenas usuários triadores tem acesso
    @PreAuthorize("hasRole('TRIADOR')")
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ResponseEntity<?> createProcess(@RequestBody Process process){
        return ResponseEntity.ok(processService.create(process));
    }

    // Endpoint onde se determina um usuario para dar o parecer em um determinado processo.
    // Ambos os ids do processo e do usuario são passados por parâmetro na url.
    // Se id do processo ou do usuario não corresponder a nenhum existente, retorna um BAD_REQUEST
    // Apenas usuários triadores tem acesso
    @PreAuthorize("hasRole('TRIADOR')")
    @RequestMapping(value = "/{id}/{userId}",method = RequestMethod.PUT)
    public ResponseEntity<?> insertUserToOpinate(@PathVariable("userId") long userId, @PathVariable("id") long processId){
        Process process = processService.findById(processId);
        if(process == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The process id matches no known process");
        }
        User user = userService.findById(userId);
        if(user == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The user id matches no known user");
        }
        processService.includeUserToOpinate(processId,userId);
        return ResponseEntity.ok("User of id "+ userId + " included to opinate into process of id "+ processId);
    }

    // Endpoint onde se listam todos os processos existentes
    // Apenas usuários triadores tem acesso
    @PreAuthorize("hasRole('TRIADOR')")
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public ResponseEntity<?> listAll(){
        return ResponseEntity.ok(processService.findAll());
    }

    // Endpoint onde se lista um processo específico
    // O id do processo a ser retornado é passado por parâmetro na url
    // Caso o id não corresponda a nenhum existente, retorna um BAD_REQUEST
    // Apenas usuarios triadores tem acesso
    @PreAuthorize("hasRole('TRIADOR')")
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getProcess(@PathVariable("id") long processId){
        Process process = processService.findById(processId);
        if(process == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The process id matches no known process");
        }
        else{
            return ResponseEntity.ok(process);
        }
    }

    // Endpoint onde se lista todos os processos que necessitam de parecer de um usuário específico.
    // O id do usuário é passado por parâmetro na url
    // Caso o id do usuário não corresponda a nenhum existente, retorna um BAD_REQUEST
    // Caso o usuario para o qual foi feita a requisição não corresponda ao usuário logado, retorna um erro FORBIDDEN
    // Apenas usuarios finalizadores tem acesso
    @PreAuthorize("hasRole('FINALIZADOR')")
    @RequestMapping(value = "/processToOpinate/{userId}",method = RequestMethod.GET)
    public ResponseEntity<?> getProcessToOpinate(@RequestHeader("Authorization") String token,@PathVariable("userId") long userId){
        User user = userService.findById(userId);
        token = token.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(token);
        if(user == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The user id matches no known user");
        }
        if(!user.getUsername().equals(username)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You have no authorization to see this user processes");
        }
            return ResponseEntity.ok(processService.getProcessToOpinateFromUser(userId));

    }

    // Endpoint onde o usuario finalizador da o parecer em um processo.
    // Os ids do usuario e do processo são passados por parâmetro na url
    // Caso o id do usuário ou do processo não corresponda a nenhum existente, retorna um BAD_REQUEST
    // Caso o usuario tente dar o parecer em um processo do qual ele não tenha sido requerido, retorna um erro FORBIDDEN
    // Apenas usuarios finalizadores tem acesso.
    @PreAuthorize("hasRole('FINALIZADOR')")
    @RequestMapping(value = "/{id}/{userId}",method = RequestMethod.POST)
    public ResponseEntity<?> opinate(@RequestHeader("Authorization") String token,
                                     @RequestBody String opinion, @PathVariable("id") long processId, @PathVariable("userId") long userId){
        token = token.substring(7);
        String username = jwtTokenUtil.getUsernameFromToken(token);
        Process process = processService.findById(processId);
        if(process == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The process id matches no known process");
        }
        User user = userService.findById(userId);
        if(user == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The user id matches no known user");
        }
        if(!user.getUsername().equals(username)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can't opinate as other user");
        }
        List<Process> processesFromUser = processService.getProcessToOpinateFromUser(userId)
                .stream().filter(processItem -> processItem.getId() == processId).collect(Collectors.toList());
        if(processesFromUser.isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You're not selected to opinate on this process");
        }
        processService.opinate(processId,userId,opinion);
        return ResponseEntity.ok("User of id "+ userId + " opinated on process of id "+ processId);
    }
}
