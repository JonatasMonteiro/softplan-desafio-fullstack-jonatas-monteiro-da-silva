import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select"
import CheckButton from "react-validation/build/button";



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
  
  
  const vusername = value => {
    if (value.length < 3 || value.length > 20) {
      return (
        <div className="alert alert-danger" role="alert">
          O username deve ter entre 3 e 20 caracteres
        </div>
      );
    }
  };
  
  const vpassword = value => {
    if (value.length < 6 || value.length > 40) {
      return (
        <div className="alert alert-danger" role="alert">
          A senha deve ter entre 6 e 40 caracteres
        </div>
      );
    }
  };

  const roles = [{id:0,name:"",description:""},{id:2,name:"TRIADOR",description:"Usuario Triador"},{id:3,name:"FINALIZADOR",description:"Usuario Finalizador"}]

export default class CreateUser extends Component{
    constructor(props) {
        super(props);
        this.handleCreate = this.handleCreate.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeRole = this.onChangeRole.bind(this);
        this.onClickReturn = this.onClickReturn.bind(this);
    
        this.state = {
          username: "",
          password: "",
          role: {},
          successful: false,
          message: ""
        };
      }
      

      onChangeUsername(e) {
        this.setState({
          username: e.target.value
        });
      }

      onChangeRole(e){
          console.log(roles.filter(rolee => rolee.name === e.target.value).pop())
          this.setState({
              role:roles.filter(rolee => rolee.name === e.target.value).pop()
          })
      }
    
    
      onChangePassword(e) {
        this.setState({
          password: e.target.value
        });
      }

      onClickReturn(e){
          e.preventDefault()
          this.props.history.push("/admin")
      }
    
      handleCreate(e) {
        e.preventDefault();
    
        this.setState({
          message: "",
          successful: false
        });
    
        this.form.validateAll();
    
        if (this.checkBtn.context._errors.length === 0) {
          UserService.createUser(
            this.state.username,
            this.state.password,
            this.state.role
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
          this.props.history.push("/admin");
          window.location.reload();
        }
      }

    render(){
       
        return (
            <div className="col-md-12">
              <div className="card card-container">
                  <p className="center">Criar Usuario</p>
                <img
                  src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                  alt="profile-img"
                  className="profile-img-card"
                />
      
                <Form
                  onSubmit={this.handleCreate}
                  ref={c => {
                    this.form = c;
                  }}
                >
                  {!this.state.successful && (
                    <div>
                      <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <Input
                          type="text"
                          className="form-control"
                          name="username"
                          value={this.state.username}
                          onChange={this.onChangeUsername}
                          validations={[required, vusername]}
                        />
                      </div>
      
      
                      <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <Input
                          type="password"
                          className="form-control"
                          name="password"
                          value={this.state.password}
                          onChange={this.onChangePassword}
                          validations={[required, vpassword]}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="role">Cargo</label>
                        <Select
                          className="form-control"
                          name="role"
                          value={this.state.role.name}
                          validations={[required]}
                          onChange={this.onChangeRole}
                        >
                            {roles.map(role => <option value={role.name}>{role.name}</option>)}

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