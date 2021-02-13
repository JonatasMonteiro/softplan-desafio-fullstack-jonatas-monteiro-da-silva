import React, { Component } from "react";

import ProcessService from "../services/process.service";

export default class BoardTriador extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: []
    };
  }

  componentDidMount() {
    ProcessService.getProcessesList().then(
      response => {
        console.log(response.data)
        this.setState({
          content: response.data
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

  onClickCreate(){
    this.props.history.push("/createProcess")
  }

  render() {
    const content = this.state.content
    console.log(content);
    return (
      <div>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Descrição</th>
              <th>Usuarios a dar parecer</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {content && content.map(process => 
            <tr>
              <th scope="row">{process.id}</th>
              <td>{process.title}</td>
              <td>{process.description}</td>
              <td><ul>{process.usersToOpinate.map(users => <li>{users}</li>)}</ul></td>
              <td> <div className="btn-group mr-2" role="group" aria-label="Second group">
            <button  type="button" className="btn btn-secondary"><i className="fa fa-search"></i></button>
            <button  type="button" className="btn btn-secondary"><i className="fa fa-pencil"></i></button>
               </div></td>
              </tr>)}
          </tbody>
      </table>
      <button onClick={() => this.onClickCreate()} type="button" className="btn btn-primary">Criar Processo </button>
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
