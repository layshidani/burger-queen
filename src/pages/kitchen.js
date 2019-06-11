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
        const data = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
        this.setState({ listItem: data });
      });
  }

  orderReady = (id) => {
    database.collection('orders').doc(id).update({
      status: 'ready'
    })
  };

  render() {
    const orders = this.state.listItem;

    return (
      <section className='order-list'>
        <p>Vc está na Cozinha</p>
        <h1>Seus Pedidos que já estão na cozinha:</h1>
        {
          orders.map((client, index) => {
            if (client.status === 'kitchen') {
              return (
                <div className='order-kitchen'>
                  <h2>Pedido {index + 1}</h2>
                  <p>Hora do pedido: {client.hour}</p>
                  <p>Cliente: {client.clientName}</p>
                  <p>Atendente: {client.waiter}</p>
                  {
                    client.order.map((pedido) => {
                      return <p>Qtd: {pedido.quantity} - {pedido.title}</p>
                    })
                  }
                  <Button className='order-ready' iconName={faCheckCircle} text='Pedido Pronto!' onClick={() => this.orderReady(client.id)}></Button>
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
