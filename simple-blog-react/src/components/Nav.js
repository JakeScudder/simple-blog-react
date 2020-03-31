import React from 'react';
import { withRouter } from "react-router";

const Nav = (props) => {
    let data = props.blogData

    const getDate = (blogDate) => {
      let date = new Date(blogDate);
      date = date.toDateString();
      date = date.split(" ");
      return `${date[0]}, ${date[1]} ${date[2]}, ${date[3]}`;
    }

    const getBlog = (event) => {
      let id = event.target.value;
      props.history.push(`/blog/${id}`);
    }
  return (
    <div id="nav-div">
      <ul>
        <li id="nav-div-description"> Sorted by Oldest First</li>
        {data ? 
        data.map((post, index) => {
          let blogTitle = post.title;
          let blogId = post.id;
          let blogDate = post.createdAt;
          let formatDate = getDate(blogDate);
          return (
            <React.Fragment key={index}>
            <div className="nav-description" value={blogId}>
            <li className="nav-li" name={blogId} value={blogId} onClick={getBlog}><strong>{blogTitle}</strong></li> <li className="nav-li" value={blogId} name={blogId} onClick={getBlog}>{formatDate}</li>
            </div>
            </React.Fragment>
          )
        })
        : null
        }
      </ul>
    </div>
  )
}
const NavWithRouter = withRouter(Nav)
export default NavWithRouter;