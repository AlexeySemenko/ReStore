import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Slider from "react-slick";

export default function HomePage(){
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch(axios.defaults.baseURL + 'images')
            .then(response => response.json())
            .then(data => {
                setImages(data.images.map((img: any) => `/images/Slider/${img}`));
            })
            .catch(error => console.error('Error loading images:', error));
    }, []);
    
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      };

    return (
        <>
         <Slider {...settings}>
            {images.map((src, index) => (
                <div key={index}>
                    <Box 
                        component="img"
                        src={src} 
                        alt={`hero-${index}`}
                        sx={{ 
                            display: 'block', 
                            maxHeight: 400, 
                            objectFit: 'cover', 
                            mx: 'auto' // Centers the image horizontally
                        }}  />
                </div>
            ))}
        </Slider>
            <Box display='flex' justifyContent='center' sx={{p : { md: 4, xs: 1}, mt:10}}>
                <Typography variant="h1" sx={{ fontSize:{md:30, xs:20}, fontWeight:'bold'}} >
                    My store - react redux dotnet demo
                </Typography>
            </Box>
            <Box sx={{ textAlign: "center", py: 2, bgcolor: "background.default", mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                    © 2025 alexey-prod
                </Typography>
            </Box>
        </>
    )
}
