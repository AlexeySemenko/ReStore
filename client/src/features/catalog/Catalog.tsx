import { Grid, Paper } from "@mui/material";
import LoadingComponent from "../../app/layouts/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setPageNumber, setProductParams } from "./CatalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckBoxButtons from "../../app/components/CheckBoxButtons";
import AppPAgination from "../../app/components/AppPagination";
import useProducts from "../../app/hooks/useProducts";

const sortOptions = [
  { value: 'name', label: 'Alphabetical'},
  { value: 'priceDesc', label: 'Price - High to Low'},
  { value: 'price', label: 'Price - Low to High'},
];

export default function Catalog(){

    const {products, brands, types, filtersLoaded, metaData, error } = useProducts();
    const dispatch = useAppDispatch();
    const {productParams} = useAppSelector(state => state.catalog);

    if(!filtersLoaded)
      return <LoadingComponent message="Loading products..." error={error}/>
  
      //Grid spacing like in bootstrap - 12 parts, 3 + 9 here... (2 columns 3 and 9)
    return (
        <Grid container columnSpacing={4} columns={{ xs: 4, md: 12 }}> 
          <Grid item md={3} xs={4}>
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
          <Grid item md={9} xs={4}>
            <ProductList products={products} />
          </Grid>
          <Grid item md={3} xs={0}></Grid>
          <Grid item md={9} xs={4} sx={{mb: 2, mt: 1}}>
            {metaData &&
              <AppPAgination metaData={metaData} onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))} />
            }
          </Grid>
        </Grid>
    )
}