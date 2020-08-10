//Este componente es login y al acceder muestra el componente Agenda

import React, { useState, useContext} from 'react';
import { useForm } from 'react-hook-form';
import {FirebaseContext} from '../firebase';


import '../css/global.css';
import Agenda from '../ui/Agenda';

const Login = (props) => {

    const { register, handleSubmit } = useForm();   //Hook para formulario
    const { firebase } = useContext(FirebaseContext) // Usar el contexto de firebase
    const [agendaVisible,setAgendaVisible] = useState(false)    //Saber si generar login o la agenda
    const [user,setUser] = useState({})
    const [error,setError] = useState(false)

    const onSubmit = (data) => {
        const {email, nip}  = data  
        firebase.auth.signInWithEmailAndPassword(email,nip) //Hacer login con el correo y contraseña
        
        firebase.auth.currentUser.getIdToken()
        .then((idToken)=>{
            console.log(idToken)

        })
        
        var usuario = firebase.auth.currentUser;
        console.log(usuario)        
        if(usuario){ // Si existe esa cuenta guardar info de usuario y hacer visible la agenda            
            setUser(usuario)
            setAgendaVisible(true)
            setError(false)
        }
        else {
            setAgendaVisible(false)
            setError(true)
        }
    }
    

    return ( 
        <>
            { agendaVisible 
            ? (
                <div>                    
                    <p>{user.displayName}</p>
                    <Agenda      
                        carrera={user}
                    />
                </div>
            ) 
            : (
                <div >
                <div className="containerImage">
                    <div className="imageBackground">
                        <div className="baseLogin">
                            <img src={require("../img/DivecLogo.png")} className="logoDivec"/>                            
                            
                            { error && <MostrarEror />}

                            <form className="form" 
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <label className="label">Cuenta</label>  <br/>
                                <input
                                    ref={register}
                                    className="input"
                                    id="account"
                                    placeholder="example@correo.com"                                    
                                    name="email"               
                                    onClick = {()=>setError(false)}                     
                                />
                                <br/>
                                <label className="label">Contraseña</label> <br/>
                                <input
                                    ref={register}                                                              
                                    type="password"
                                    className="input"
                                    name="nip"
                                    placeholder="********"                                                                        
                                    onClick = {()=>setError(false)}
                                />
                                <input
                                    type="submit"
                                    className="btnSubmit"
                                    value="Entrar"
                                />
                            </form>
                        </div>
                        
                    </div>
                    
                </div>
                <div className="logoUdg">
                </div>                
                
            </div>
            ) }
            
        </>
     );
}

const MostrarEror = () => {
    return(
    <>
        <p className="error">No coinciden los datos</p>
    </>
    )
}
    
export default Login;