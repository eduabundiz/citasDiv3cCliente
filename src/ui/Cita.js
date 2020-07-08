import React,{useContext} from 'react';
import './cita.css';

const Cita = ({cita}) => {

    // context de firebase para cambios en la BD    

    const {nombre,codigo,date,time,centro,carrera,subject} = cita
    const dia = new Date(date*1000).toLocaleDateString("es-ES")
    return ( 
        <>
            <div className="contenedor-cita">
    <p className="date">
        Fecha: {dia}
    </p>               
                <p>Hora: {time} </p>
                <p>Nombre: {nombre}</p>
                <p>Código: {codigo}</p>
                <p>centro: {centro}</p>
                <p>carrera: {carrera}</p>
                <p>Asunto: {subject}</p>
            </div>
        </>
     );
}
 
export default Cita;
