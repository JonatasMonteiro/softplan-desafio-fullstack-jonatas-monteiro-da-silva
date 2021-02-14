import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select"
import CheckButton from "react-validation/build/button";



import ProcessService from "../services/process.service"
import AuthService from "../services/auth.service"

// Método que valida se o campo está preenchido
const required = value => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          É necessário preencher esse campo
        </div>
      );
    }
  };
  
  // Método que garante que o titulo tem o tamanho correto
  const vtitle = value => {
    if (value.length < 5 || value.length > 20) {
      return (
        <div className="alert alert-danger" role="alert">
          O titulo deve ter entre 5 e 20 caracteres
        </div>
      );
    }
  };
  
  // Método que valida se a descrição tem o tamanho correto
  const vdescription = value => {
    if (value.length < 30 || value.length > 100) {
      return (
        <div className="alert alert-danger" role="alert">
          A descrição deve ter entre 30 e 100 caracteres
        </div>
      );
    }
  };

// Componente da criação de um processo
export default class CreateUser extends Component{
    constructor(props) {
        super(props);
        this.handleCreate = this.handleCreate.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeUserToOpinate = this.onChangeUserToOpinate.bind(this);
        this.onClickReturn = this.onClickReturn.bind(this);
    
        this.state = {
          title: "",
          description: "",
          userToOpinate: "",
          users: [],
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
      }
      // Metodo que cuida da mudança no campo do título do processo
      onChangeTitle(e) {
        this.setState({
          title: e.target.value
        });
      }
      // Método que cuida da mudança no campo de descrição do processo
      onChangeDescription(e){
          this.setState({
              description:e.target.value
          })
      }
    
    // Método que cuida da mudança no campo de usuario para opinar do processo
      onChangeUserToOpinate(e) {
        this.setState({
          userToOpinate: e.target.value
        });
      }

      // Metodo que redireciona o usuario triador de volta para a sua página ao clickar no botão
      // Voltar
      onClickReturn(e){
          e.preventDefault()
          this.props.history.push("/triador")
      }
    
      // Método que cuida da submissão do formulário
      handleCreate(e) {
        e.preventDefault();
    
        this.setState({
          message: "",
          successful: false
        });
    
        this.form.validateAll();
    
        if (this.checkBtn.context._errors.length === 0) {
          ProcessService.createProcess(
            this.state.title,
            this.state.description,
            this.state.userToOpinate
          ).then(
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
      // Método que renderiza o componente na tela
    render(){
        
        const users = this.state.users;
        return (
            <div className="col-md-12">
              <div className="card card-container">
                  <p className="center">Criar Processo</p>
      
                <Form
                  onSubmit={this.handleCreate}
                  ref={c => {
                    this.form = c;
                  }}
                >
                  {!this.state.successful && (
                    <div>
                      <div className="form-group">
                        <label htmlFor="title">Titulo</label>
                        <Input
                          type="text"
                          className="form-control"
                          name="title"
                          value={this.state.title}
                          onChange={this.onChangeTitle}
                          validations={[required, vtitle]}
                        />
                      </div>
      
      
                      <div className="form-group">
                        <label htmlFor="description">Descrição</label>
                        <Input
                          type="text"
                          className="form-control"
                          name="description"
                          value={this.state.description}
                          onChange={this.onChangeDescription}
                          validations={[required, vdescription]}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="role">Usuario p/ parecer</label>
                        <Select
                          className="form-control"
                          name="userToOpinate"
                          value={this.state.userToOpinate}
                          validations={[required]}
                          onChange={this.onChangeUserToOpinate}

                        >
                            <option value="">Escolha um usuario</option>
                            {users.map(userr => <option value={userr}>{userr}</option>)}

                        </Select>
                      </div>
      
                      <div className="form-group">
                        <button className="btn btn-primary btn-block">Criar Processo</button>
                        
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