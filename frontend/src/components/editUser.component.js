import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";


import UserService from "../services/user.service"

const required = value => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          This field is required!
        </div>
      );
    }
  };
  
  
  const vusername = value => {
    if (value.length < 3 || value.length > 20) {
      return (
        <div className="alert alert-danger" role="alert">
          The username must be between 3 and 20 characters.
        </div>
      );
    }
  };
  
  const vpassword = value => {
    if (value.length < 6 || value.length > 40) {
      return (
        <div className="alert alert-danger" role="alert">
          The password must be between 6 and 40 characters.
        </div>
      );
    }
  };

export default class EditUser extends Component{
    constructor(props) {
        super(props);
        this.handleEdit = this.handleEdit.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onClickReturn = this.onClickReturn.bind(this);
    
        this.state = {
          userId: this.props.location.state.usr.id,
          username: this.props.location.state.usr.username,
          password: "",
          role: this.props.location.state.usr.role,
          successful: false,
          message: ""
        };
      }

      onChangeUsername(e) {
        this.setState({
          username: e.target.value
        });
      }

      onClickReturn(e){
        e.preventDefault()
        this.props.history.push("/admin")
    }
    
    
      onChangePassword(e) {
        this.setState({
          password: e.target.value
        });
      }
    
      handleEdit(e) {
        e.preventDefault();
    
        this.setState({
          message: "",
          successful: false
        });
    
        this.form.validateAll();
    
        if (this.checkBtn.context._errors.length === 0) {
          UserService.editUser(
            this.state.userId,
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
        }
      }

    render(){
        return (
            <div className="col-md-12">
              <div className="card card-container">
                  <p className="center">Editar Usuario</p>
                <img
                  src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                  alt="profile-img"
                  className="profile-img-card"
                />
      
                <Form
                  onSubmit={this.handleEdit}
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
                        <button className="btn btn-primary btn-block">Editar Usuario</button>
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