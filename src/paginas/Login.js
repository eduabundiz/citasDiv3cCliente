import React, { useState, useContext, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import {FirebaseContext} from '../firebase';
import { auth } from 'firebase';
import {Link, Redirect} from 'react-router-dom';

import Home from './home';

const Login = (props) => {

    const { register, handleSubmit } = useForm();
    const { firebase } = useContext(FirebaseContext)
    const [agendaVisible,setAgendaVisible] = useState(false)
    const [user,setUser] = useState({})

    const onSubmit = (data) => {
        const {email, nip}  = data
        firebase.auth.signInWithEmailAndPassword(email,nip)
        firebase.auth.currentUser.getIdToken()
        .then((idToken)=>{
            console.log(idToken)

        })
        var usuario = firebase.auth.currentUser;
        console.log(usuario)
        if(usuario.displayName){
            
            setUser(usuario)
            setAgendaVisible(true)
        }
        else {
            setAgendaVisible(false)
        }
    }

    const [email,setEmail] = useState('')
    const [nip,setNip] = useState('')

    useEffect(()=>{
        var miUser = firebase.auth.currentUser;
        // console.log(miUser)
    },[])


    return ( 
        <>
            { agendaVisible 
            ? (
                <div>                    
                    <p>{user.displayName}</p>
                    <Home 
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
                                />
                                <br/>
                                <label className="label">Contraseña</label> <br/>
                                <input
                                    ref={register}                                                              
                                    type="password"
                                    className="input"
                                    name="nip"
                                    placeholder="********"                                                                        
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
 
export default Login;