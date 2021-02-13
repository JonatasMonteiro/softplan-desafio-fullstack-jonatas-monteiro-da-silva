import axios from "axios"
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/processes/';

class ProcessService {
    getProcessesList(){
        return axios.get(API_URL+"list",{headers:authHeader()})
    }

    createProcess(title,description,usersToOpinat){
        return axios.post(API_URL+"create",{
            title,
            description,
            usersToOpinate: [usersToOpinat]
        }, {headers:authHeader()})
    }

    getProcessesFromUserToOpinate(userId){
        return axios.get(API_URL+"processToOpinate/"+userId, {headers:authHeader()})
    }

    getUsersFinalizadores(){
        return axios.get(API_URL+"listUsersFinalizador", {headers:authHeader()})
    }



}

export default new ProcessService();