import React, { Component } from 'react';
import axios from 'axios';

class UpdateBlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogId: this.props.match.params.id,
      title: "",
      author: "",
      post: "",
      genre: "",
      image: "",
      errorMessage: null,
    }
  }

  componentDidMount() {
    this.fetchBlog();
  }

  handleCancel = (event) => {
    event.preventDefault();
    this.props.hideHeader();
    this.props.history.goBack();
  }

  errorHandler(res) {
    if (res.status === 500) {
      let error = new Error();
      error.status = 500;
      throw error;
    }
    return res;
  }

  //Helper function to check credentials
  apiAuthFunction(path, method = 'PUT', body = null, requiresAuth = true, credentials = null) {
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
    return fetch(path, options);
  }

   //Helper function to handle state of inputs
   handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(() => {
      return {
        [name]: value
      };
    });
  }



  fetchBlog = () => {
    let query = this.props.match.params.id;
    this.setState({
      loading: true
    })
    axios.get(`http://localhost:5000/api/blog/${query}`)
      .then(this.errorHandler)
      .then(response => {
        console.log(response);
        this.setState({
          blog: response.data,
          title: response.data.title,
          author: response.data.author,
          post: response.data.post,
          genre: response.data.genre,
          image: response.data.image,
        })
      })
      .catch(error => {
        console.log(error);
      })
  }

  handleUpdate = async () => {
    const {
      title,
      author,
      post,
      genre,
      image,
    } = this.state;

    let email = this.props.user.email;
    let password = this.props.user.password;
    let url = `http://localhost:5000/api/blog/${this.state.blogId}`;

    const response = await this.apiAuthFunction(url, 'PUT', {title, author, post, genre, image}, true, {email, password});
    if (response.status === 204) {
      window.location.href = '/';
    } else if (response.status === 400) {
       response.json().then(data => ({
         data: data,
         status: response.status
       })).then(response => {
         console.log(response.data.errors);
         let errors = response.data.errors;
         this.setState({
           errorMessage: errors
         })
       })
    } else {
      console.log(response);
    }
  }

  delete = async (event) => {
    let email = this.props.user.email;
    let password = this.props.user.password;
    let url = `http://localhost:5000/api/blog/${this.state.blogId}`;

    const response = await this.apiAuthFunction(url, 'Delete', null, true, { email, password});
    if (response.status === 204) {
      window.location.href = '/';

    } else if (response.status === 403) {
      response.json().then(data => ({
        data: data,
        status: response.status
      })).then(response => {
        console.log(response.data.errors);
        let errors = response.data.errors;
        this.setState({
          errorMessage: errors
        })
      })
    } else {
      throw new Error();
    }
  }

  areYouSure = () => {
    if (!this.state.showing) {
      this.setState({
        showing: true
      })
    } else {
     this.setState({
       showing: false
     })
    }
   }


  //Handles Submission
  handleSubmit = (event) => {
    event.preventDefault();
    this.handleUpdate();
  }

  render() {
    return(
      <div id="update-container-div">
      <h1>Update</h1>
      {this.state.errorMessage ? 
        <div>
        {this.state.errorMessage.map((error, index) => {
          return <li key={index}>{error}</li>
        })
        }
        </div>
      :null
      }
      <form id="update-form" onSubmit={this.handleSubmit}>
        <h3>Title</h3>
          <input id="input-title" name="title" placeholder="Title" onChange={this.handleChange} value={this.state.title}/>
        <h3>Author</h3>
          <input id="input-author" name="author" placeholder="Author" onChange={this.handleChange} value={this.state.author}/>
        <h3>Genre</h3>
          <input id="input-genre" name="genre" placeholder="Genre" onChange={this.handleChange} value={this.state.genre}/>
        <h3>Image</h3>
          <input id="input-image" name="image" placeholder="Image" onChange={this.handleChange} value={this.state.image}/>

        <h3>Blog Post</h3>
          <textarea id="input-post" name="post" placeholder="Post" onChange={this.handleChange} value={this.state.post}/>
        <p></p>
        { this.state.showing ? 
        <div id="blog-delete-confirm">
          <h3>Are you sure you want to delete this blog post?</h3>
            <button onClick={this.delete}>Yes, delete this</button>
            <button onClick={this.areYouSure}>No, I don't want to delete this</button>
        </div>
        : null
        }
      </form>
      <div id="update-button-div">
        <button className="options-button" onClick={this.handleSubmit}>Submit</button>
        <button className="options-button" onClick={this.handleCancel}> Cancel </button>
        <button className="options-button" onClick={this.areYouSure} >Delete</button>
      </div>
    </div>
    )
  }
}
export default UpdateBlog;