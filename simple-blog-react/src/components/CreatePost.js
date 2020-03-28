import React, { Component } from 'react';

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      author: "",
      post: "",
      errorMessage: null
    }
  }

  componentDidMount() {
    this.props.hideHeader();
  }
  
  handleCancel = (event) => {
    event.preventDefault();
    this.props.hideHeader();
    this.props.history.push('/');
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

  apiFunction(path, method, body = null, requiresAuth = true, credentials = null) {
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


  handleUpdate = async () => {
    const {
      title,
      author,
      post,
    } = this.state;
    
    let email = this.props.user.email;
    let password = this.props.user.password;
    let url = `http://localhost:5000/api/blog/new`;
    let userId = 1;

    const response = await this.apiFunction(url, 'POST', {userId, title, author, post }, true, { email, password });
    if (response.status === 201) {
      window.location.href = '/';
    } else if (response.status === 400) {
      response.json().then(data => ({
        data: data,
        status: response.status
      })
      ).then(res => {
        console.log(res.data.errors);
        let errors = res.data.errors;
        this.setState({
          formatMessage: errors
        }) 
      });
      return null;
      // this.props.history.push('/courses/create');
    } else if(response.status === 500) {
      this.props.history.push('/error');
    }
    else {
      throw new Error();
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.handleUpdate();
  }

  render() {
    return(
    <div id="create-post">
      <h1>Create New</h1>
      <div >
      { (this.state.formatMessage)
        ?
        <h2 class="validation--errors--label">Validation errors</h2>
      : null
      }
      <div className="validation-errors">
        <ul>
          { (this.state.formatMessage) 
          ?  <li>
                { this.state.formatMessage.map(error => {
                return <li>{error}</li>
                })}
            </li>
          :  null
          } 
        </ul>
      </div>
      <div id="form-div">
          <form onSubmit={this.handleSubmit}>
            <h5 className="description-tags"> Title </h5>
              <input id="create-title" name="title" onChange={this.handleChange} value={this.state.title} />
            <h5 className="description-tags"> Author </h5>
              <input id="create-author" name="author" onChange={this.handleChange} value={this.state.author} />
            <h5 className="description-tags"> Post </h5>
              <textarea id="create-post" name="post" onChange={this.handleChange} value={this.state.post} />
            <div>
              <button className="button" type="submit">Create Post</button>
              <button className="button" onClick={this.handleCancel}> Cancel </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    )
  }
}
export default CreatePost;
