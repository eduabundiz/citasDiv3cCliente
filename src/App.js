import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import firebase,{FirebaseContext} from './firebase';


import Home from './paginas/Login';
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
