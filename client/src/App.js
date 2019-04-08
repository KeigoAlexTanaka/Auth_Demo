import React, { Component } from "react";
import axios from "axios";
import "./App.css";

const URL = "http://localhost:8080";

class App extends Component {
  constructor() {
    super();
    this.submitSignUp = this.submitSignUp.bind(this);
    this.submitLogIn = this.submitLogIn.bind(this);
    this.sendTweet = this.sendTweet.bind(this);
    this.getTweets = this.getTweets.bind(this);
    window.getTweets = this.getTweets;
    const token = window.localStorage.getItem('token')
    this.state = { token: token, tweets: [] };
    if (token){
      this.getTweets()
    }
    this.logout = this.logout.bind(this)
    window.c = this
  }

  

  async submitSignUp(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password")
    };
    const resp = await axios.post(`${URL}/users`, data);
    const token = resp.data.token;
    const userName = resp.data.user.name;
    this.setState({ token:token});

    window.localStorage.setItem('token', token)
  }

  logout(){
    this.setState({token:false})
  }

  async submitLogIn(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password")
    };
    const resp = await axios.post(`${URL}/users/login`, data);
    const token = resp.data.token;
    this.setState({ token });
    window.localStorage.setItem('token', token)

    this.getTweets()
  }

  async sendTweet(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      text: formData.get("text")
    };
    console.log(data);
    
    // data format: what is the additional data / header data?
    // why include "bearer"
    const resp = await axios.post(`${URL}/tweets`, data, {
      headers: {
        authorization: `Bearer ${this.state.token}`
      }
    });
    this.getTweets()
  }

  async getTweets(e) {
    const resp = await axios.get(`${URL}/tweets`, {
      headers: {
        authorization: `Bearer ${this.state.token}`
      }
    });
    console.log(resp);
    this.setState({tweets: resp.data.tweets})
  }

  renderForms() {
    return (
      <div>
        {" "}
        <h3>Register Form</h3>
        <form onSubmit={this.submitSignUp}>
          {/* <div class="form-group"> */}
          <label htmlFor="email">name </label>
          <input id="email" name="name" type="name" className="form-control" />
          {/* </div> */}

          {/* <div class="form-group"> */}
          <label htmlFor="email">Enter your email</label>
          <input id="" name="email" type="email" className="form-control" />
          {/* </div> */}
          {/* <div class="form-group"> */}
          <label htmlFor="email">password</label>
          <input id="email" name="password" type="password" />
          {/* </div> */}
          <button>Send data!</button>
        </form>
        <br />
        <h3>Log in Form</h3>
        <form onSubmit={this.submitLogIn}>
          <label htmlFor="email">Enter your email</label>
          <input id="email" name="email" type="email" />

          <label htmlFor="email">password</label>
          <input id="email" name="password" type="password" />

          <button>Send data!</button>
        </form>
      </div>
    );
  }

  renderSendTweetForm() {
    return <div> send tweet</div>;
  }

  render() {
    return (
      <div className="App">
        <h1>Auth Demo</h1>
        {!this.state.token ? (
          this.renderForms()
        ) : (
          <form onSubmit={this.sendTweet}>
            <label htmlFor="text">tweet </label>
            <input id="tweet" name="text" type="text" />
            <button>Send data!</button>
          </form>
        )}
        {this.state.tweets.map(tweet => {
          return <div key={tweet.id}>{tweet.text} </div>
        })}
      </div>
    );
  }
}

export default App;
