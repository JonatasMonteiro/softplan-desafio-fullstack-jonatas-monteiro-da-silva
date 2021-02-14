import React, { Component } from "react";
import AuthService from "../services/auth.service";

// Componente da página de visualização de dados de um usuário
export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" }
    };
  }

  //// Método do ciclo de vida do componente, que executa o código contido quando o componente
      // é montado 
  componentDidMount() {
    const usr = AuthService.getCurrentUser()
    if(usr){
      const role = usr.role.substring(5).toLowerCase()
      if(role !== "admin"){
        this.props.history.push("/"+role)
      }
    }
    else{
      this.props.history.push("/login")
    }
   
    
  }

  // Método que retorna o usuário admin para sua página após este clickar no botão Voltar
  onClickReturn(){
    this.props.history.push("/admin")
  }

  // Método que redireciona o usuário para a página de edição do usuário visualizado
  onClickEdit(user){
    this.props.history.push({pathname: '/editUser', state: {usr: user}})
  }

  // Método que renderiza o componente na tela
  render() {

    const user = this.props.location.state.usr

    return (
      <div className="container">
        <div>
        <header className="jumbotron">
          <h3>
            Perfil de <i>{user.username}</i> 
          </h3>
        </header>
        <p>
          <strong>Id:</strong>{" "}
          {user.id}
        </p>
        <strong>Cargo:</strong>
        <ul>
        <li key={1}>{user.role.name}</li>
        </ul>
        <button onClick={() => this.onClickReturn()} type="button" className="btn btn-primary ml-auto ">Voltar</button>
      <button onClick={() => this.onClickEdit(user)} type="button" className="btn btn-primary pull-right">Editar Usuario</button>
      </div>

      </div>
    );
  }
}
