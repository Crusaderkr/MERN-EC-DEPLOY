import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    try {
      const res = await fetch('http://localhost:4000/allproducts');
      const data = await res.json();
      setAllProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const removeProduct = async (id) => {
    try {
      const res = await fetch('http://localhost:4000/removeproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        await fetchInfo();
      } else {
        const errorData = await res.json();
        console.error('Error removing product:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="list-product-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="list-product-allproducts">
        <hr />
        {allProducts.map((product, index) => (
          <React.Fragment key={product.id}>
            <div className="list-product-format">
              <div>
                <img src={product.image} alt="" className="listproduct-product-icon" />
              </div>
              <div>
                <p>{product.name}</p>
              </div>
              <div>
                <p>${product.old_price}</p>
              </div>
              <div>
                <p>${product.new_price}</p>
              </div>
              <div>
                <p>{product.category}</p>
              </div>
              <div>
                <img
                  onClick={() => removeProduct(product.id)}
                  className="listproduct-remove-icon"
                  src={cross_icon}
                  alt=""
                />
              </div>
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;

