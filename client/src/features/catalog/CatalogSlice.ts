import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/products";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";


interface CatalogState{
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams;
}

const productsAdapter = createEntityAdapter<Product>();

function getAxiosParams(producParams: ProductParams){
    const params = new URLSearchParams();
    params.append('pageNumber', producParams.pageNumber.toString());
    params.append('pageSize', producParams.pageSize.toString());
    params.append('orderBy', producParams.orderBy);

    if(producParams.searchTerm){
        params.append('searchTerm', producParams.searchTerm);
    }
    if(producParams.brands){
        params.append('searchTerm', producParams.brands.toString());
    }
    if(producParams.types){
        params.append('searchTerm', producParams.types.toString());
    }

    return params;
}


export const fetchProductsAsync = createAsyncThunk<Product[], void, { state: RootState }>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) =>{
        const params = getAxiosParams(thunkAPI.getState().catalog.productParams);
        try {
            return await agent.Catalog.list(params);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const fetchProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductAsync',
    async (productId, thunkAPI) =>{
        try {
            return await agent.Catalog.details(productId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const fetchFilters = createAsyncThunk(
    'catalog/fetchFilters',
    async (_, thunkAPI) =>{
        try {
            return await agent.Catalog.fetchFilters();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

function initParams(){
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: 'name'
    }
}

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState<CatalogState>({
        productsLoaded: false,
        filtersLoaded: false,
        status: 'idle',
        brands: [],
        types: [],
        productParams: initParams()
    }),
    reducers: {
        setProductParams: (state, action) =>{
            state.productsLoaded = false;
            state.productParams = { ...state.productParams, ...action.payload };
        },
        resetProductParams: (state, action) => {
            state.productParams = initParams();
        }
    },
    extraReducers: (builder => {
        //fetchProducts (list)
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pendingFetchProducts';
        });

        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.productsLoaded = true;
        });

        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });

        //fetchProduct (Single)
        builder.addCase(fetchProductAsync.pending, (state) => {
            state.status = 'pendingFetchProduct';
        });

        builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
        });

        builder.addCase(fetchProductAsync.rejected, (state, action) => {
            console.log(action);
            state.status = 'idle';
        });

         //fetchFilters (Single)
         builder.addCase(fetchFilters.pending, (state) => {
            state.status = 'pendingFetchFilters';
        });

        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.filtersLoaded = true;
            state.status = 'idle';
        });

        builder.addCase(fetchFilters.rejected, (state, action) => {
            console.log(action);
            state.status = 'idle';
        });
    })
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);

export const {setProductParams, resetProductParams} = catalogSlice.actions;