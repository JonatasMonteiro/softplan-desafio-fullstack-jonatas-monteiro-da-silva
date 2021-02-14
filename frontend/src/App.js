import React, { Component } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import BoardFinalizador from "./components/board-finalizador.component";
import BoardTriador from "./components/board-triador.component";
import BoardAdmin from "./components/board-admin.component";
import Profile from "./components/profile.component"
import EditUser from "./components/editUser.component"
import CreateUser from "./components/createUser.component"
import CreateProcess from "./components/createProcess.component"
import ProcessProfile from "./components/processProfile.component"
import InsertUsersToOpinate from "./components/insertUserToOpinate.component"
import Opinate from "./components/opinate.component"

// Componente principal
class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showTriadorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  // Método do ciclo de vida do componente, que executa o código contido quando o componente
      // é montado 
  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
       this.setState({
         currentUser: user,
         showTriadorBoard: user.role.includes("ROLE_TRIADOR"),
         showAdminBoard: user.role.includes("ROLE_ADMIN"),
       });
    }
  }

  // Método que chama o serviço de autenticação e realiza o logout
  logOut() {
    AuthService.logout();
  }

  // Método que renderiza o componente na tela
  render() {
    const currentUser = this.state.currentUser;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/"]} render={() => {
              const currentUser = AuthService.getCurrentUser();
              return currentUser ?  <Redirect to={"/"+currentUser.role.substring(5).toLowerCase()}/>: <Redirect to="/login" /> 
              
            }} />
            <Route exact path="/login" component={Login} />
            <Route path="/finalizador" component={BoardFinalizador} />
            <Route path="/editUser" component={EditUser}></Route>
            <Route path="/profile" component={Profile}></Route>
            <Route path="/triador" component={BoardTriador} />
            <Route path="/createUser" component={CreateUser}></Route>
            <Route path="/profile"></Route>
            <Route path="/processProfile" component={ProcessProfile}></Route>
            <Route path="/createProcess" component={CreateProcess}></Route>
            <Route path="/insertUsersToOpinate" component={InsertUsersToOpinate}></Route>
            <Route path="/admin" component={BoardAdmin} />
            <Route path="/opinate" component={Opinate}></Route>
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
