import React, { Component } from 'react';

class Admin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: true
    };
  }

  //Helper function
  apiFunction(path, method = 'GET', body = null, requiresAuth = false, credentials = null ) {
    const options = {
      method, 
      headers: {
        'Content-Type': 'application/json; charset=utf-8', 
      }
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requiresAuth) {    
      const encodedCredentials = btoa(`${credentials.email}:${credentials.password}`);
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }
    return fetch("http://localhost:5000/api/users", options);
  }

  handleCancel = (event) => {
    event.preventDefault();
    window.location.href = '/courses';
  }

  handleEmail = (e) => {
    this.setState({
      email: e.target.value
    }) 
  }

  handlePassword = (e) => {
    this.setState({
      password: e.target.value
    }) 
  }

  //Sets authorization state in the main app.js file
  handleAuth = (email, password, data) => {
    this.props.updateState(email, password, data);
  }

  //Handles form submission
  handleSubmit = async (event) => {
    event.preventDefault();
    this.handleSignIn();   
  }

  //Handles user sign in
  handleSignIn = async () => {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    let email = this.state.email;
    let password = this.state.password;
    const response = await this.apiFunction('http://localhost:5000/api/users', 'GET', null, true, {email, password});
    if (response.status === 200) {
      return response.json().then(data => {
        this.handleAuth(email, password, data);
        this.props.history.push(from);
      });
    }
    else if (response.status === 401) {
      return null;
    } else if (response.status === 500) {
      this.props.history.push('/error');
    }
    else {
      throw new Error();
    }
  }

  render() {
    return(
      <div id="sign-in-div">
          <h3 id="h3-sign-in">Sign In</h3>
          <div>
            <form onSubmit={this.handleSubmit}>
              <div>
                <input id="emailAddress" name="emailAddress" type="text" onChange={this.handleEmail} className="" placeholder="Email Address" value={this.state.email}/>
              </div>
              <div>
                <input id="password" name="password" type="password" className="" onChange={this.handlePassword}placeholder="Password" value={this.state.password}/>
              </div>
              <div className="sign-in-buttons">
                <button className="options-button" type="submit">Sign In</button>
                <button className="options-button" onClick={this.handleCancel}>Cancel</button>
              </div>
            </form>
        </div>
      </div>
    )
  }

}

export default Admin;




