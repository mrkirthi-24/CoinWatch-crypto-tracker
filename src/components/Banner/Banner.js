import { Container, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import Carousel from './Carousel';

const useStyles = makeStyles(() => ({
    banner: {
        backgroundImage: "url(./banner2.jpg)",
    },
    bannerContent: {
        height: 400,
        display: "flex",
        flexDirection: "column",
        paddingTop: 25,
        justifyContent: "space-around",
    },
    tagline: {
        height: "40%",
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
        flexDirection: "column",
    }
}));

const Banner = () => {
    const classes = useStyles();
  return (
    <div className={classes.banner}>
        <Container className={classes.bannerContent}>
            <div className={classes.tagline}>
                <Typography 
                    variant='h2'
                    style={{
                        fontWeight: 'bold',
                        marginBottom: 15,
                        fontFamily: 'Montserrat',
                    }}>Ultimate Crypto Screener
                </Typography>
                <Typography
                    variant='subtitle2'
                    style={{
                        color: "darkgrey",
                        fontFamily: 'Montserrat',
                        textTransform: "capitalize",
                    }}>
                        Track your favorite tokens and stay upto date with the Web3 ecosystem.
                    </Typography>
            </div>
            <Carousel />
        </Container>
    </div>
  )
}

export default Banner