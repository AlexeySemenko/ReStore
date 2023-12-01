import { Grid, Paper } from "@mui/material";
import LoadingComponent from "../../app/layouts/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchFilters, fetchProductsAsync, productSelectors, setPageNumber, setProductParams } from "./CatalogSlice";
import ProductList from "./ProductList";
import { useEffect } from "react";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckBoxButtons from "../../app/components/CheckBoxButtons";
import AppPAgination from "../../app/components/AppPagination";

const sortOptions = [
  { value: 'name', label: 'Alphabetical'},
  { value: 'priceDesc', label: 'Price - High to Low'},
  { value: 'price', label: 'Price - Low to High'},
];

export default function Catalog(){

    const products = useAppSelector(productSelectors.selectAll);
    const dispatch = useAppDispatch();
    const {productsLoaded, filtersLoaded, brands, types, productParams, metaData} = useAppSelector(state => state.catalog);

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

   
    if(!filtersLoaded)
      return <LoadingComponent message="Loading catalog..."/>
  
      //Grid spacing like in bootstrap - 12 parts, 3 + 9 here... (2 columns 3 and 9)
    return (
        <Grid container columnSpacing={4}> 
          <Grid item xs={3}>
            <Paper sx={{mb: 2}}>
              <ProductSearch />
            </Paper>
            <Paper sx={{mb: 2, p: 2}}>
              <RadioButtonGroup 
                selectedValue={productParams.orderBy}
                options={sortOptions}
                onChange={(e) => dispatch(setProductParams({orderBy: e.target.value}))}
               />
            </Paper>
            <Paper>
              <CheckBoxButtons items={brands} checked={productParams.brands || []} onChange={(items: string[]) => dispatch(setProductParams({brands: items}))} />
            </Paper>
            <Paper>
              <CheckBoxButtons items={types} checked={productParams.types || []} onChange={(items: string[]) => dispatch(setProductParams({types: items}))} />
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <ProductList products={products} />
          </Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={9} sx={{mb: 2}}>
            {metaData &&
              <AppPAgination metaData={metaData} onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))} />
            }
          </Grid>
        </Grid>
    )
}