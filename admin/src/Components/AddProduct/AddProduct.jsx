import React, {useState} from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'
const url='https://mern-ec-deploy-backend.onrender.com';
const AddProduct = () => {

    const [image,setImage] = useState(false);
    const [productDetials,setProductDetails]= useState({
          name:"",
          image:"",
          category:"women",
          new_price:"",
          old_price:""


    })
    const imageHandler =(e)=>{
          setImage(e.target.files[0]);
    }
    const changeHandler =(e) =>{
      setProductDetails({...productDetials,[e.target.name]:e.target.value})
    }

    const add_Product = async ()=>{
        console.log(productDetials);
        let responseData;
        let product = productDetials;

        let formData = new FormData();
        formData.append('product',image);

        await fetch(`${url}/upload`,{
          method: 'POST',
          headers:{
            Accept:'application/json',
          },
          body:formData,
        }).then((resp) => resp.json().then((data)=>{responseData=data}))
    
          if(responseData.success)
            {
              product.image = responseData.image_url;
              console.log(product);
              await fetch(`${url}/addproduct`,{
                method: 'POST',
                headers:{
                  Accept:'application/json',
                  'content-Type':'application/json'
                },
                body:JSON.stringify(product),

              }).then((resp)=>resp.json()).then((data)=>{
                data.success?alert("Product Added"):alert("Failed")
              })
            }
      }
  
  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input value={productDetials.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetials.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here' />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input value={productDetials.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here' />
        </div>
        <div className="addproduct-itemfield">
          <p>Product category</p>
          <select value={productDetials.category} onChange={changeHandler} name="category" className='add-product-selector'>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kid">Kid</option>
          </select>
        </div>
        <div className="addproduct-itemfield">
          <label htmlFor="file-input">
            <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumbnail-img' alt="" />
          </label>
          <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />
          <button onClick={()=>{add_Product()}} className='addproduct-btn'>ADD</button>
        </div>
      </div>
    </div>
  )
}

export default AddProduct
