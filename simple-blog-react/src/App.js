import React, { Component } from 'react';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';

import axios from 'axios';
import Cookies from 'js-cookie';

//Components
import BlogPosts from './components/BlogPosts';
import CreatePost from './components/CreatePost';
import UpdateBlog from './components/UpdateBlog';
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
      showing: null,
      hideHeader: null
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

  createNew = () => {
    window.location.href = "/blog/new";
  }

  hideHeader = () => {
    if (!this.state.hideHeader) {
      this.setState({
        hideHeader: true,
      }) 
    } else {
      this.setState({
        hideHeader: false,
      }) 
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div id="App">
        { !this.state.hideHeader ? 
          <h1 id="blog-header"> Simple Blog</h1>
        : null
        }
            {this.state.isAuth && !this.state.hideHeader ? 
              <React.Fragment>
                <button id="create-new-button" onClick={this.createNew}> Create New</button>
                <button id="signout" onClick={this.signOut}>Sign Out</button>
              </React.Fragment>
              : null
            }
        <Switch>
          <Route exact path="/" render={(props) => <BlogPosts hideHeader={this.hideHeader} blogData={this.state.blogPosts} isAuth={this.state.isAuth} {...props} /> }/>
          <Route exact path="/admin" render={(props) => <Admin blogData={this.state.blogPosts} updateState={this.handleAuthUser} {...props}/> }/>
          <Route exact path="/:id/update" component={(props) => <UpdateBlog hideHeader={this.hideHeader} user={this.state.authUser} isAuth={this.state.isAuth} {...props}/> }/>
          <Route exact path="/blog/new" render={(props) => <CreatePost hideHeader={this.hideHeader} user={this.state.authUser} isAuth={this.state.isAuth} {...props}/> }/>
        </Switch>
        </div>
      </BrowserRouter>
    );
  } 
}

export default App;
