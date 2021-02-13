import React, { Component } from "react";

import UserService from "../services/user.service";

export default class BoardAdmin extends Component {
  constructor(props) {
    super(props);
    this.onClickEdit = this.onClickEdit.bind(this)
    this.onClickDelete = this.onClickDelete.bind(this)
    this.onClickCreate = this.onClickCreate.bind(this)
    this.onClickVisualize = this.onClickVisualize.bind(this)

    this.state = {
      content: [],
      message:""
    };
  }

  componentDidMount() {
    UserService.getUserList().then(
      response => {
        this.setState({
          content: response.data.filter(user => user.role.name !== "ADMIN")
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  onClickEdit(user){
    this.props.history.push({pathname: '/editUser', state: {usr: user}})
  }

  onClickDelete(id){
    UserService.deleteUser(id).then(response => {
      this.setState({message:response.data,content: this.state.content.filter(user => user.id !== id)})
      setTimeout(() => this.setState({message:null}),2000)
    });
  }

  onClickCreate(){
    this.props.history.push("/createUser")
  }

  onClickVisualize(user){
    this.props.history.push({pathname: '/profile', state: { usr: user}})
  }



  render() {
    const {content} = this.state
    return (
      <div>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Cargo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {content && content.map(user => 
            <tr>
              <th scope="row">{user.id}</th>
              <td>{user.username}</td>
              <td>{user.role.name}</td>
              <td> <div className="btn-group mr-2" role="group" aria-label="Second group">
            <button onClick={() => this.onClickVisualize(user)} type="button" className="btn btn-secondary"><i className="fa fa-user"></i></button>
            <button onClick={() => this.onClickEdit(user)} type="button" className="btn btn-secondary"><i className="fa fa-pencil"></i></button>
            <button onClick={() => this.onClickDelete(user.id)} type="button" className="btn btn-secondary"><i className="fa fa-trash"></i></button>
               </div></td>
              </tr>)}
          </tbody>
      </table>
      <button onClick={() => this.onClickCreate()} type="button" className="btn btn-primary">Criar usuario </button>
      {this.state.message && (
                    <div className="form-group">
                      <div className="alert alert-success" role="alert">
                        {this.state.message}
                      </div>
                    </div>
                  )}
      </div>
    );
  }
}
