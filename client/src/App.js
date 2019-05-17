import React, {Component} from 'react';
import './App.css';
import './components/Header'
import Header from './components/Header';
//import axios from 'axios';


class App extends Component {

  constructor() {
    super()
    this.state = {
        data: null,
        firstName: "",
        lastName: "",
        personalNumber: "",
        eMail: ""
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      
      .catch(err => console.log(err));
    }

    // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
    callBackendAPI = async () => {
    const response = await fetch('http://localhost:3000/express_backend');
    
    const body = await response.json();

    if (response.status !== 200) {
    throw Error(body.message) 
    }
    return body;
  };

  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    }) 
  }

  async handleSubmit(event) {
    alert('You are now registered: ' + this.state.value);
    event.preventDefault(); 
    //const {firstName, lastName, personalNumber, eMail} = this.state;
    /*const information = {
      firstName: firstName, 
      lastName: lastName,
      personalNumber: personalNumber, 
      eMail: eMail}*/

    fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          personalNumber: this.state.personalNumber,
          eMail: this.state.eMail
        })
      })
      .catch(err => {
        console.error(err);
      })
    };

  render() {
    console.log(this.state.data)
    return(
      <div className="center">
          <Header className="App-center"/>
          
        <form onSubmit={this.handleSubmit}>
          <input type="text" 
          value={this.state.firstName} 
          name="firstName" 
          placeholder="First Name" 
          onChange={this.handleChange}/>
          <br/>
          <input type="text" 
          value={this.state.lastName} name="lastName"
          placeholder="Last Name"
          onChange={this.handleChange}/>
          <br/>
          <input type="text"
          value={this.state.personalNumber}
          name="personalNumber"
          placeholder="YYMMDD"
          onChange={this.handleChange}/>
          <br/>
          <input type="text"
          value={this.state.eMail}
          name="eMail"
          placeholder="Email" 
          onChange={this.handleChange}/>
          <br/>
          <button>Submit</button>
        </form>
      </div>
    )
  }

}

export default App;
