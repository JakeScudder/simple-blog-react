import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

class BlogDetail extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      loading: false,
      blogId: this.props.match.params.id,
      blogPost: null,
      formatError: null,
    }
  }

  componentDidMount() {
    this.fetchBlogPost();
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  fetchBlogPost = () => {
    let id = parseInt(this.state.blogId);
    console.log("id:", id);
    axios.get(`http://localhost:5000/api/blog/${id}`)
      .then(this.errorHandler)
      .then(response => {
          console.log(response);
          if (this.mounted) {
            this.setState({
              blogPost: response.data
            })
          }     
        })
      .catch(error => {
        console.log(error.message);
        this.setState({
          formatError: "Sorry, we couldn't find the blog you were looking for."
        })
      }
    )
  }

  getDate = (blogDate) => {
    let date = new Date(blogDate);
    date = date.toDateString();
    date = date.split(" ");
    return `${date[0]}, ${date[1]} ${date[2]}, ${date[3]}`;
  }

  errorHandler = (response) => {
    if (response.status === 500) {
      let error = new Error();
      error.status = 500;
      throw error;
    }
    return response;
  }

  render() {
    let post = this.state.blogPost
    let blogTitle;
    let blogAuthor;
    let blogPost;
    let blogDate;
    let formatDate; 

    if (post && post.title) {
      blogTitle = post.title;
      blogAuthor = post.author;
      blogPost = post.post;
      blogDate = post.createdAt
      formatDate = this.getDate(blogDate);
    }
    
    return (
      <div>
      {this.state.formatError ? 
      <h5>Sorry, we couldn't find the blog you were looking for.</h5>
      : null
      }
        <h3 className="blog-title">{blogTitle}</h3>
          <div className="author-date-div">
            <h5 className="blog-author">{blogAuthor}  --  </h5>
            <h5 className="date-created">{formatDate}</h5>
          </div>
          <ReactMarkdown className="blog-post" source={blogPost} />
      </div>
    )
  }
}

export default BlogDetail;