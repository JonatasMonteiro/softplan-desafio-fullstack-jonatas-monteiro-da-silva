import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";

// Método que cuida para que os campos sejam preenchidos
const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

//COmponente da página de login
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      password: "",
      loading: false,
      message: ""
    };
  }

  // Método do ciclo de vida do componente, que executa o código contido quando o componente
      // é montado
  componentDidMount(){
    const usr = AuthService.getCurrentUser()
    if(usr){
      const role = usr.role.substring(5).toLowerCase()
      this.props.history.push("/"+role)
      
    }
  }

  // Método que cuida da mudança de username
  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  // Método que cuida da mudança de senha
  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  // Método que cuida da submissão do formulário
  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();

    var user = AuthService.getCurrentUser();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.username, this.state.password).then(
        () => {
          while(!user){
            user = AuthService.getCurrentUser();
          }
          if(user.role === "ROLE_ADMIN"){
            this.props.history.push("/admin"); }
           else if( user.role === "ROLE_TRIADOR"){
             this.props.history.push("/triador")
           }
           else if(user.role === "ROLE_FINALIZADOR"){
             this.props.history.push("/finalizador")
           }
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
            loading: false,
            message: resMessage
          });
        }
      );
    } else {
      this.setState({
        loading: false
      });
    }
  }

  // Método que renderiza o componente na tela
  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <p className="center">Login</p>
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Form
            onSubmit={this.handleLogin}
            ref={c => {
              this.form = c;
            }}
          >
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Input
                type="text"
                className="form-control"
                name="username"
                value={this.state.username}
                onChange={this.onChangeUsername}
                validations={[required]}
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
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>

            {this.state.message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
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
