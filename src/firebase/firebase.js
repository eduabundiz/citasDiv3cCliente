import app from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import firebaseConfig from './config';

//Clase Firebase para manipular lo que necesitemos 
class Firebase  {
    constructor(){
        if(!app.apps.length){
        app.initializeApp(firebaseConfig)
        }
        
        //Base de datos en tiempo real
        this.db = app.firestore()
        this.auth = app.auth()
    }
    
    crearCuentaEmailPass(email, password, nombres) {
        app.auth()
          .createUserWithEmailAndPassword(email, password)
          .then(result => {
            result.user.updateProfile({
              displayName: nombres
            })
    
            const configuracion = {
              url: 'https://www.facebook.com/'
            }
    
            result.user.sendEmailVerification(configuracion).catch(error => {
              console.error(error)
              console.log(error.message, 4000)
            })
    
            app.auth().signOut()
    
            console.log(
              `Bienvenido ${nombres}, debes realizar el proceso de verificación`,
              4000
            )
              
          })
          .catch(error => {
            console.error(error)
            console.log(error.message, 4000)
          })
      }
}

const firebase = new Firebase();
export default firebase;