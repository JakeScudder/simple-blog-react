import React, { Component } from 'react';

class Nav extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      loading: false
    }
  }

    getDate = (blogDate) => {
      let date = new Date(blogDate);
      date = date.toDateString();
      date = date.split(" ");
      return `${date[0]}, ${date[1]} ${date[2]}, ${date[3]}`;
    }

  render() {
    let data = this.props.blogData
    return (
      <div id="nav-div">
        <ul id="nav-ul">
          <li id="nav-div-description"> Sorted by Oldest First</li>
          {data ? 
          data.map((post, index) => {
            let blogTitle = post.title;
            let blogId = post.id;
            let blogDate = post.createdAt;
            let formatDate = this.getDate(blogDate);
            let url = `/blog/${blogId}`;
            return (
              <div onClick={this.handleClick} key={blogId}>
              <a href={url}>
                <div className="nav-description">
                  <li className="nav-li" ><strong>{blogTitle}</strong></li> 
                  <li className="nav-li">{formatDate}</li>
                </div>
              </a>
              
              </div>
            )
          })
          : null
          }
          <a href="/">
            <li className="nav-li">Home</li>
          </a>
        </ul>
      </div>
    )
 }  
}
export default Nav;
// const NavWithRouter = withRouter(Nav)
// export default NavWithRouter;