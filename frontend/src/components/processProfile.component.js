import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";

// Componente da página de visualização dos dados de um processo específico
export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" }
    };
  }

   // Método do ciclo de vida do componente, que executa o código contido quando o componente
      // é montado
  componentDidMount() {
    const usr = AuthService.getCurrentUser()
    if(usr){
      const role = usr.role.substring(5).toLowerCase()
      if(role !== "triador"){
        this.props.history.push("/"+role)
      }
    }
    else{
      this.props.history.push("/login")
    }
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/login" });
    this.setState({ currentUser: currentUser, userReady: true })
  }

  // Método que redireciona o usuário triador de volta para a sua página após clickar no botão
  // Voltar
  onClickReturn(){
    this.props.history.push("/triador")
  }

  // Método que renderiza o componente na tela
  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const process = this.props.location.state.proces;
    const opinions = new Map(Object.entries(process.opinions));
    const usernamesAndOpinions = []
    opinions.forEach((value,key) => usernamesAndOpinions.push(key+":"+value))
    

    return (
      <div className="container">
        <header className="jumbotron">
          <h3>
            Dados do processo <i>{process.title}</i> 
          </h3>
        </header>
        <p>
          <strong>Id:</strong>{" "}
          {process.id}
        </p>
        <strong>Usuarios para dar o parecer:</strong>
        <ul>
            {process.usersToOpinate && process.usersToOpinate.map(user =>
                 <li>{user}</li>
            )}
       
        </ul>
        <strong>Pareceres:</strong>
        <ul>
            {usernamesAndOpinions && usernamesAndOpinions.map(userAndOpinion =>
                 <li>{userAndOpinion}</li>
            )}
       
        </ul>
        <button onClick={() => this.onClickReturn()} type="button" className="btn btn-primary ml-auto ">Voltar</button>

      </div>
    );
  }
}
