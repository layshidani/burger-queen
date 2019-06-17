import React, { Component } from 'react';
import './home.css'
import Button from '../components/Button'
import '../components/Form.css'
import firebase from '../firebase/firebase-config';
import withFirebaseAuth from 'react-with-firebase-auth';
import { Link } from 'react-router-dom';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const firebaseAppAuth = firebase.auth();
const database = firebase.firestore();

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      displayName: '',
      errorMsg: ''
    };
  }

  handleChange = (event, element) => {
    const newState = this.state;
    newState[element] = event.target.value
    this.setState({ newState });
  }


  signIn = () => {
    const { email, password } = this.state;
    this.props.signInWithEmailAndPassword(email, password)
      .then((resp) => {
        const id = resp.user.uid;
        database.collection('users').doc(id).get()
          .then((resp) => {
            this.props.history.push(`/${resp.data().userType}`);
          })
      }).catch((error) => {
        this.setState({ errorMsg: error.message });
      })
  }

  render() {
    return (
      <section className='home'>
        <div className='form'>
          <h2>Entrar</h2>
          <p>{this.state.errorMsg}</p>
          <input value={this.state.email} type='email'
            placeholder='Email'
            onChange={(e) => this.handleChange(e, 'email')} />
          <input value={this.state.password} type='password'
            placeholder='Senha'
            onChange={(e) => this.handleChange(e, 'password')} />
          <Button text='Entrar' className='btn' iconName={faSignInAlt} onClick={this.signIn} />
          <Link className='link' to='/signUp'>Clique aqui para cadastrar</Link>
        </div>
      </section>
    )
  }
}

export default withFirebaseAuth({
  firebaseAppAuth,
})(Home);
