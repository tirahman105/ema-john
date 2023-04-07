import React, { useEffect, useState } from 'react';
import Product from '../Product/Product';
import Cart from '../Cart/Cart';
import './Shop.css';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import { Link } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]) 


    useEffect(() => {
        fetch('products.json')
        .then(res => res.json())
        .then(data => setProducts(data))
    }, []);

    useEffect(() => {
       
        const storedCart = getShoppingCart();
        const savedCart = [];
        // console.log(storedCart);

        // step 1 get id 
        for(const id in storedCart){
        //    step 2: get the product by using id 
            const addedProduct = products.find(product => product.id === id)
            // console.log(savedProduct);
            if(addedProduct){
                // step 3: get quantity of the product 
            const quantity = storedCart[id];
            addedProduct.quantity = quantity;

            // step 4: add the addedproduct to the saved cart 
            savedCart.push(addedProduct);
            }
            
        }
        // step 5 : set the cart
        setCart(savedCart);
    }, [products])

    const handleAddToCart = (product) =>{
        // console.log('Added', product)
        // const newCart = [...cart, product];

        let newCart = [];

        // if product does not exist in the cart , then set the quantity = 1
        // if exist update quantity by 1

        const exists = cart.find(pd => pd.id === product.id);

        if(!exists){
            product.quantity = 1;
            newCart=[...cart, product]
        }else{
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd.id !== product.id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product.id);
    }

    const handleClearCart = () =>{
        setCart([]);
        deleteShoppingCart();
    };

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                    key={product.id}
                    product= {product}
                    handleAddToCart= {handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart 
                cart = {cart}
                handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders"><button className='btn-proceed'>Review Orders</button></Link>
                </Cart>
            </div>
            
        </div>
    );
};

export default Shop;