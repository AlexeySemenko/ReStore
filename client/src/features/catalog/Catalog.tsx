import LoadingComponent from "../../app/layouts/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productSelectors } from "./CatalogSlice";
import ProductList from "./ProductList";
import { useEffect } from "react";

export default function Catalog(){

    const products = useAppSelector(productSelectors.selectAll);
    const dispatch = useAppDispatch();
    const {productsLoaded} = useAppSelector(state => state.catalog);

    useEffect(() => {
    //   fetch('http://localhost:5000/api/products')
    //     .then(response => response.json())
    //     .then(data => setProducts(data));
    // 
      // agent.Catalog.list()
      // .then(data => setProducts(data))
      // .catch(error => console.log(error))
      // .finally(() => setLoading(false));

      if(!productsLoaded){
        dispatch(fetchProductsAsync());
      }

    }, [productsLoaded, dispatch]); //without [] dependancy, it will be called every rerender, not only 1st load


    if(status.includes('pending'))
      return <LoadingComponent message="Loading catalog..."/>
  
    // function addProduct() {
    //   setProducts(prevState => [...prevState,
    //   {
    //     id: prevState.length + 101,
    //     name: 'product_' + (prevState.length + 1),
    //     price: (prevState.length * 100),
    //     brand: 'some brand',
    //     description: 'some desc',
    //     pictureUrl: 'http://picsum.photos/200'
    //   }]);
    // }

    return (
        <>
          <ProductList products={products} />
        </>
    )
}