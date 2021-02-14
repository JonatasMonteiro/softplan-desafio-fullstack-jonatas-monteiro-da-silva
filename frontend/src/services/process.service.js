import axios from "axios"
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/processes/';

// Serviço com as requisições dos processos
class ProcessService {
    // Método que faz a requisição para retornar todos os processos
    getProcessesList(){
        return axios.get(API_URL+"list",{headers:authHeader()})
    }

    // Método que faz a requisição para a criação de um processo
    createProcess(title,description,usersToOpinat){
        return axios.post(API_URL+"create",{
            title,
            description,
            usersToOpinate: [usersToOpinat]
        }, {headers:authHeader()})
    }


    // Método que faz a requisição para trazer todos os usuários finalizadores
    getUsersFinalizadores(){
        return axios.get(API_URL+"listUsersFinalizador", {headers:authHeader()})
    }

    // Método que faz a requisição de indicação de um usuário a dar um parecer
    insertUsersToOpinate(processId,username){
        return axios.put(API_URL+processId+"/"+username,{}, {headers:authHeader()})
    }

    // Método que faz a requisição para pegar todos os processos que um determinado
    // usuário tem para dar o parecer
    getProcessesToOpinate(username){
        return axios.get(API_URL+"processToOpinate/"+username,{headers:authHeader()})
    }

    // Método que faz a requisição para um usuário dar o seu parecer em um processo
    opinate(processId, username, opinion){
        return axios.post(API_URL+processId+"/"+username,opinion,{headers:authHeader(1)})
    }



}

export default new ProcessService();