import ProductItem from './ProductItem';
import classes from './Products.module.css';

const DUMMYPRODUCTS = [
  {
    id: 'p1',
    price: 6,
    title: 'My First Boook',
    description: 'First book I ever wrote'
  },
  {
    id: 'p2',
    price: 10,
    title: 'My Second Boook',
    description: 'Second book I ever wrote'
  },
  {
    id: 'p3',
    price: 8,
    title: 'My Thirf Boook',
    description: 'Third book I ever wrote'
  },
]

const Products = (props) => {
  return (
    <section className={classes.products}>
      <h2>Buy your favorite products</h2>
      <ul>
        {
          DUMMYPRODUCTS.map((product) => (
            <ProductItem
              title={product.title}
              price={product.price}
              description={product.description}
              id={product.id}
              key={product.id}
            />
          ))
        }
      </ul>
    </section>
  );
};

export default Products;
