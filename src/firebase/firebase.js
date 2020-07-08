import app from 'firebase/app';
import 'firebase/firestore';

import firebaseConfig from './config';

//Clase Firebase para manipular lo que necesitemos 
class Firebase  {
    constructor(){
        if(!app.apps.length){
        app.initializeApp(firebaseConfig)
        }
        
        //Base de datos en tiempo real
        this.db = app.firestore()
    }
}

const firebase = new Firebase();
export default firebase;