import React, {useState, useContext} from 'react';
import { useForm } from 'react-hook-form';

import crearCuentaEmailPass from '../utils/firebaseAuth';
import { FirebaseContext } from '../firebase';


const Register = (props) => {

    const {firebase} = useContext(FirebaseContext);

    const { register, handleSubmit } = useForm();
    
    const [carrera,setCarrera] = useState('')

    const onSubmit = (data) => {
        const {email, nip}  = data
       
       firebase.crearCuentaEmailPass(email,nip,carrera)
       console.log(carrera,email,nip)
    }    

    const onChangeDegree = (event) =>{
        setCarrera(event.target.value)        
    }
   
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
                                <select value={carrera} onChange={onChangeDegree} className="input">
                                    <option value="INCO">INCO - Ingeniería en Computación</option>
                                    <option value="INFO">INFO - Ingeniería en Informática</option>
                                    <option value="INCEL">INCEL - Ingeniería en Comunicaciones y Electrónica</option>
                                    <option value="INBI">INBI - Ingeniería en Biomédica</option>
                                    <option value="INRO">INRO - Ingeniería en Robótica</option>
                                </select>
                                {/* <input 
                                    ref={register}
                                    className="input"
                                    id="carrera"
                                    placeholder="INCO"
                                    name="carrera"
                                />  */}
                                <br />
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