import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import { SingleCoin } from "../config/api";
import axios from "axios";
import TokenChart from "../components/TokenChart";
import {
  makeStyles,
  Typography,
  LinearProgress,
  Button,
} from "@material-ui/core";
import ReactHtmlParser from "react-html-parser";
import { numberWithCommas } from "../components/Banner/Carousel";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const TokenPage = () => {
  const { id } = useParams();
  const [token, setToken] = useState();
  const { currency, symbol, user, watchlist, setAlert } = CryptoState();

  const fetchToken = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setToken(data);
  };

  const inWatchlist = watchlist.includes(token?.id);

  const addToWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { tokens: watchlist ? [...watchlist, token?.id] : [token?.id] },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${token.name} Added to the Watchlist!`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const removeFromWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { tokens: watchlist.filter((wish) => wish !== token?.id) },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${token.name} Removed from the Watchlist!`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    sidebar: {
      width: "30%",
      [theme.breakpoints.down("md")]: {
        width: "100%",
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 25,
      borderRight: "2px solid grey",
    },
    heading: {
      fontWeight: "bold",
      marginBottom: 20,
      fontFamily: "Montserrat",
    },
    description: {
      width: "100%",
      fontFamily: "Montserrat",
      padding: 25,
      paddingBottom: 15,
      paddingTop: 0,
      textAlign: "justify",
    },
    marketData: {
      alignSelf: "start",
      padding: 25,
      paddingTop: 10,
      width: "100%",
      [theme.breakpoints.down("md")]: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      [theme.breakpoints.down("xs")]: {
        alignItems: "start",
      },
    },
  }));

  const classes = useStyles();

  if (!token) return <LinearProgress style={{ backgroundColor: "gold" }} />;

  return (
    <div className={classes.container}>
      {/* sidebar */}
      <div className={classes.sidebar}>
        <img
          src={token?.image.large}
          alt={token?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Typography variant="h3" className={classes.heading}>
          {token?.name}
        </Typography>
        <Typography variant="subtitle1" className={classes.description}>
          {ReactHtmlParser(token?.description.en.split(". ")[0])}.
        </Typography>
        <div className={classes.marketData}>
          <span style={{ display: "flex", marginBottom: 20 }}>
            <Typography
              variant="h4"
              style={{ fontFamily: "Montserrat" }}
              className={classes.heading}
            >
              Rank:
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="h5" className={classes.heading}>
              {token?.market_cap_rank}
            </Typography>
          </span>
          <span style={{ display: "flex", marginBottom: 20 }}>
            <Typography
              variant="h4"
              style={{ fontFamily: "Montserrat" }}
              className={classes.heading}
            >
              Current price:
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="h5" className={classes.heading}>
              {symbol}{" "}
              {numberWithCommas(
                token?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>
          <span style={{ display: "flex", marginBottom: 20 }}>
            <Typography
              variant="h4"
              style={{ fontFamily: "Montserrat" }}
              className={classes.heading}
            >
              Market Cap:
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="h5" className={classes.heading}>
              {symbol}{" "}
              {numberWithCommas(
                token?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
              M
            </Typography>
          </span>
          {user && (
            <Button
              variant="outlined"
              style={{
                width: "100%",
                height: 40,
                backgroundColor: inWatchlist ? "#ff0000" : "#EEBC1D",
              }}
              onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
            >
              {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>
          )}
        </div>
      </div>
      {/* TokenChart */}
      <TokenChart token={token} />
    </div>
  );
};

export default TokenPage;
