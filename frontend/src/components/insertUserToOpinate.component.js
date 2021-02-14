import React, { Component } from "react";
import Form from "react-validation/build/form";
import Select from "react-validation/build/select"
import CheckButton from "react-validation/build/button";


import AuthService from "../services/auth.service"
import ProcessService from "../services/process.service"

// Método que garante que os campos estão preenchidos
const required = value => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          É necessário preencher esse campo
        </div>
      );
    }
  };


// Componente da requisição de usuários para dar seus pareceres
export default class InsertUsersToOpinate extends Component{
    constructor(props){
        super(props)
        this.onChangeProcess = this.onChangeProcess.bind(this);
        this.onChangeUser = this.onChangeUser.bind(this);
        this.onClickReturn = this.onClickReturn.bind(this);
        this.handleInsert = this.handleInsert.bind(this);

        this.state = {
            process: "",
            user: "",
            users: [],
            processes: [],
            successful: false,
            message: ""
          };
        }
        // Método do ciclo de vida do componente, que executa o código contido quando o componente
      // é montado
      componentDidMount(){
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
        ProcessService.getUsersFinalizadores().then(response =>{
        
            this.setState({users: response.data.map(user => user.username)})
        })
        ProcessService.getProcessesList().then(response => {
            this.setState({processes: response.data.map(process => {
                return {id:process.id,title:process.title}})})
        })
      }
      // Método que cuida da mudança de processo escolhido para receber o parecer
      onChangeProcess(e){
          console.log(e.target.value);
          this.setState({process: e.target.value})
      }
      
      // Método que cuida da mudança de usuário escolhido para dar o parecer
      onChangeUser(e){
          this.setState({user: e.target.value})
      }

      // Método que redireciona o usuário triador de volta para sua página após
      // o mesmo clickar no botão de Voltar
      onClickReturn(e){
        e.preventDefault()
        this.props.history.push("/triador")
    }

      // Método que cuida da submissão do formulário
      handleInsert(e){
          e.preventDefault()

          this.setState({
            message: "",
            successful: false
          });

          this.form.validateAll();

          if (this.checkBtn.context._errors.length === 0) {
            ProcessService.insertUsersToOpinate(this.state.process,this.state.user)
            .then(
                response => {
                  this.setState({
                    message: response.data,
                    successful: true
                  });
                  this.props.history.push({pathname:"/triador",state:{message:this.state.message}});
                  window.location.reload();
                },
                error => {
                  const resMessage =
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString();
        
                  this.setState({
                    successful: false,
                    message: resMessage
                  });
                }
              );
          }

      }


    // Método que cuida da renderização do componente na tela
    render(){
    
    const users = this.state.users;
    const processes = this.state.processes;
    return (
        <div className="col-md-12">
          <div className="card card-container">
              <p className="center">Requisitar Parecer</p>
  
            <Form
              onSubmit={this.handleInsert}
              ref={c => {
                this.form = c;
              }}
            >
              {!this.state.successful && (
                <div>
                    <div className="form-group">
                    <label htmlFor="process">Processo p/ parecer</label>
                    <Select
                      className="form-control"
                      name="processToOpinate"
                      value={this.state.process}
                      validations={[required]}
                      onChange={this.onChangeProcess}

                    >
                        <option value="">Escolha um processo</option>
                        {processes.map(process => <option value={process.id}>{process.title}</option>)}

                    </Select>
                  </div>
  
                  

                  <div className="form-group">
                    <label htmlFor="role">Usuario p/ parecer</label>
                    <Select
                      className="form-control"
                      name="userToOpinate"
                      value={this.state.user}
                      validations={[required]}
                      onChange={this.onChangeUser}

                    >
                        <option value="">Escolha um usuario</option>
                        {users.map(userr => <option value={userr}>{userr}</option>)}

                    </Select>
                  </div>
  
                  <div className="form-group">
                    <button className="btn btn-primary btn-block">Solicitar Parecer</button>
                    
                  </div>
                  <button onClick={this.onClickReturn} className="btn btn-primary btn-block">Voltar</button>
                </div>
              )}
  
              {this.state.message && (
                <div className="form-group">
                  <div
                    className={
                      this.state.successful
                        ? "alert alert-success"
                        : "alert alert-danger"
                    }
                    role="alert"
                  >
                    {this.state.message}
                  </div>
                </div>
              )}
              <CheckButton
                style={{ display: "none" }}
                ref={c => {
                  this.checkBtn = c;
                }}
              />
            </Form>
          </div>
          
        </div>
      );
}
}