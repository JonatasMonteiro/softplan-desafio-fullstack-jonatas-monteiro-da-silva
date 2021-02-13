package com.fullstackchallenge.backend.controller;

import com.fullstackchallenge.backend.config.TokenProvider;
import com.fullstackchallenge.backend.exception.DuplicateUsernameException;
import com.fullstackchallenge.backend.exception.RoleChangeException;
import com.fullstackchallenge.backend.model.AuthToken;
import com.fullstackchallenge.backend.model.LoginUser;
import com.fullstackchallenge.backend.model.User;
import com.fullstackchallenge.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/* Classe do controlador que gerencia os endpoints referentes as operações de usuários(CRUD) */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenProvider jwtTokenUtil;


    private UserService userService;

    @Autowired
    public UserController(UserService userService){
        this.userService = userService;
    }

    // Endpoint onde se realiza a autenticação do usuário
    @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
    public ResponseEntity<?> generateToken(@RequestBody LoginUser loginUser) throws AuthenticationException {

        final Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginUser.getUsername(),
                        loginUser.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        final AuthToken token = jwtTokenUtil.generateToken(authentication);
        token.setUsername(loginUser.getUsername());
        return ResponseEntity.ok(token);
    }

    // Endpoint onde são listados todos os usuários. Apenas usuários com visão de administrador tem acesso a esse endpoint
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public ResponseEntity<?> listUsers(){
        List<User> users = userService.findAll();
        if(users.isEmpty()){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("There are no users created yet"); }
        else{
            return ResponseEntity.ok(users);
        }
    }

    // Endpoint que devolve um usuário específico de acordo com o id passado por parâmetro.
    // Retorna um BAD_REQUEST caso o id passado nao corresponda a nenhum usuário.
    // Apenas administradores tem acesso
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/{id}",method = RequestMethod.GET)
    public ResponseEntity<?> getUser(@PathVariable("id") long id){
        User user = userService.findById(id);
        if(user == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This id matches no user");
        }
        else{
            return ResponseEntity.ok(user);
        }
    }

    // Endpoint onde se atualiza os dados de um usuário. Apenas administadores tem acesso.
    // O usuario deve ser enviado no corpo da requisição
    // Retorna um BAD_REQUEST caso o id do usuario nao corresponsa a nenhum existente
    // Caso haja tentativa de alterar o cargo de um usuario, também retorna um BAD_REQUEST
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateUser(@PathVariable("id") long id ,@RequestBody User user){
        User userFromId = userService.findById(id);
        if(userFromId == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This id matches no user");
        }
        else{
            try {
                userService.update(user);
            }
            catch (RoleChangeException e){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Changing role of user is forbidden");
            }
            return ResponseEntity.ok("User of id "+ id+ " was updated sucessfully");
        }
    }

    // Endpoint onde se exclui um usuario.
    // É passado por parâmetro o id do usuário a ser excluído.
    // Novamente caso o id passado não corresponda a nenhum usuário, retorna um BAD_REQUEST
    // Apenas administradores tem acesso
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value = "/{id}",method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteUser(@PathVariable("id") long id){
        User userFromId = userService.findById(id);
        if(userFromId == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This id matches no user");
        }
        else{
            userService.delete(id);
            return ResponseEntity.ok("User of id "+ id + " was deleted sucessfully");
        }
    }

    // Endpoint onde se cria um usuário.
    // É passado os dados do usuario no corpo da requisição
    // Caso o nome de usuario já exista, retorna um BAD_REQUEST
    // Apenas administradores tem acesso
    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value="/create", method = RequestMethod.POST)
    public ResponseEntity<?> saveUser(@RequestBody User user) {
        try {
            User userCreated = userService.create(user);
            return ResponseEntity.ok("User of id "+userCreated.getId()+ " succesfully created");
        } catch (DuplicateUsernameException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This username already exists: "+ user.getUsername());
        }
    }



}
