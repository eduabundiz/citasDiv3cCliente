import React, {useState,useContext,useEffect} from 'react';
import { FirebaseContext } from '../firebase';
import '../css/global.css';

import Cita from '../ui/Cita';
import Calendario from '../ui/Calendario';
import Agenda from '../ui/Agenda';


const Home = () => {
    

    //context con las operaciones de Firebase
    const [citas,guardarCitas] = useState([])
    const { firebase } = useContext(FirebaseContext)
    
    //Cuando el componente sea montado obtener las citas de la base de datos
    useEffect(()=>{
        const obtenerCitas = () => {
            firebase.db.collection('cita').onSnapshot(handleSnapshot)
        }
        obtenerCitas()
        
    },[])

      //Snapshot nos permite utilizar la base de datos en tiempo real de firestore
      function handleSnapshot(snapshot){
        const cites = snapshot.docs.map(doc =>{
            return {
                id: doc.id,
                ...doc.data()
            }
        });
        
        //Almacenar los resultados en el state
        guardarCitas(cites)        
    }

    const cita = {
        nombre: "CARLOS EDUARDO ABUNDIZ OLMEDO",
        codigo:"214610731",
        centro:"CUCEI",
        carrera:"COM",
        dia:"08-10-2020",
        hora:"1500",
        asunto:"Titulación",        

    }



    return ( 
        <>          
            <Agenda />
            <h1>Pagina de citas</h1>                                                
                {/* <Calendario                     
                    cites = {citas}
                />                        
             */}
            
            <div className="contenedor">                
                {citas.map( cite => (
                    <Cita 
                        key={cite.id}
                        cita={cite}
                    />
                ))}

                
            </div>            
        </>
     );
}
 
export default Home;