import React, { Component } from 'react';
import firebase from '../firebase/firebase-config';
import Button from '../components/Button';
import './kitchen.css';
import { faCheck, faHourglassHalf, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const firebaseAppAuth = firebase.auth();
const database = firebase.firestore();

class Kitchen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItem: [],
      order: []
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

  componentDidMount() {
    database.collection('orders').get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        const compare = (a, b) => {
          let firstOrder = parseFloat((a.hour).replace(':').replace(/[^\d.-]/g, ''));
          let secondOrder = parseFloat((b.hour).replace(':').replace(/[^\d.-]/g, ''));

          if (firstOrder < secondOrder) {
            return -1;
          } else if (firstOrder > secondOrder) {
            return 1;
          } else {
            return 0;
          }
        }

        data.sort(compare);
        this.setState({ listItem: data });
      });
  }

  hour = () => {
    const time = Date().split(' ')[4];
    return time
  }

  orderReady = (id, index) => {
    database.collection('orders').doc(id).update({
      status: 'ready',
      hourReady: this.hour()
    })

    const element = document.getElementById(index);
    element.parentNode.removeChild(element);

  }

  render() {
    const orders = this.state.listItem;

    return (
      <section className='order-list'>
        <div className='menu'>
          <p>Olá, {this.state.name}!</p>
          <div>
            <Button text='Ver Tempo de preparo e pedidos prontos para servir' iconName={faHourglassHalf} className='navigation' onClick={() => this.props.history.push(`/ready`)}></Button>
            <Button text='Sair' iconName={faSignOutAlt} className='navigation'></Button>
          </div>
        </div>
        <h1>#Cozinha</h1>
        <div>
          <h1>Pedidos em preparo:</h1>
          {
            orders.map((orders, index) => {
              if (orders.status === 'kitchen') {
                return (
                  <div id={'orders' + index} className='order-kitchen' key={'order' + index}>
                    <h2>Pedido {index + 1}</h2>
                    <p className='time'>Hora do pedido: {orders.hour}</p>
                    <p>Cliente: {orders.clientName}</p>
                    <p>Atendente: {orders.waiter}</p>
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
                    <Button key={index} className='order-ready' iconName={faCheck} text='Pronto para servir!' onClick={() => this.orderReady(orders.id, 'orders' + index)}></Button>
                  </div>
                )
              }
            })
          }
        </div>
      </section>
    )
  }
}

export default Kitchen
