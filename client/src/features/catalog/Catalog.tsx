import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Pagination, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import LoadingComponent from "../../app/layouts/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchFilters, fetchProductsAsync, productSelectors } from "./CatalogSlice";
import ProductList from "./ProductList";
import { useEffect } from "react";

const sortOptions = [
  { value: 'name', label: 'Alphabetical'},
  { value: 'priceDesc', label: 'Price - High to Low'},
  { value: 'price', label: 'Price - Low to High'},
];

export default function Catalog(){

    const products = useAppSelector(productSelectors.selectAll);
    const dispatch = useAppDispatch();
    const {productsLoaded, filtersLoaded, status, brands, types} = useAppSelector(state => state.catalog);

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

   
    if(status.includes('pending'))
      return <LoadingComponent message="Loading catalog..."/>
  
      //Grid spacing like in bootstrap - 12 parts, 3 + 9 here... (2 columns 3 and 9)
    return (
        <Grid container spacing={4}> 
          <Grid item xs={3}>
            <Paper sx={{mb: 2}}>
              <TextField
                label='Search products'
                variant='outlined'
                fullWidth
              />
            </Paper>
            <Paper sx={{mb: 2, p: 2}}>
              <FormControl>
                <RadioGroup>
                  {sortOptions.map(({value, label}) =>
                     <FormControlLabel value={value} label={label} key={value} control={<Radio />} />
                  )}
                </RadioGroup>
              </FormControl>
            </Paper>
            <Paper>
              <FormGroup sx={{mb: 2, p: 2}}>
                {brands.map(brand => (
                  <FormControlLabel control={<Checkbox />} label={brand} key={brand} />
                ))}
              </FormGroup>
            </Paper>
            <Paper>
              <FormGroup sx={{mb: 2, p: 2}}>
                {types.map(type => (
                  <FormControlLabel control={<Checkbox />} label={type} key={type} />
                ))}
              </FormGroup>
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <ProductList products={products} />
          </Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={9}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <Typography>
                Displaying 1-6 of 20 items
              </Typography>
              <Pagination 
                color='secondary'
                size='large'
                count={10}
                page={2}
              />
            </Box>
          </Grid>
        </Grid>
    )
}