import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select"
import CheckButton from "react-validation/build/button";



import ProcessService from "../services/process.service"
import UserService from "../services/user.service"

const required = value => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          É necessário preencher esse campo
        </div>
      );
    }
  };
  
  
  const vtitle = value => {
    if (value.length < 5 || value.length > 20) {
      return (
        <div className="alert alert-danger" role="alert">
          O titulo deve ter entre 5 e 20 caracteres
        </div>
      );
    }
  };
  
  const vdescription = value => {
    if (value.length < 30 || value.length > 100) {
      return (
        <div className="alert alert-danger" role="alert">
          A descrição deve ter entre 30 e 100 caracteres
        </div>
      );
    }
  };


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
      

      onChangeTitle(e) {
        this.setState({
          title: e.target.value
        });
      }

      onChangeDescription(e){
          this.setState({
              description:e.target.value
          })
      }
    
    
      onChangeUserToOpinate(e) {
        this.setState({
          userToOpinate: e.target.value
        });
      }

      onClickReturn(e){
          e.preventDefault()
          this.props.history.push("/triador")
      }
    
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
                message: response.data.message,
                successful: true
              });
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
          this.props.history.push("/triador");
          window.location.reload();
        }
      }

    render(){
        ProcessService.getUsersFinalizadores().then(response =>{
            
            this.setState({users: response.data.map(user => user.username)})
        })
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
                        <button className="btn btn-primary btn-block">Criar Usuario</button>
                        
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