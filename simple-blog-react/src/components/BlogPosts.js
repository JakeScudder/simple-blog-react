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
    date = date.split(" ");
    return `${date[0]}, ${date[1]} ${date[2]}, ${date[3]}`;
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
            let blogTitle = post.title;
            let blogAuthor = post.author;
            let blogImage = post.image;
            let blogPost = post.post;
            let blogId = post.id;
            let blogDate = post.createdAt
            let formatDate = this.getDate(blogDate)
            return (
              <div key={index} className="blog-detail-div">
              <React.Fragment key={index}>
                <div className="blog-detail-data">
                  <h3 className="blog-title">{blogTitle}</h3>
                  <div className="author-date-div">
                    <h5 className="blog-author">{blogAuthor}  --  </h5>
                    <h5 className="date-created">{formatDate}</h5>
                  </div>
                  <ReactMarkdown className="blog-post" source={blogPost} />
                  {isAuth ? 
                    <div>
                      <button className="edit" name={blogId} onClick={this.update}>Edit</button>
                    </div>
                    : null
                  }
                </div>
                {/* Check if blog image exists */}
                {blogImage ? 
                  <img className="image-thumbnail" src={blogImage} alt="trees in spring" />
                : null
                }
                <hr className="line-break"></hr>
              </React.Fragment> 
              </div>
            )
          })
          : null
        }
      </div>
    )
  }
}

export default BlogPosts;