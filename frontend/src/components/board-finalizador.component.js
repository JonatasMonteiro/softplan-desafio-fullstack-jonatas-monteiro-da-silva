import React, { Component } from "react";

import ProcessService from "../services/process.service"
import AuthService from "../services/auth.service"

// Componente com a visão do usuário Finalizador, que mostra todos os processos
// que o usuario logado tem para dar o parecer
export default class BoardFinalizador extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: [],
      message: "",
    };
  }

  // Metodo que redireciona o sistema para a página onde o usuario da o parecer
  onClickOpinate(processId){
    this.props.history.push({pathname:"/opinate",state:{processId:processId}})
  }


  // Método do ciclo de vida do componente, que executa o código contido quando o componente
  // é montado
  componentDidMount() {
    const usr = AuthService.getCurrentUser()
    if(usr){
      const role = usr.role.substring(5).toLowerCase()
      if(role !== "finalizador"){
        this.props.history.push("/"+role)
      }
    }
    else{
      this.props.history.push("/login")
    }
    if(this.props.location.state){
      this.setState({message:this.props.location.state.message})
      console.log(this.state.message)
      setTimeout(() => this.setState({message:null}),2000)
    }
    const user = AuthService.getCurrentUser();
    ProcessService.getProcessesToOpinate(user.username).then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  // Método que renderiza o componente na tela  
  render() {
    const content = this.state.content;
    return (
      <div>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>#</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {content && content.map(process => 
          <tr>
            <th scope="row">{process.id}</th>
            <td>{process.title}</td>
            <td>{process.description}</td>
            <td> <div className="btn-group mr-2" role="group" aria-label="Second group">
          <button onClick={() => this.onClickOpinate(process.id)}  type="button" className="btn btn-secondary"><i className="fa fa-pencil"></i></button>
          
             </div></td>
            </tr>)}
        </tbody>
    </table>
    {this.state.message && (
                  <div className="form-group">
                    <div className="alert alert-success" role="alert">
                      {this.state.message}
                    </div>
                  </div>
                )}
    </div>
    );
  }
}
