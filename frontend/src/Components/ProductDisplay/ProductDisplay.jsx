import React, { useContext } from 'react';
import './ProductDisplay.css';
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from '../../Context/ShopContext';
const url ='https://mern-ec-deploy-backend.onrender.com';

const ProductDisplay = (props) => {
    const { product } = props;
    const {addToCart}= useContext(ShopContext);
    return (
        <div className='productdisplay'>
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    <img src={`${url}${product.image}`} alt="not available" />
                    <img src={`${url}${product.image}`} alt="not available" />
                    <img src={`${url}${product.image}`} alt="not available" />
                    <img src={`${url}${product.image}`} alt="not available" />
                </div>
                <div className="productdisplay-main-img">
                    <img src={`${url}${product.image}`} alt="" />
                </div>
            </div>

            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-stars">
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                    <p>122</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-prices-old">&#8377;{product.old_price}</div>
                    <div className="productdisplay-right-prices-new">&#8377; {product.new_price}</div>
                </div>
                <div className="productdisplay-right-description">
                    A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.
                </div>
                <div className="productdisplay-right-size">
                    <h1>Select Size</h1>
                    <div className="productdisplay-right-size-options">
                        <div>S</div>
                        <div>M</div>
                        <div>L</div>
                        <div>XL</div>
                        <div>XXL</div>
                    </div>
                </div>
                <button onClick={()=>{addToCart(product.id)}}>ADD TO CART</button>
                <p className="productdisplay-right-category"><span>Category: <span>Women, T-Shirt, Crop Top</span></span></p>
                <p className="productdisplay-right-category"><span>TAGS: <span>Modern, Latest</span></span></p>
            </div>
        </div>
    )
}

export default ProductDisplay;
