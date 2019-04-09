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
    window.c = this
    this.state = {
      token: "",
      tweets : []
    }
  }

  async submitSignUp(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password")
    };
    const res = await axios.post(URL + "/users" , data)
    console.log('result object:',res);
  
    this.setState({
      token: "Bearer " + res.data.token
    })

    // ~~~ send form data ~~~
  }

  async submitLogIn(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password")
    };
    console.log(data);

    const res = await axios.post(`${URL}/users/login`, data)
    this.setState({
      token: "Bearer " + res.data.token
    })
    
  }

  async sendTweet(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      text: formData.get("text")
    };
    const res = await axios.post(`${URL}/tweets`, data, {
      headers:{
        authorization: this.state.token
      }
    })

  }

  async getTweets() {
    const res = await axios.get(`${URL}/tweets`,  {
      headers:{
        authorization: this.state.token
      }
    }) 
    this.setState({
      tweets: res.data.tweets
    })
  }

  render() {
    return (
      <div className="App">
        <h1>Auth Demo</h1>
        <div>
        {" "}
        <h3>Sign up Form</h3>
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
      <br/>
        <form onSubmit={this.sendTweet}>
          <label htmlFor="text">tweet </label>
          <input id="tweet" name="text" type="text" />
          <button>Send data!</button>
        </form>
      </div>
    );
  }
}

export default App;
