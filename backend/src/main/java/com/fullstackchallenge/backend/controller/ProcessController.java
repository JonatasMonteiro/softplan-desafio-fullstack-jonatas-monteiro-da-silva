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
    private UserService userService;

    @Autowired
    private TokenProvider jwtTokenUtil;

    // Endpoint onde se é criado um processo.
    // Os dados do processo são enviados no corpo da requisição
    // Apenas usuários triadores tem acesso
    @PreAuthorize("hasRole('TRIADOR')")
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ResponseEntity<?> createProcess(@RequestBody Process process){
        Process processCreated = processService.create(process);
        return ResponseEntity.ok("Processo de id "+ processCreated.getId() + " criado com sucesso");
    }

    // Endpoint onde se determina um usuario para dar o parecer em um determinado processo.
    // Ambos os ids do processo e do usuario são passados por parâmetro na url.
    // Se id do processo ou do usuario não corresponder a nenhum existente, retorna um BAD_REQUEST
    // Apenas usuários triadores tem acesso
    @PreAuthorize("hasRole('TRIADOR')")
    @RequestMapping(value = "/{id}/{username}",method = RequestMethod.PUT)
    public ResponseEntity<?> insertUserToOpinate(@PathVariable("username") String username, @PathVariable("id") long processId){
        Process process = processService.findById(processId);
        if(process == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("O id não corresponde a nenhum processo conhecido");
        }
        User user = userService.findByUsername(username);
        if(user == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Esse username não corresponde a nenhum usuário");
        }
        processService.includeUserToOpinate(processId,username);
        return ResponseEntity.ok("Usuario de username: "+ username + " incluído a dar parecer no processo "+ processId+ " - "+ process.getTitle());
    }

    // Endpoint onde se retornam todos os usuarios finalizadores para possível indicação a dar parecer
    @PreAuthorize("hasRole('TRIADOR')")
    @RequestMapping(value = "/listUsersFinalizador", method = RequestMethod.GET)
    public ResponseEntity<?> getUsersFinalizador(){
        return ResponseEntity.ok(userService.findAllFinalizador());
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("O id não corresponde a nenhum processo conhecido");
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
    @RequestMapping(value = "/processToOpinate/{username}",method = RequestMethod.GET)
    public ResponseEntity<?> getProcessToOpinate(@RequestHeader("Authorization") String token,@PathVariable("username") String username){
        User user = userService.findByUsername(username);
        token = token.substring(7);
        String usrname = jwtTokenUtil.getUsernameFromToken(token);
        if(user == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Esse username não corresponde a nenhum usuário");
        }
        if(!username.equals(usrname)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem autorização para ver os processos desse usuário");
        }
            return ResponseEntity.ok(processService.getProcessToOpinateFromUser(username));

    }

    // Endpoint onde o usuario finalizador da o parecer em um processo.
    // Os ids do usuario e do processo são passados por parâmetro na url
    // Caso o id do usuário ou do processo não corresponda a nenhum existente, retorna um BAD_REQUEST
    // Caso o usuario tente dar o parecer em um processo do qual ele não tenha sido requerido, retorna um erro FORBIDDEN
    // Apenas usuarios finalizadores tem acesso.
    @PreAuthorize("hasRole('FINALIZADOR')")
    @RequestMapping(value = "/{id}/{username}",method = RequestMethod.POST)
    public ResponseEntity<?> opinate(@RequestHeader("Authorization") String token,
                                     @RequestBody String opinion, @PathVariable("id") long processId, @PathVariable("username") String username){
        token = token.substring(7);
        String usrname = jwtTokenUtil.getUsernameFromToken(token);
        Process process = processService.findById(processId);
        if(process == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("O id não corresponde a nenhum processo conhecido");
        }
        User user = userService.findByUsername(username);
        if(user == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Esse username não corresponde a nenhum usuárioo");
        }
        if(!username.equals(usrname)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não pode dar o parecer como outro usuário");
        }
        List<Process> processesFromUser = processService.getProcessToOpinateFromUser(username)
                .stream().filter(processItem -> processItem.getId() == processId).collect(Collectors.toList());
        if(processesFromUser.isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Você não tem parecer a dar nesse processo");
        }
        processService.opinate(processId,username,opinion);
        return ResponseEntity.ok("Usuario de username: "+ username + " deu seu parecer no processo de id "+ processId + " - "+process.getTitle());
    }
}
