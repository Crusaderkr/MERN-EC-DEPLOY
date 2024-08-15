import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

const url = 'https://mern-ec-deploy-backend.onrender.com/images';

const Item = (props) => {
  // Construct the image URL correctly
  const imageUrl = `${url}/${image}`;

  return (
    <div className='item'>
      <Link to={`/product/${props.id}`}>
        <img
          onClick={() => window.scrollTo(0, 0)}
          src={imageUrl}
          alt="Image not available"
        />
      </Link>
      <p>{props.name}</p>
      <div className="item-prices">
        <div className="item-price-new">
          &#8377;{props.new_price}
        </div>
        <div className="item-price-old">
          {props.old_price}
        </div>
      </div>
    </div>
  );
}

export default Item;
