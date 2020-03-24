import React, { Component } from 'react';

class BlogPosts extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      loading: false,
    }
  }

  render() {
    const data = (this.props.blogData);
    return(
      <div id="blog-post-container">
        { data ? 
          data.map((post, index) => {
            let blogPost = post.post;
            let blogAuthor = post.author;
            let blogTitle = post.title;
            return (
              <React.Fragment key={index}>
                <h3 className="blog-title">{blogTitle}</h3>
                <h5 className="blog-author">{blogAuthor}</h5>
                <p className="blog-post">{blogPost}</p>
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