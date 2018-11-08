import React from "react";
import Dropfile from "./components/Dropfile";
import Image from "./components/Image";
import Crimes from "./components/Crimes";
import Navigation from "./components/Navigation";
import { BrowserRouter, Route, Switch } from "react-router-dom";

const App: React.SFC = () => {
   return (
      <BrowserRouter >
      <>
      <Navigation />
      <Switch>
        <Route path="/" exac component={Dropfile} />
        <Route path="/task1" component={Image} />
        <Route path="/task2" component={Crimes} />
        </Switch>
        </>
      </BrowserRouter>
   );
};

export default App