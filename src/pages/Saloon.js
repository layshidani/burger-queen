import React, { Component } from 'react';
import firebase from '../firebase/firebase-config';
import Data from '../data.json';
import './Saloon.css';
import '../components/Button.css';
import Button from '../components/Button';
import { faCoffee, faGlassWhiskey, faHamburger, faCertificate, faPlusCircle, faMinusCircle, faShareSquare, faSignOutAlt, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';

const database = firebase.firestore();
const firebaseAppAuth = firebase.auth();

class Saloon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: [],
      name: '',
      status: '',
      hour: ''
    }

    firebaseAppAuth.onAuthStateChanged(user => {
      if (user) {
        database.collection("users").doc(user.uid).get()
          .then(doc => {
            const data = doc.data();
            const name = data.displayName;
            this.setState({ name })
          });
      }
    });
  }

  hourNow = () => {
    const time = Date().split(' ')[4];
    return time
  }

  handleChange = (event, element) => {
    const newState = this.state;
    newState[element] = event.target.value
    this.setState(newState);
  }

  resetOrderList = () => {
    this.setState({
      order: [],
      clientName: ''
    })
  }

  sendOrder = (order) => {
    if (this.refs.clientName.value === '') {
      alert('Insira o nome do Cliente');
    } else {
      const object = {
        clientName: this.state.clientName,
        order: order,
        waiter: this.state.name,
        status: 'kitchen',
        hour: this.hourNow(),
        hourReady: ''
      }
      database.collection('orders').add(object)
      alert('Pedido enviado!')
      this.resetOrderList();
    }
  }

  handleAdd = (item) => {
    const itemIndex = this.state.order.findIndex(
      (produto) => {
        return produto.title === item.title;
      });

    if (itemIndex < 0) {
      const newItem = {
        ...item,
        quantity: 1
      }

      this.setState({
        order: this.state.order.concat(newItem)
      });
    } else {
      let newOrder = this.state.order;
      newOrder[itemIndex].quantity += 1;
      this.setState({
        order: newOrder
      });
    }
  }

  handleDelete = (item) => {
    const itemIndex = this.state.order.findIndex((produto) => {
      return (produto.title === item.title);
    })

    let newOrder = this.state.order;
    newOrder[itemIndex].quantity -= 1;

    const quantity = newOrder[itemIndex].quantity;

    if (quantity > 0) {
      this.setState({
        order: newOrder
      });
    } else {
      newOrder.splice(itemIndex, 1);
      this.setState({
        order: newOrder
      });
    }
  };

  signOut = () => {
    firebaseAppAuth.signOut()
    this.props.history.push(`/`)
  }

  render() {
    const total = this.state.order.reduce((acc, cur) => {
      return acc + (cur.quantity * cur.price)
    }, 0);

    return (
      <section className='order'>
        <div className='menu'>
          <p>Olá, {this.state.name}!</p>
          <div>
            <Button text='Pedidos prontos para servir' iconName={faHourglassHalf} className='navigation' onClick={() => this.props.history.push(`/ready`)}></Button>
            <Button text='Sair' iconName={faSignOutAlt} className='navigation' onClick={this.signOut}></Button>
          </div>
        </div>
        <h1>#Salão</h1>
        <p>Clique nos itens para adicioná-los ao pedido.</p>
        <h3>Café da manhã: </h3>
        <div className='items'>
          {
            Data.menu.breakfast.map(item => {
              return (<Button className='btn item-btn' iconName={faCoffee} text={item.title} price={': R$' + item.price} key={item.id} onClick={() => this.handleAdd(item)}></Button>)
            })
          }
        </div>
        <h3>Outros: </h3>
        <div className='items'>
          {
            Data.menu.hamburgueres.map(item => {
              return (<Button className='btn item-btn' iconName={faHamburger} text={item.title} price={': R$' + item.price} key={item.id} onClick={() => this.handleAdd(item)}></Button>)
            })
          }
          {
            Data.menu.bebidas.map(item => {
              return (<Button className='btn item-btn' iconName={faGlassWhiskey} text={item.title} price={': R$' + item.price} key={item.id} onClick={() => this.handleAdd(item)}></Button>)
            })
          }
          {
            Data.menu.acompanhamentos.map(item => {
              return (<Button className='btn item-btn' iconName={faCertificate} text={item.title} price={': R$' + item.price} key={item.id} onClick={() => this.handleAdd(item)}></Button>)
            })
          }
        </div>
        <div className='order-list'>
          <h1>Resumo do Pedido</h1>
          {/* <div ref='orderList'> */}
            {
              this.state.order.map((item, i) => {
                return (
                  <div key={i}>
                    <p>
                      Produto: {item.title} - Qtd: {item.quantity} - Subtotal: R$ {item.price * item.quantity}
                    </p>
                    <Button className='plus-minus-btn' iconName={faMinusCircle} onClick={() => this.handleDelete(item)}></Button>
                    <Button className='plus-minus-btn' iconName={faPlusCircle} onClick={() => this.handleAdd(item)}></Button>
                  </div>
                )
              })
            }
          {/* </div> */}
          <h3>Valor Total do Pedido</h3>
          <p ref='totalPrice'>R$ {total}</p>
          <input value={this.state.clientName}
            placeholder='Nome da(o) cliente' ref='clientName'
            onChange={(e) => this.handleChange(e, 'clientName')} />
          <Button text='Enviar pedido para cozinha' className='btn item-btn' iconName={faShareSquare} onClick={() => this.sendOrder(this.state.order)} />
        </div>
      </section>
    )
  }

}

export default Saloon;
