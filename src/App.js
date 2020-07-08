import React from 'react';
import logo from './logo.svg';
import './App.css';

import firebase,{FirebaseContext} from './firebase';

import Home from './paginas/home';
function App() {
  return (
    <div className="App">
      <FirebaseContext.Provider
        value={{
          firebase
        }}
      >
        <Home />
      </FirebaseContext.Provider>
              
    </div>
  );
}

export default App;
