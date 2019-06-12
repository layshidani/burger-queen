import React, {Component} from 'react';
import './home.css'
import Button from '../components/Button'
import '../components/Form.css'
import firebase from '../firebase/firebase-config';
import withFirebaseAuth from 'react-with-firebase-auth';
import addUser from '../firebase/firestore';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const firebaseAppAuth = firebase.auth();
const database = firebase.firestore();

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      displayName: '',
    };
  }

  handleChange = (event, element) => {
    const newState = this.state;
    newState[element] = event.target.value
    this.setState(newState);
  }

  createUser = () => {
    const { email, password, displayName, userType } = this.state;

    this.props.createUserWithEmailAndPassword(email, password)
      .then((data) => {
        if (!data) return;
        const { user: { uid } } = data;
        addUser({
          email,
          displayName,
          userType: this.refs.userType.value
        }, uid)
      })
      .then((resp) => {
        if (resp) {
          this.props.history.push(`/${userType}`)
        }
      })
  }

  signIn = () => {
    const { email, password } = this.state;
    this.props.signInWithEmailAndPassword(email, password)
      .then((resp) => {
        const id = resp.user.uid;
        database.collection('users').doc(id).get()
          .then((resp) => {
            this.props.history.push(`/${resp.data().userType}`)
          })
          .catch((error) => {
            alert(error)
          })
      })
  }

  render() {
    const errorMsg = this.props.error;
    return (
      <div>
        <p>
          {errorMsg}
        </p>
        <select ref='userType' onChange={(e) => this.handleChange(e, 'userType')}>
          <option value='saloon'>Salão</option>
          <option value='kitchen'>Cozinha</option>
        </select>

        <input value={this.state.displayName}
          placeholder='Nome de usuário'
          onChange={(e) => this.handleChange(e, 'displayName')} />

        <input value={this.state.email} type='email'
          placeholder='Email'
          onChange={(e) => this.handleChange(e, 'email')} />
        <input value={this.state.password} type='password'
          placeholder='Senha'
          onChange={(e) => this.handleChange(e, 'password')} />
        <Button text='Entrar' className='btn' iconName={faSignInAlt} onClick={this.signIn} />
        <Button text='Cadastrar' className='btn' iconName={faUserPlus} onClick={this.createUser} />
      </div>
    )
  }
}

export default withFirebaseAuth({
  firebaseAppAuth,
})(Home);
