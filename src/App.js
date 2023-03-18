import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import HomePage from "./Pages/HomePage";
import TokenPage from "./Pages/TokenPage";
import { makeStyles } from "@material-ui/core";
import Alert from "./components/Alert";

function App() {
  const useStyles = makeStyles(() => ({
    App: {
      backgroundColor: "#14161a",
      color: "#FFFFFF",
      minHeight: "100vh",
    },
  }));

  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Route path="/" component={HomePage} exact />
        <Route path="/tokens/:id" component={TokenPage} />
      </div>
      <Alert />
    </BrowserRouter>
  );
}

export default App;
