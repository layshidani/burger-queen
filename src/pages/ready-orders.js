import React, { Component } from 'react';
import firebase from '../firebase/firebase-config';
import Button from '../components/Button';
import './ready-orders.css';
import { faAngleLeft, faCheckDouble, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const firebaseAppAuth = firebase.auth();
const database = firebase.firestore();

class Ready extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItem: [],
      type: '',
      order: [],
      preparingTime: ''
    }

    firebaseAppAuth.onAuthStateChanged(user => {
      if (user) {
        database.collection('users').doc(user.uid).get()
          .then(doc => {
            const data = doc.data();
            const name = data.displayName;
            const type = data.userType;
            this.setState({ name, type})
          });
      }
    });
  }

  componentDidMount() {
    database.collection('orders').get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        this.setState({ 
          listItem: data,
         });

        const compare = (a, b) => {
          let firstOrder = a.hourReady;
          let secondOrder = b.hourReady;

          if (firstOrder < secondOrder) {
            return -1;
          } else if (firstOrder > secondOrder) {
            return 1;
          } else {
            return 0;
          }
        }

        data.sort(compare);
      });
  }

  orderDelivered = (id, index) => {
    database.collection('orders').doc(id).update({
      status: 'ok',
    })

    const element = document.getElementById(index);
    element.parentNode.removeChild(element);
  }

  signOut = () => {
    firebaseAppAuth.signOut()
    this.props.history.push(`/`)
  }

  returnPage = () => {
    this.props.history.push(`/${this.state.type}`)
  }

  render() {
    const orders = this.state.listItem;

    return (
      <section className='order-list-kitchen'>
        <div className='menu'>
          <p>Olá, {this.state.name}!</p>
          <div>
            <Button text='Voltar' iconName={faAngleLeft} className='navigation' onClick={() => this.returnPage(orders)}></Button>
            <Button text='Sair' iconName={faSignOutAlt} className='navigation' onClick={this.signOut}></Button>
          </div>
        </div>
        <h1># Prontos para Servir</h1>
        {
          orders.map((orders, index) => {
            if (orders.status === 'ready') {
              return (
                <div id={'orders' + index} className='order-ready' key={'ready' + index} ref={orders.id}>
                  <h2>Pedido {orders.orderNumber}</h2>
                  <p className='time'>Hora do pedido: {orders.hour} - Pronto: {orders.hourReady}</p>
                  <p className='time'>Tempo de preparo: {orders.preparingTime}
                  </p>
                  <p>Cliente: {orders.clientName} (Atendente: {orders.waiter})</p>
                  <table className='order-resume'>
                    <thead>
                      <tr>
                        <td>Resumo do pedido</td>
                        <td></td>
                      </tr>
                      <tr>
                        <th>Qtd</th>
                        <th>Item</th>
                      </tr>
                    </thead>
                    {
                      orders.order.map((order, index) => {
                        return (
                          <tbody key={'tr' + index}>
                            <tr>
                              <td>{order.quantity}</td>
                              <td> {order.title}</td>
                            </tr>
                          </tbody>
                        )
                      })
                    }
                  </table>
                  <Button key={index} className='order-delivered' iconName={faCheckDouble} text='Servido!' onClick={() => this.orderDelivered(orders.id, 'orders' + index)}></Button>
                </div>
              )
            }
          })
        }
      </section>
    )
  }
}

export default Ready
