import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/users/';

// Serviço que realiza as requisiçoes referentes aos usuários
class UserService {

  // Método que faz a requisição para trazer todos os usuários
  getUserList() {
    return axios.get(API_URL + 'list', { headers: authHeader() });
  }

  // Método que faz a requisição para a edição de um usuário
  editUser(id,username,password, role){
    return axios.put(API_URL+id, {
      id,
      username,
      password,
      role
    }, {headers:authHeader()})
  }

  // Método que faz a requisição para a criação de um usuário
  createUser(username,password,role){
    return axios.post(API_URL+"create", {username,password,role}, {headers:authHeader()})
  }

  // Método que faz a requisição para a exclusão de um usuário
  deleteUser(id){
    return axios.delete(API_URL+id, {headers: authHeader()})
  }
}

export default new UserService();
