import React, { Component } from 'react';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';

import axios from 'axios';
import Cookies from 'js-cookie';

//Components
import BlogPosts from './components/BlogPosts';
import Admin from './components/Admin';

class App extends Component {
  constructor() {
    super(); 
    this.state = {
      blogPosts: [],
      loading: false,
      authUser: Cookies.getJSON('authUser') || null,
      name: Cookies.getJSON('name') || null,
      isAuth: Cookies.getJSON('isAuth') || null,
    }
  }

  componentDidMount() {
    this.fetchBlogPosts();
  }

  errorHandler(res) {
    if (res.status === 500) {
      let error = new Error();
      error.status = 500;
      throw error;
    }
    return res;
  }

  fetchBlogPosts = () => {
    this.setState({
      loading: true
    })
    axios.get(`http://localhost:5000/api/blog`)
      .then(this.errorHandler)
      .then(res => {
          this.setState({
            blogPosts: res.data.allBlogs,
            loading: false
          }) 
          console.log(this.state.blogPosts);
        }
      )
      .catch(error => {
        console.log(error);
      })
  }

  //Authorize User
  handleAuthUser = (email, password, data) => {
    let object = {email, password};
    this.setState({
      authUser: object,
      isAuth: true,
      name: data,
    })
    // console.log(this.state.authUser);
    Cookies.set('authUser', JSON.stringify(object), {expires: 1});
    Cookies.set('isAuth', true, {expires: 1});
    Cookies.set('name', JSON.stringify(data), {expires: 1})
  }

  //Sign Out function
  signOut = () => {
    this.setState({ 
      authUser: null, 
      isAuth: null, 
      name: "" 
    });
    Cookies.remove('authUser');
    Cookies.remove('isAuth');
    Cookies.remove('name');
    return <Redirect to="/" />;
  }

  render() {
    return (
      <BrowserRouter>
        <div id="App">
        <h1> Simple Blog</h1>
        {this.state.isAuth ? 
          <button id="signout" onClick={this.signOut}>Sign Out</button>
          : null
        }
        <Switch>
          <Route exact path="/" render={(props) => <BlogPosts blogData={this.state.blogPosts} isAuth={this.state.isAuth}/> }
          />
          <Route exact path="/admin" render={(props) => <Admin blogData={this.state.blogPosts} updateState={this.handleAuthUser} {...props}/> }
          />
        </Switch>
        
      </div>
      </BrowserRouter>
      
    );
  } 
}

export default App;
