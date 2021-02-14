import React, { Component } from "react";
import Form from "react-validation/build/form";
import TextArea from "react-validation/build/textarea"
import CheckButton from "react-validation/build/button";



import ProcessService from "../services/process.service"
import AuthService from "../services/auth.service"

// Método que cuida para que os campos sejam preenchidos
const required = value => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          É necessário preencher esse campo
        </div>
      );
    }
  };
  

// Componente da página onde o usuário finalizador da seu parecer em um processo
export default class Opinate extends Component{
    constructor(props) {
        super(props);
        this.handleOpinate = this.handleOpinate.bind(this);
        this.onChangeOpinion = this.onChangeOpinion.bind(this);
        this.onClickReturn = this.onClickReturn.bind(this);
    
        this.state = {
          opinion: "",
          username: "",
          processId: "",
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
          if(role !== "finalizador"){
            this.props.history.push("/"+role)
          }
        }
        else{
          this.props.history.push("/login")
        }
        this.setState({username: AuthService.getCurrentUser().username,
        processId:this.props.location.state.processId})
      }

      // Método que cuida da mudança no texto do parecer
      onChangeOpinion(e){
        this.setState({opinion: e.target.value})
      }
      

      // Método que redireciona o usuário finalizador de volta para a sua página
      // ao clicar no botão Voltar
      onClickReturn(e){
          e.preventDefault()
          this.props.history.push("/finalizador")
      }
    
      // Método que cuida da submissão do formulário
      handleOpinate(e) {
        e.preventDefault();
    
        this.setState({
          message: "",
          successful: false
        });
    
        this.form.validateAll();
    
        if (this.checkBtn.context._errors.length === 0) {
          ProcessService.opinate(this.state.processId,this.state.username,this.state.opinion
          ).then(
            response => {
              this.setState({
                message: response.data,
                successful: true
              });
              this.props.history.push({pathname:"/finalizador",state:{message:this.state.message}});
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
        return (
            <div className="col-md-12">
              <div className="card card-container">
                  <p className="center">Dar Parecer</p>
      
                <Form
                  onSubmit={this.handleOpinate}
                  ref={c => {
                    this.form = c;
                  }}
                >
                  {!this.state.successful && (
                    <div>
                      <div className="form-group">
                        <label htmlFor="opinion">Parecer</label>
                        <TextArea
                          type="text"
                          className="form-control"
                          name="title"
                          value={this.state.opinion}
                          onChange={this.onChangeOpinion}
                          validations={[required]}
                        />
                      </div>
      
                      <div className="form-group">
                        <button className="btn btn-primary btn-block">Dar Parecer</button>
                        
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