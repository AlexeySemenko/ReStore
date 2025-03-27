import { Container, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function ServerError(){
    const {state} = useLocation();

    return (
        <Container component={Paper}>
            
            {state.error ? (
                <>
                    <Typography gutterBottom variant="h5" color='black'>
                        {state.error.title}
                    </Typography>
                    <Divider />
                    <Typography gutterBottom variant="h6" color='grey'>
                        {state.error.stack}
                    </Typography>
                    <Divider />
                    <Typography variant="body1">{state.error.code || 'Internal server error'}</Typography>
                </>
            ) : (
                <Typography gutterBottom variant="h5">Server error</Typography>
            )}
        </Container>
    )
}