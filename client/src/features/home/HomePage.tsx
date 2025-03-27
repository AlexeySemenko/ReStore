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
                    <img src={src} alt={`hero-${index}`} style={{ display: 'block', width: '100%', maxHeight: 500 }} />
                </div>
            ))}
        </Slider>
            <Box display='flex' justifyContent='center' sx={{p : { md: 4, xs: 1}, mt:10}}>
                <Typography variant="h1" sx={{ fontSize:{md:30, xs:20}, fontWeight:'bold'}} >
                    My store - react redux dotnet demo
                </Typography>
            </Box>
        </>
    )
}
