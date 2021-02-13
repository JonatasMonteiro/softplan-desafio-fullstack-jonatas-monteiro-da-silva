import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/users/';

class UserService {

  getUserList() {
    return axios.get(API_URL + 'list', { headers: authHeader() });
  }

  editUser(id,username,password, role){
    return axios.put(API_URL+id, {
      id,
      username,
      password,
      role
    }, {headers:authHeader()})
  }

  createUser(username,password,role){
    return axios.post(API_URL+"create", {username,password,role}, {headers:authHeader()})
  }

  deleteUser(id){
    return axios.delete(API_URL+id, {headers: authHeader()})
  }
}

export default new UserService();
