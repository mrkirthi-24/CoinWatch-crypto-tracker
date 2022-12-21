import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import { TrendingCoins } from '../../config/api';
import AliceCarousel from 'react-alice-carousel';
import { Link } from 'react-router-dom';
import { CryptoState } from '../../CryptoContext';

const useStyles = makeStyles((theme) => ({
    carousel: {
        height: '50%',
        alignItems: 'center',
        display: 'flex',
    },
    carouselItem: {
      display: 'flex',
      textTransform: 'uppercase',
      color: 'white',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer'
    }
}));

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Carousel = () => {
    const [trending, setTrending] = useState([]);
    const classes = useStyles();
    const { currency, symbol } = CryptoState();

    const fetchTrendingCoins =async () => {
        const { data } = await axios.get(TrendingCoins(currency));
        setTrending(data);
    };

    useEffect(() => {
      fetchTrendingCoins();

      //eslint-disable-next-line
}, [currency]);

    const items = trending.map((token) => {
      let change = token.price_change_percentage_24h >= 0;
      return(
        <Link 
          className={classes.carouselItem}
          to={`/tokens/${token.id}`}
        >
          <img 
            src={token?.image}
            alt={token.name}
            height='80'
            style={{ marginBottom:10 }}
          />
          <span>
            {token.symbol}
            &nbsp; &nbsp;
            <span style={{color: change > 0 ? "green" : "red"}}>
              {change && '+'}{token?.price_change_percentage_24h?.toFixed(2)}%
            </span>
          </span>
          <span style={{fontSize: 22, fontWeight: 500}}>
            {symbol}{numberWithCommas(token?.current_price.toFixed(2))} 
          </span>
        </Link>
      );
    });

    const responsive = {
      0: {
        items: 2,
      },
      512: {
        items: 4,
      }
    };

  return (    
    <div className={classes.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive = {responsive}
        autoPlay
        items = {items}
      />
    </div>
  )
}

export default Carousel