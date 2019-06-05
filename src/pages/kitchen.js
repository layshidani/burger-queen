import React from 'react';
import firebase from '../firebase/firebase-config';

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
    database.collection('Orders').get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map(doc => doc.data());
        this.setState({ listItem: data });
      });
  }

  handleClick = (order) => {
    const object = {
      clientName: this.state.clientName,
      order: order
    }
    database.collection('Orders').add(object)
    this.setState({
      listItem: this.state.listItem.concat(object)
    })
  }

  render() {
    const orders = this.state.listItem;
    const client = orders.map((pedido) => {
      return pedido.clientName;
    })

    const pedido = orders.map((item) => {
      const order = item.order;

      for (let i in order) {
        const title = order[i].title;
        const quantity = order[i].quantity;
        console.log('quantity: ', quantity);
        console.log('title: ', title);

        // return 'Quantidade: ' + quantity + ' - Produto: ' + title;
      }

    })
    // console.log('pedido: ', pedido);

    return (
      <section className='order-list'>
        <p>Vc está na Cozinha</p>
        <h1>Seus Pedidos que já estão na cozinha:</h1>
        
          <h2>{client}</h2>
          <ul>
            {pedido}
          </ul>
        
      </section>
    )
  }

}

export default Kitchen
