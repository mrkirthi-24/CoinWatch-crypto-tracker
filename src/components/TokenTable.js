import { Container, createTheme, LinearProgress, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { CoinList } from '../config/api';
import { CryptoState } from '../CryptoContext';
import { numberWithCommas } from './Banner/Carousel';
import { Pagination } from '@material-ui/lab';

const TokenTable = () => {
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const history = useHistory();

    const { currency, symbol } = CryptoState();

    const fetchTokens = async () => {
        setLoading(true);
        const { data } = await axios.get(CoinList(currency));

        setTokens(data);
        setLoading(false);
    };

    console.log(tokens);

    useEffect(() => {
        fetchTokens();
      }, [currency]);

      const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff",
            },
            type: "dark",
        },
      });
    
    const handleSearch = () => {
        return tokens.filter((token) => (
            token.name.toLowerCase().includes(search) ||
            token.symbol.toLowerCase().includes(search)
        ))
    };

    const useStyles = makeStyles(() => ({
        row: {
            backgroundColor: "#16171a",
            cursor: "pointer",
            fontFamily: "Montserrat",
            "&:hover": {
                backgroundColor: "#000",
            },
        },
        pagination: {
            "& .MuiPaginationItem-root": {
                color: "gold",
            }
        }
    }));

    const classes = useStyles(); 

  return <ThemeProvider theme={darkTheme} >
    <Container style={{textAlign: "center"}}>
        <Typography 
            variant='h4'
            style={{fontFamily: "Montserrat", margin: 18}}>
                Cryptocurrency Prices by Market Cap
        </Typography>
        <TextField 
            label="Search for Cryptocurrency.." 
            variant="outlined" 
            style={{marginBottom:20, width: "100%"}}
            onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer>
            {
                loading ? (
                    <LinearProgress style={{backgroundColor: "gold"}} />
                ) : (
                    <Table>
                        <TableHead style={{backgroundColor: "#EEBC1D"}}>
                            <TableRow>
                                {["Token", "Price", "24h Change", "Market Cap"].map((head) => (
                                    <TableCell
                                        style={{
                                            color: "black",
                                            fontWeight: "700",
                                            textTransform: "uppercase",
                                        }}
                                        key={head}
                                        align={head === "Token" ? "" : "right"}>
                                            {head}
                                        </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {handleSearch()
                                .slice((page-1)*10, (page-1)*10+10)
                                .map(row => {
                                const change = row.price_change_percentage_24h > 0;

                                return (
                                    <TableRow 
                                        onClick={() => history.push(`tokens/${row.id}`)}
                                        className={classes.row}
                                        key={row.name}>
                                        <TableCell component="th" scope='row' style={{
                                            display: 'flex',
                                            gap: 15,
                                        }}>
                                            <img 
                                                src={row.image}
                                                alt={row.name}
                                                height="50"
                                                style={{marginBottom: 10}} 
                                            />
                                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                                <span style={{fontSize: 22, textTransform: 'uppercase'}}>
                                                    {row.symbol}
                                                </span>
                                                <span style={{color: "darkgray"}}>{row.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell align="right">
                                            {symbol}{" "}{numberWithCommas(row.current_price.toFixed(2))}
                                        </TableCell>
                                        <TableCell align="right" style={{color: change > 0 ? "green" : "red", fontWeight: 500,}}>
                                            {change && '+'}{row?.price_change_percentage_24h?.toFixed(2)}%
                                        </TableCell>
                                        <TableCell align='right'>{symbol}{" "}{numberWithCommas(row.market_cap.toString().slice(0, -6))}M</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                )
            }
        </TableContainer>
        <Pagination 
            style={{
                padding: 20,
                width: "100%",
                display: "flex",
                justifyContent: "center",
            }}
            classes={{ul: classes.pagination}}
            count={(handleSearch()?.length/10).toFixed(0)} 
            onChange={(_ , value) => {
                setPage(value);
                window.scroll(0, 450);
            }}     
        />
    </Container>
  </ThemeProvider>;
}

export default TokenTable