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
    this.props.history.push(`/${id}/update`)
  }

  render() {
    const data = (this.props.blogData);
    const isAuth = this.props.isAuth
    return(
      <div id="blog-post-container">
        { data ? 
          data.map((post, index) => {
            console.log(post);
            let blogTitle = post.title;
            let blogAuthor = post.author;
            let blogPost = post.post;
            let blogId = post.id;
            return (
              <React.Fragment key={index}>
                <h3 className="blog-title">{blogTitle}</h3>
                <h5 className="blog-author">{blogAuthor}</h5>
                {/* <p className="blog-post">{blogPost}</p> */}
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