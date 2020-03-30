import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';

class BlogPosts extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      loading: false,
    }
  }

  update = (event) => {
    let id = event.target.name
    this.props.hideHeader();
    this.props.history.push(`/${id}/update`)
  }

  getDate = (blogDate) => {
    let date = new Date(blogDate);
    date = date.toDateString();
    return date;
  }

  render() {
    const data = (this.props.blogData);
    const isAuth = this.props.isAuth
    return(
      <div id="blog-post-container">
      {/* data.map === normal array
          data.slice(0).reverse.map === reverse array
       */}
        { data ? 
          data.slice(0).reverse().map((post, index) => {
            console.log(post);
            let blogTitle = post.title;
            let blogAuthor = post.author;
            let blogPost = post.post;
            let blogId = post.id;
            let blogDate = post.createdAt
            let formatDate = this.getDate(blogDate)
            return (
              <React.Fragment key={index}>
                <h3 className="blog-title">{blogTitle}</h3>
                <div className="author-date-div">
                  <h5 className="blog-author">{blogAuthor},</h5>
                  <h5 className="date-created">{formatDate}</h5>
                </div>
                <ReactMarkdown className="blog-post" source={blogPost} />
                {isAuth ? 
                  <div>
                    <button className="edit" name={blogId} onClick={this.update}>Edit</button>
                  </div>
                  : null
                }
              </React.Fragment> 
            )
          })
          : null
        }
      </div>
    )
  }
}

export default BlogPosts;