import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import Post from './components/Post/Post'

const URL = "http://localhost:8080";

class App extends Component {
  constructor() {
    super();
    this.submitSignUp = this.submitSignUp.bind(this);
    this.submitLogIn = this.submitLogIn.bind(this);
    this.sendTweet = this.sendTweet.bind(this);
    this.getTweets = this.getTweets.bind(this);
    this.deleteTweet = this.deleteTweet.bind(this);
    this.state={
    	token:null,
    	posts:[]
    }
  }

  submitSignUp = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password")
    };
    const resp = await axios.post(`${URL}/users`, data);
    const token = resp.data.token;
    localStorage.setItem('token', token);
    // this.setState({ token });
    await this.getTweets();
  }

  submitLogIn = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password")
    };
    const resp = await axios.post(`${URL}/users/login`, data);
    const token = resp.data.token;
    localStorage.setItem('token', token);
    // this.setState({ token });
    await this.getTweets();
  }

  submitLogOut = async (e) => {
    e.preventDefault();
    const token=null;
    const posts=[];
    localStorage.setItem('token', null);
    // this.setState({ token });
    this.setState({posts});
  }

  sendTweet = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      text: formData.get("text")
    };
    console.log(data);
    
    const resp = await axios.post(`${URL}/tweets`, data, {
      headers: {
        // authorization: `Bearer ${this.state.token}`
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    await this.getTweets();
  }

  getTweets = async (e) => {
  	const postData = await axios.get(`${URL}/tweets`, {
      headers: {
        // authorization: `Bearer ${this.state.token}`
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  	console.log(postData);
    const posts = postData.data.tweets;
    await this.setState({posts});
  }

  deleteTweet = async (e, id) => {
    e.preventDefault();
    await axios.delete(`${URL}/tweets/${id}`, {
      headers: {
        // authorization: `Bearer ${this.state.token}`
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    await this.getTweets();
  }

  componentDidMount = () => {
    this.getTweets();
  }

  render() {
  	let {posts} = this.state;
    return (
      <div className="App">
        <h1>Twutter Auth Demo</h1>
        <div>

          <h3>Sign up Form</h3>
          <form onSubmit={this.submitSignUp}>
            <div className="form-group">
  	          <label htmlFor="email">name </label>
  	          <input id="email" name="name" type="name" className="form-control" />
            </div>
            <div className="form-group">
  	          <label htmlFor="email">Enter your email</label>
  	          <input id="" name="email" type="email" className="form-control" />
            </div>
            <div className="form-group">
  	          <label htmlFor="email">password</label>
  	          <input id="email" name="password" type="password" />
            </div>
            <button>Send data!</button>
          </form>

          { localStorage.getItem('token') ? <div><p>Logged in</p> <button onClick={(e)=>this.submitLogOut(e)}>Log Out</button></div>: <h1>Not Logged In</h1> }

          <h3>Log in Form</h3>
          <form onSubmit={this.submitLogIn}>
            <label htmlFor="email">Enter your email</label>
            <input id="email" name="email" type="email" />
            <label htmlFor="email">password</label>
            <input id="email" name="password" type="password" />
            <button>Send data!</button>
          </form>

        </div>

        <form onSubmit={this.sendTweet}>
          <label htmlFor="text">tweet </label>
          <input id="tweet" name="text" type="text" />
          <button>Send data!</button>
        </form>
        { posts.length ? posts.map((post, key) => {
            return <Post key={key} post={post} handleDelete={this.deleteTweet} />
        }) : null }
      </div>
    );
  }
}

export default App;