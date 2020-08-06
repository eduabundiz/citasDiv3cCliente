import React, {useState, useContext} from 'react';
import { useForm } from 'react-hook-form';

import crearCuentaEmailPass from '../utils/firebaseAuth';
import { FirebaseContext } from '../firebase';


const Register = (props) => {

    const {firebase} = useContext(FirebaseContext);

    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        const {carrera,email, nip}  = data
       console.log(carrera,email,nip)
       firebase.crearCuentaEmailPass(email,nip,carrera  )
    }

    const [email,setEmail] = useState('')
    const [nip,setNip] = useState('')

 
   
    return ( 
        <>
            <div >
                <div className="containerImage">
                    <div className="imageBackground">
                        <div className="baseLogin">
                            <img src={require("../img/DivecLogo.png")} className="logoDivec"/>                            
                            
                            <form className="form" 
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <label className="label">Carrera</label>  <br/>
                                <input 
                                    ref={register}
                                    className="input"
                                    id="carrera"
                                    placeholder="INCO"
                                    name="carrera"
                                /> <br />
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
        </>
     );
}
 
export default Register;