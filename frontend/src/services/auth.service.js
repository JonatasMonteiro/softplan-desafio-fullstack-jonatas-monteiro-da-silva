import axios from "axios";

const API_URL = "http://localhost:8080/users/";

// Serviço que cuida das requisições de login e do logout, além de retornar o usuário logado
class AuthService {
  // Método da requisição de login
  login(username, password) {
    return axios
      .post(API_URL + "authenticate", {
        username,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  // Método que realiza o logout
  logout() {
    localStorage.removeItem("user");
  }
 

  // Método que retorna o usuário logado
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();
