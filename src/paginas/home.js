import React, {useState,useContext,useEffect} from 'react';
import { FirebaseContext } from '../firebase';
import '../css/global.css';

import Cita from '../ui/Cita';

const Home = () => {


    //context con las operaciones de Firebase
    const [citas,guardarCitas] = useState([])
    const { firebase } = useContext(FirebaseContext)
    
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
            
            <h1>Pagina de citas</h1>
            <div className="contenedor">
                {citas.map( cite => (
                    <Cita 
                        key={cite.id}
                        cita={cite}
                    />
                ))}

                
            </div>
            <button
                onClick={()=>firebase.db.collection('cita').add(cita)}
            >
                Agregar cita
            </button>
        </>
     );
}
 
export default Home;