import React, { Component } from 'react';
import './home.css'
import Button from '../components/Button'
import '../components/Form.css'
import firebase from '../firebase/firebase-config';
import withFirebaseAuth from 'react-with-firebase-auth';
import { Link } from 'react-router-dom';
import addUser from '../firebase/firestore';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

const firebaseAppAuth = firebase.auth();

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      displayName: '',
      errorMsg: '',
      userType: 'Saloon'
    };
  }

  handleChange = (event, element) => {
    const newState = this.state;
    newState[element] = event.target.value;
    this.setState({ newState });
  }

  createUser = () => {
    const { email, password, displayName, userType } = this.state;

    if (displayName !== '') {
      this.props.createUserWithEmailAndPassword(email, password)
        .then((data) => {
          const { user: { uid } } = data;
          addUser({
            email,
            displayName,
            userType
          }, uid)
          this.props.history.push(`/${userType}`);
        }).catch(() => {
          this.setState({
            errorMsg: this.props.error
          })
        })
    } else {
      this.setState({
        errorMsg: 'Preencha o nome do usuário'
      })
    }
  }

  render() {
    return (
      <section className='home'>
        <div className='form'>
          <h2>Cadastrar</h2>
          <p>{this.state.errorMsg}</p>
          <input value={this.state.displayName}
            placeholder='Nome de usuário'
            onChange={(e) => this.handleChange(e, 'displayName')} />
          <input value={this.state.email} type='email'
            placeholder='Email'
            onChange={(e) => this.handleChange(e, 'email')} />
          <input value={this.state.password} type='password'
            placeholder='Senha'
            onChange={(e) => this.handleChange(e, 'password')} />
          <select ref='userType' onChange={(e) => this.handleChange(e, 'userType')} value={this.state.userType}>
            <option value='saloon'>Salão</option>
            <option value='kitchen'>Cozinha</option>
          </select>
          <Button text='Cadastrar' className='btn' iconName={faUserPlus} onClick={this.createUser} />
          <Link className='link' to='/'>Clique aqui para Entrar</Link>
        </div>
      </section>
    )
  }
}

export default withFirebaseAuth({
  firebaseAppAuth,
})(SignUp);
