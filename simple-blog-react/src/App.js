import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor() {
    super(); 
    this.state = {
      blogPosts: [],
      loading: false
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

  render() {
    return (
      <div className="App">
        <h1> Simple Blog</h1>
      </div>
    );
  } 
}

export default App;
