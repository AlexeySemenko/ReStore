import { Box, Grid, Typography } from '@mui/material';
import BasketSummary from '../basket/BasketSummary';
import BasketTable from '../basket/BasketTable';
import { useAppSelector } from '../../app/store/configureStore';

export default function Review() {
  const {basket} = useAppSelector(state => state.basket);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      {basket && 
      <BasketTable items={basket.items} isBasket={false} />
      }
      <Grid container>
        <Grid item md={6} xs={12} />
        <Grid item md={6} xs={12} >
          <Box sx={{mt:{md:2, xs:1}}}>
            <BasketSummary />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}