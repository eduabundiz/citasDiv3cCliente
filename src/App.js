import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import firebase,{FirebaseContext} from './firebase';

import Home from './paginas/home';
import Login from './paginas/Login';
import Register from './paginas/Register';

function App() {
  return (
    <div className="App">
      <FirebaseContext.Provider
        value={{
          firebase
        }}
      > 
        <Router>
            <Switch>
              <Route exact path="/">
                <Login />
              </Route>
              <Route path="/agenda">
                <Home />
              </Route>
              <Route path="/registro">
                <Register />
              </Route>
            </Switch>
        </Router>
        
      </FirebaseContext.Provider>
              
    </div>
  );
}

export default App;
