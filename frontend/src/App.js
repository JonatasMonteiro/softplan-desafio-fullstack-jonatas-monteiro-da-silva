import React, { Component } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import BoardUser from "./components/board-user.component";
import BoardTriador from "./components/board-triador.component";
import BoardAdmin from "./components/board-admin.component";
import Profile from "./components/profile.component"
import EditUser from "./components/editUser.component"
import CreateUser from "./components/createUser.component"
import CreateProcess from "./components/createProcess.component"

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

  logOut() {
    AuthService.logout();
  }

  render() {
    const currentUser = this.state.currentUser;
    const {showTriadorBoard, showAdminBoard } = this.state;

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
            <Route exact path="/register" component={Register} />
            <Route path="/user" component={BoardUser} />
            <Route path="/editUser" component={EditUser}></Route>
            <Route path="/profile" component={Profile}></Route>
            <Route path="/triador" component={BoardTriador} />
            <Route path="/createUser" component={CreateUser}></Route>
            <Route path="/profile"></Route>
            <Route path="/createProcess" component={CreateProcess}></Route>
            <Route path="/admin" component={BoardAdmin} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
