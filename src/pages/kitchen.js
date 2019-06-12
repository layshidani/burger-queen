import React from 'react';
import firebase from '../firebase/firebase-config';
import Button from '../components/Button';
import './kitchen.css';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

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

  orderReady = (id) => {
    // database.collection('orders').doc(id).update({
    //   status: 'ready'
    // })
    console.log('this.refs: ', id, this.refs);
    // this.refs.parentNode.removeChild(this.refs);
    this.refs.parentNode.removeChild(this.refs)
    // const element = document.getElementById('orders-kitchen');
    // element.parentNode.removeChild(element);
  };

  render() {
    const orders = this.state.listItem;

    return (
      <section className='order-list'>
        <p>#Cozinha</p>
        <h1>Pedidos em preparo:</h1>
        {
          orders.map((orders, index) => {
            if (orders.status === 'kitchen') {
              return (
                <div id='orders-kitchen' className='order-kitchen' key={index} ref={orders.id}>
                  <h2>Pedido {index + 1}</h2>
                  <p className='time'>Hora do pedido: {orders.hour}</p>
                  <p>Cliente: {orders.clientName}</p>
                  <p>Atendente: {orders.waiter}</p>
                  <table className='order-resume'>
                    <tr>
                      <tr>Resumo do pedido</tr>
                    </tr>
                    <tr>
                      <th>Qtd</th>
                      <th>Item</th>
                    </tr>

                    {
                      orders.order.map((order, index) => {
                        return (
                          <tr>
                            <td key={index}>{order.quantity}</td>
                            <td key={index}> {order.title}</td>
                          </tr>
                        )
                      })
                    }
                  </table>
                  <Button key={index} className='order-ready' iconName={faCheckCircle} text='Pronto para servir!' onClick={() => this.orderReady(orders.id)}></Button>
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
