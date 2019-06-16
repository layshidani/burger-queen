import React, { Component } from 'react';
import firebase from '../firebase/firebase-config';
import Button from '../components/Button';
import './kitchen.css';
import { faAngleLeft, faCheckDouble, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const firebaseAppAuth = firebase.auth();
const database = firebase.firestore();

class Ready extends Component {
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

  orderDelivered = (id, index) => {
    database.collection('orders').doc(id).update({
      status: 'ok',
    })

    console.log(':::', id, index);

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
            <Button text='Voltar' iconName={faAngleLeft} className='navigation' onClick={() => this.returnPage(orders)}></Button>
            <Button text='Sair' iconName={faSignOutAlt} className='navigation'></Button>
          </div>
        </div>
        <h1># Prontos para Servir</h1>
        {
          orders.map((orders, index) => {
            if (orders.status === 'ready') {
              return (
                <div id={'orders' + index} className='order-ready' key={'ready' + index} ref={orders.id}>
                  <h2>Pedido {index + 1}</h2>
                  <p className='time'>Hora do pedido: {orders.hour} - Pronto: {orders.hourReady}</p>
                  <p className='time'>Tempo de preparo: {new Date(
                    ((+orders.hourReady.split(':')[0]) * 60 * 60 + (+orders.hourReady.split(':')[1]) * 60 + (+orders.hourReady.split(':')[2]) - (+orders.hour.split(':')[0]) * 60 * 60 + (+orders.hour.split(':')[1]) * 60 + (+orders.hour.split(':')[2])) * 1000).toISOString().substr(11, 8)}
                  </p>
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
                  <Button key={index} className='order-delivered' iconName={faCheckDouble} text='Servido!' onClick={() => this.orderDelivered(orders.id, 'orders' + index)}></Button>

                  {console.log('>>>', orders.id, index)}
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
