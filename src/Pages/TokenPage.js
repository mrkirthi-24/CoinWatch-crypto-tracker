import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CryptoState } from '../CryptoContext';
import { SingleCoin } from '../config/api';
import axios from 'axios';
import TokenChart from '../components/TokenChart';
import { makeStyles, Typography, LinearProgress } from '@material-ui/core';
import ReactHtmlParser from 'react-html-parser';
import { numberWithCommas } from '../components/Banner/Carousel';

const TokenPage = () => {
  const { id } = useParams();
  const [token, setToken] = useState();
  const { currency, symbol } = CryptoState();

  const fetchToken = async() => {
    const { data } = await axios.get(SingleCoin(id));

    setToken(data);
  }
  //to call fetchToken api 
  useEffect(() => {
    fetchToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      [theme.breakpoints.down("md")]: { //if its less than mediumScreen size
        flexDirection: 'column',
        alignItems: 'center',
      },
      },
      sidebar: {
        width: '30%',
        [theme.breakpoints.down("md")]: { //if its less than mediumScreen size
          width: '100%',
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 25,
        borderRight: "2px solid grey",
      },
      heading: {
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
      },
      description: {
        padding: "0px 15px 25px 25px",
        textAlign: "justify",
      },
      marketData: {
        alignSelf: "start",
        padding: 25,
        paddingTop: 10,
        width: "100%",
        [theme.breakpoints.down("md")]: {
          display: "flex",
          justifyContent: "space-around",
        },
        [theme.breakpoints.down("sm")]: {
          flexDirection: "column",
          alignItems: "center",          
        },
        [theme.breakpoints.down("xs")]: {
          alignItems: "start",
        },
      }
  }));

  const classes = useStyles();

  if (!token) return <LinearProgress style={{backgroundColor: "gold"}} />;

  return (
    <div className={classes.container}>
          {/* sidebar */}
          <div className={classes.sidebar}>
            <img 
              src= {token?.image.large}
              alt= {token?.name}
              height= "200"
              style= {{marginBottom: 20}} />
            <Typography variant='h3' className={classes.heading}>
              {token?.name}
            </Typography>
            <Typography variant='subtitle1' className={classes.description}>
              {ReactHtmlParser(token?.description.en.split(". ")[0])}.
            </Typography>
            <div className={classes.marketData}>
              <span style={{display: "flex", marginBottom: 20}}>
                <Typography variant="h4" style={{fontFamily: "Montserrat"}} className={classes.heading}>
                  Rank:
                </Typography>
                &nbsp;&nbsp;
                <Typography variant="h5" className={classes.heading}>
                  {token?.market_cap_rank}
                </Typography>
              </span>
              <span style={{display: "flex", marginBottom: 20}}>
                <Typography variant="h4" style={{fontFamily: "Montserrat"}} className={classes.heading}>
                  Current price:
                </Typography>
                &nbsp;&nbsp;
                <Typography variant="h5" className={classes.heading}>
                  {symbol} {" "} {numberWithCommas(token?.market_data.current_price[currency.toLowerCase()])}
                </Typography>
              </span>
              <span style={{display: "flex", marginBottom: 20}}>
              <Typography variant="h4" style={{fontFamily: "Montserrat"}} className={classes.heading}>
                  Market Cap: 
                </Typography>
                &nbsp;&nbsp;
                <Typography variant="h5" className={classes.heading}>
                  {symbol} {" "} {numberWithCommas(token?.market_data.market_cap[currency.toLowerCase()].toString().slice(0, -6))}M
                </Typography>
              </span>
            </div>
          </div>
          {/* TokenChart */}
          <TokenChart token={token} />
    </div>
  )
}

export default TokenPage