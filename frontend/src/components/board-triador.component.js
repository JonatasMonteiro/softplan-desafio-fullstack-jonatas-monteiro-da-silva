import React, { Component } from "react";

import ProcessService from "../services/process.service";
import AuthService from "../services/auth.service"

// Componente com a visão do usuario triador, que contem uma lista dos processos existentes
export default class BoardTriador extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: []
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
    if(this.props.location.state){
      this.setState({message:this.props.location.state.message})
      console.log(this.state.message)
      setTimeout(() => this.setState({message:null}),2000)
    }
    ProcessService.getProcessesList().then(
      response => {
        console.log(response.data)
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
 // Método que redireciona o sistema para a página de criação de um processo
  onClickCreate(){
    this.props.history.push("/createProcess")
  }

  // Método que redireciona o sistema para a página de visualização de um processo
  onClickVisualize(process) {
    this.props.history.push({pathname:"/processProfile", state:{proces:process}})
  }

  // Método que redireciona o sistema para a página onde o usuário indica outro para dar o parecer
  onClickInsertUsersToOpinate(){
    this.props.history.push("/insertUsersToOpinate")
  }

  // Método que renderiza o componente na tela
  render() {
    const content = this.state.content
    console.log(content);
    return (
      <div>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Descrição</th>
              <th>Usuarios a dar parecer</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {content && content.map(process => 
            <tr>
              <th scope="row">{process.id}</th>
              <td>{process.title}</td>
              <td>{process.description}</td>
              <td><ul>{process.usersToOpinate.map(users => <li>{users}</li>)}</ul></td>
              <td> <div className="btn-group mr-2" role="group" aria-label="Second group">
            <button onClick={() => this.onClickVisualize(process)}  type="button" className="btn btn-secondary"><i className="fa fa-search"></i></button>
            
               </div></td>
              </tr>)}
          </tbody>
      </table>
      <button onClick={() => this.onClickCreate()} type="button" className="btn btn-primary">Criar Processo </button>
      <button onClick={() => this.onClickInsertUsersToOpinate()}  type="button" className="btn btn-primary pull-right">Requisitar Parecer</button>
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
