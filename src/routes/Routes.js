import React from "react";
import { Router, Scene, Stack } from "react-native-router-flux";
import Home from "../components/Home";
import NewCar from '../components/NewCar';

const Routes = () => (
  <Router>
    <Stack key="root">
      <Scene key="home" component={Home} hideNavBar={true} initial={true} />
      <Scene key="newCar" component={NewCar} hideNavBar={true}  />
    </Stack>
  </Router>
);
export default Routes;
