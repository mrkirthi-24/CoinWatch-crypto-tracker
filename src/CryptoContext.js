import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { CoinList } from "./config/api";

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");

  useEffect(() => {
    if (currency === "INR") setSymbol("₹");
    else if (currency === "USD") setSymbol("$");
  }, [currency]);

  const fetchTokens = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));

    setTokens(data);
    setLoading(false);
  };

  return (
    <Crypto.Provider
      value={{ currency, symbol, setCurrency, tokens, loading, fetchTokens }}
    >
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
