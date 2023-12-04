import { useEffect } from "react";
import { productSelectors, fetchFilters, fetchProductsAsync } from "../../features/catalog/CatalogSlice";
import { useAppSelector, useAppDispatch } from "../store/configureStore";

export default function useProducts(){
    const products = useAppSelector(productSelectors.selectAll);
    const dispatch = useAppDispatch();
    const {productsLoaded, filtersLoaded, brands, types, metaData} = useAppSelector(state => state.catalog);

    ///Use 2 useEffects to prevent multiple times querying product / filters with 1 dependancy for each
    useEffect(() => {
      if(!filtersLoaded){
        dispatch(fetchFilters());
      }
    }, [dispatch, filtersLoaded]);
    

    useEffect(() => {
      if(!productsLoaded){
        dispatch(fetchProductsAsync());
      }
    }, [dispatch, productsLoaded]); //without [] dependancy, it will be called every rerender, not only 1st load

    return {
        products,
        productsLoaded,
        filtersLoaded,
        brands,
        types,
        metaData
    }
}