import { Typography, Grid, Paper, Box, Button, IconButton } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import { Product } from "../../app/models/products";
import { useEffect } from "react";
import useProducts from "../../app/hooks/useProducts";
import AppSelectList from "../../app/components/AppSelectList";
import AppDropzone from "../../app/components/AppDropzone";
import { validationSchema } from "./productValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import agent from "../../app/api/agent";
import { useAppDispatch } from "../../app/store/configureStore";
import { setProduct } from "../catalog/CatalogSlice";
import { LoadingButton } from "@mui/lab";
import { ArrowBack as ArrowBackIcon, Send as SendIcon } from '@mui/icons-material';

interface Props {
    product?: Product;
    cancelEdit: () => void;
}

export default function ProductForm({ product, cancelEdit }: Props) {
    const { control, reset, handleSubmit, watch, formState: {isDirty, isSubmitting} } = useForm({
        resolver : yupResolver<any>(validationSchema)
    });
    const { brands, types } = useProducts();
    const watchFile = watch('file', null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (product && !watchFile && !isDirty)
            reset(product);
        return () => { //this function gonna be called when the component is destroyed, remove preview from file
            if(watchFile) URL.revokeObjectURL(watchFile.preview); 
        }
    }, [product, reset, watchFile])

    async function handleSubmitData(data: FieldValues) {
        try {
            let response: Product;
            if(product){
                response = await agent.Admin.updateProduct(data);
            }else{
                response = await agent.Admin.createProduct(data);
            }

            dispatch(setProduct(response));
            cancelEdit();

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Box component={Paper} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Product Details
            </Typography>
            <form onSubmit={handleSubmit(handleSubmitData)}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                        <AppTextInput control={control} name='name' label='Product name' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppSelectList control={control} items={brands} name='brand' label='Brand' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppSelectList control={control} items={types} name='type' label='Type' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput control={control} type='number' name='price' label='Price' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput control={control} type='number' name='quantityInStock' label='Quantity in Stock' />
                    </Grid>
                    <Grid item xs={12}>
                        <AppTextInput control={control} multiline={true} rows={4} name='description' label='Description' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppDropzone control={control} name='file' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box alignSelf='center' sx={{margin:{sm:'0px auto', xs:'40px auto'}, textAlign: 'center'}}>
                            {watchFile ? (
                                    <img src={watchFile.preview} alt='preview' style={{maxHeight:200, maxWidth:'100%' }} />
                                ) : (
                                    <img src={product?.pictureUrl} alt={product?.name} style={{maxHeight:200, maxWidth:'100%'}} />
                                )
                            }
                        </Box>
                    </Grid>
                </Grid>
                <Box display='flex' justifyContent='space-between' sx={{ mt: 3 }}>
                        <IconButton title="Cancel"
                            onClick={cancelEdit}
                            sx={{
                                backgroundColor: "lightblue",
                                color: "black",
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                                "&:hover": { backgroundColor: "skyblue" }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <IconButton title="Add new item" type="submit"
                            sx={{
                                backgroundColor: "lightblue",
                                color: "black",
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                                "&:hover": { backgroundColor: "skyblue" }
                            }}
                        >
                            <SendIcon />
                        </IconButton>
                </Box>
            </form>
        </Box>
    )
}