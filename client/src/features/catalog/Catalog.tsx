import { Product } from "../../app/models/products";
import ProductList from "./ProductList";
import { useState, useEffect } from "react";

export default function Catalog(){

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
      fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(data => setProducts(data));
    }, []); //without [] dependancy, it will be called every rerender, not only 1st load
  
    function addProduct() {
      setProducts(prevState => [...prevState,
      {
        id: prevState.length + 101,
        name: 'product_' + (prevState.length + 1),
        price: (prevState.length * 100),
        brand: 'some brand',
        description: 'some desc',
        pictureUrl: 'http://picsum.photos/200'
      }]);
    }

    return (
        <>
          <ProductList products={products} />
        </>
    )
}