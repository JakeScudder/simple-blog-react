<div align="center">

## Simple Blog
### React Front End with a REST API

</div>

### Description

This app was built using create-react-app and is the combination of a React Front End with a custom REST API that allows an admin to make blog posts.  In this full stack application, the blog admin is able to easily use all CRUD operations relating to blog creation and alteration. Basic Authentication is used to make sure only the admin is able to use CRUD operations on posts. Because I used sqlite3 for the database, I have been unable to figure out how to deploy this project to a live website.  I will be using a MYSQL database for a future version of this project in order to deploy it properly at completion.

### How To Use

After cloning this respository you can:

Navigate to the /simple-blog-api folder in your terminal and run:
```
npm install
npm run dev
```
Because I am using the "concurrently" dependency, these two commands can get the bot the client and server side of the blog up and running with one command.  If the development server does not direct you to the page, you can access the project at:

```
http://localhost:3000
```
