import React from 'react';
import firebase from '../firebase/firebase-config';
import Button from '../components/Button';
import './kitchen.css';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const database = firebase.firestore();


class Kitchen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listItem: [],
      order: []
    }
  }

  componentDidMount() {
    database.collection('orders').get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        this.setState({ listItem: data });
      });
  }

  orderReady = (id) => {
    // database.collection('orders').doc(id).update({
    //   status: 'ready'
    // })
    console.log('this.refs: ',id, this.refs);
      // this.refs.parentNode.removeChild(this.refs);
      this.refs.parentNode.removeChild(this.refs)
    // const element = document.getElementById('orders-kitchen');
    // element.parentNode.removeChild(element);
  };

  render() {
    const orders = this.state.listItem;

    return (
      <section className='order-list'>
        <p>Vc está na Cozinha</p>
        <h1>Seus Pedidos que já estão na cozinha:</h1>
        {
          orders.map((orders, index) => {
            if (orders.status === 'kitchen') {
              return (
                <div id='orders-kitchen' className='order-kitchen' key={index} ref={orders.id}>
                  <h2>Pedido {index + 1}</h2>
                  <p>Hora do pedido: {orders.hour}</p>
                  <p>Cliente: {orders.clientName}</p>
                  <p>Atendente: {orders.waiter}</p>
                  {
                    orders.order.map((order, index) => {
                      return <p key={index}>Qtd: {order.quantity} - {order.title}</p>
                    })
                  }
                  <Button key={index} className='order-ready' iconName={faCheckCircle} text='Pedido Pronto!' onClick={() => this.orderReady(orders.id)}></Button>
                </div>
              )
            }

          })
        }
      </section>
    )
  }
}

export default Kitchen
