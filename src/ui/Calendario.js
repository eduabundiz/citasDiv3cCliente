import React,{ useState, useEffect, useContext} from 'react';

import { FirebaseContext } from '../firebase';
import { ReactAgenda , ReactAgendaCtrl , guid ,  Modal } from 'react-agenda';
import '../css/global.css';
import './calendario.css';
require('moment/locale/es.js'); // this is important for traduction purpose


var colors= {
    'color-1':"rgba(102, 195, 131 , 1)" ,
    "color-2":"rgba(242, 177, 52, 1)" ,
    "color-3":"rgba(235, 85, 59, 1)"
  }
   
  var now = new Date();

   
   const Agenda = (props) =>  {
   
    var events = [
      {
       _id            :guid(),
        name          : 'Meeting , dev staff!',
        startDateTime : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
        endDateTime   : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0),
        classes       : 'color-1'
      },
      {
       _id            :guid(),
        name          : 'Working lunch , Holly',
        startDateTime : new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 11, 0),
        endDateTime   : new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 13, 0),
        classes       : 'color-2 color-3'
      },    
     
    ];
    const obtenerItems = (citas) => {
      var listaCitas = [];
      citas.map( cite => {
        const {nombre,id,codigo,date,time,centro,carrera,subject} = cite
        if(!date) return
        const dia = new Date(date * 1000);
        const nuevoEvento = {
          _id : id,
          name : nombre,
          startDateTime : new Date(2020,dia.getMonth(),dia.getDate()+1, time.substr(0,2)),
          endDateTime : new Date(2020,dia.getMonth(),dia.getDate()+1, parseInt(time.substr(0,2))+1),
          classes:'color-2'
        }
        listaCitas.push(nuevoEvento)
        
      })
      return listaCitas
    }

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

       useEffect(()=>{
         const values =  obtenerItems(citas)
      
        setItems(values)
        console.log(values)
       },[citas])
   
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
         
    const [ items, setItems ] = useState([]);
    const [ selected, setSelected ] = useState([]);
    const [ cellHeight, setCellHeight ] = useState(30);
    const [ showModal, setShowModal ] = useState(true);
    const [ locale, setLocale ] = useState('es');
    const [ rowsPerHour,setRowsPerHour ] = useState(2);
    const [ numberOfDays,setNumberOfDays ] = useState(4);
    const [ startDate,setStartDate ] = useState( new Date());                    

    const [ x, setX ] = useState(0);
    const [ y, setY ] = useState(0);
      
      // console.log("props --->")
      // console.log(props)
      // console.log("props.citas --->")
      // console.log(props.citas)
      
   
  const handleCellSelection = (item) =>{
    console.log('handleCellSelection',item)
  }
  const handleItemEdit = (item) => {
    console.log('handleItemEdit', item)
  }
  const handleRangeSelection = (item) => {
    console.log('handleRangeSelection', item)
  }    
   
  
      return (
        <div >
          <ReactAgenda            
            minDate={now}
            maxDate={new Date(now.getFullYear(), now.getMonth())}
            disablePrevButton={false}
            startDate={startDate}
            cellHeight={cellHeight}
            locale={locale}
            items={items}
            numberOfDays={numberOfDays}
            rowsPerHour={rowsPerHour}
            itemColors={colors}
            autoScale={false}
            fixedHeader={true}
            onItemEdit={ item =>handleItemEdit(item)}
            onCellSelect={ item => handleCellSelection(item)}
            onRangeSelection={ item => handleRangeSelection(item)}/>
        </div>
      );
    
  }


  export default Agenda;