import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" }
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
  }

  onClickReturn(){
    this.props.history.push("/admin")
  }

  onClickEdit(user){
    this.props.history.push({pathname: '/editUser', state: {usr: user}})
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const user = this.props.location.state.usr

    return (
      <div className="container">
        {(this.state.userReady) ?
        <div>
        <header className="jumbotron">
          <h3>
            Perfil de <i>{user.username}</i> 
          </h3>
        </header>
        <p>
          <strong>Id:</strong>{" "}
          {user.id}
        </p>
        <strong>Cargo:</strong>
        <ul>
        <li key={1}>{user.role.name}</li>
        </ul>
        <button onClick={() => this.onClickReturn()} type="button" className="btn btn-primary ml-auto ">Voltar</button>
      <button onClick={() => this.onClickEdit(user)} type="button" className="btn btn-primary pull-right">Editar Usuario</button>
      </div>: null}

      </div>
    );
  }
}
