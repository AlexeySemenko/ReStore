import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

interface Props{
    message?: string,
    error?: string
}

export default function LoadingComponent({message = 'Loading...', error}:Props){
    return (
        <Backdrop open={true} invisible={true}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh" flexDirection="column">
          {/* Show circular progress while loading */}
          {!error ? (
            <>
              <CircularProgress size={100} color="secondary" />
              <Typography variant="h4" sx={{ justifyContent: 'center', position: 'fixed', top: '60%' }}>
                {message}
              </Typography>
            </>
          ) : (
            // Show error message if there is an error
            <Typography variant="h5" color="error">
              {error}
            </Typography>
          )}
        </Box>
      </Backdrop>
    )
}