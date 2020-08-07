 // Visit https://github.com/revln9/react-agenda for more information
 import React, { Component } from 'react';
 import moment from 'moment';
 import { ReactAgenda , ReactAgendaCtrl, guid , getUnique , getLast , getFirst , Modal } from 'react-agenda';
 
 import {FirebaseContext} from '../firebase';
 
 var now = new Date(); // Obtener la fecha de hoy
 
 require('moment/locale/es.js');
     var colors= {               //Colores de las citas que se renderizarán
       'color-1':"rgba(102, 195, 131 , 1)" ,
       "color-2":"rgba(242, 177, 52, 1)" ,
       "color-3":"rgba(235, 85, 59, 1)" ,
       "color-4":"rgba(70, 159, 213, 1)",
       "color-5":"rgba(170, 59, 123, 1)"
     }
 
 
 var items = []; //Citas que serán mostradas
 
 export default class Agenda extends Component {
 
    static contextType = FirebaseContext;  //accede a firebase por su contexto
 
 
   constructor(props){
     super(props);
     this.state = {
       items:[],   // cada item es una cita
       selected:[],  // Los items seleccionados
       cellHeight:(60 / 4),  
       showModal:false,  //Modal para editar
       locale:"es",    
       rowsPerHour:3,    // cada 20 minutos
       numberOfDays:4,   //Solo se muestran 4 dias al inicio
       startDate: new Date(),    //Empezando por el primero
       citas:[]
     }
     this.handleRangeSelection = this.handleRangeSelection.bind(this)
     this.handleItemEdit = this.handleItemEdit.bind(this)
     this.zoomIn = this.zoomIn.bind(this)
     this.zoomOut = this.zoomOut.bind(this)
     this._openModal = this._openModal.bind(this)
     this._closeModal = this._closeModal.bind(this)
     this.addNewEvent = this.addNewEvent.bind(this)
     this.removeEvent = this.removeEvent.bind(this)
     this.editEvent = this.editEvent.bind(this)
     this.changeView = this.changeView.bind(this)
     this.handleCellSelection = this.handleCellSelection.bind(this)
   }
 
   componentDidMount(){
 
     const {displayName} = this.props.carrera  //Obtener el nombre de la carrera que traeremos las citas
     
     this.setState({items:items})
 
     const {firebase} = this.context;    //Obtener acceso a firebase por su contexto
     
     //Consulta de firebase todas las citas que coincidan con el nombre de la carrera
     try{
       firebase.db.collection('cita').where("carrera","==",displayName).onSnapshot(this.handleSnapshot) //handleSnapshot para suscribirnos en tiempo real
     } catch(e){
       console.log(e)
     }
 
   }
 
 //Snapshot nos permite utilizar la base de datos en tiempo real de firestore
  handleSnapshot = (snapshot)=>{
     const cites = snapshot.docs.map(doc =>{
         return {
             id: doc.id,
             ...doc.data()
         }
     });
 
     this.setState({citas: cites}) //Almacenamos la información de las citas
     const values = this.obtenerItems(this.state.citas) //Una vez almacenada las citas convertimos de cita a items para mostrar
     this.setState({items:values})
     
 }
 
 //Concierte las citas de la bd a items para mostrar en la agenda
 obtenerItems = (citas) => {
     var listaCitas = [];  //Esta será la lista que al final mostraremos cada Item
     citas.map( cite => {
       const {nombre,id,codigo,date,day,time,centro,carrera,subject,classes,startDateTime,endDateTime} = cite //Obtenemos la información necesaria de la cita
       const fechaDia = day.split('-') // parseamos la fecha del dia de "aaaa-m-d" a fechadia[0] = año, fechaDia[1] = mes, fechaDia[2] = dia
       const dia = new Date(date * 1000);     //Convertimos la fecha date de timeStamp a Date
       
       if(cite.startDateTime){ //Si la cita ya ha sido editada ya podemos solo pasar el tiempo de inicio y final 
         
         const start = new Date(startDateTime*1000)  //Fecha inicial de la cita
       const end = new Date(endDateTime*1000)        //Fecha final de la cita    
         const timeEdit = `${start.getHours()}:00`  //Hora 
         
         //Creamos un objeto con las propiedades de la cita ya editada
         const eventoEditado = {
           _id : id,
           name : nombre,                  
           startDateTime: new Date(fechaDia[0],start.getMonth(),start.getDate(),start.getHours(),start.getMinutes()),
           endDateTime: new Date(fechaDia[0],end.getMonth(),end.getDate(),end.getHours(),end.getMinutes()),
           codigo,
           dia,
           centro,
           carrera,
           subject,                
           classes,
           time:timeEdit
         }
         listaCitas.push(eventoEditado)
       } else{
         
         //Si recién se ha agendado desde la aplicación este será por defecto mostrado
       const nuevoEvento = {
         _id : id,
         name : nombre,        
         startDateTime : new Date(fechaDia[0],dia.getMonth(),dia.getDate(), time.substr(0,2)),
         endDateTime : new Date(fechaDia[0],dia.getMonth(),dia.getDate(), parseInt(time.substr(0,2))+1),
         codigo,
         centro,
         dia,
         carrera,
         subject,                
         classes:'color-2',
         
       }
       listaCitas.push(nuevoEvento)
     }
       
       
     })
     
     return listaCitas // Retornar los items listos para imprimir en pantalla
   }
 
 componentWillReceiveProps(next , last){
   if(next.items){
 
     this.setState({items:next.items})
   }
 }
   handleItemEdit(item, openModal) {        
     if(item && openModal === true){      
       this.setState({selected:[item] })
       return this._openModal();
     }
 
 
 
   }
   handleCellSelection(item, openModal) {    
     if(this.state.selected && this.state.selected[0] === item){
       return  this._openModal();
     }
        this.setState({selected:[item] })
 
   }
 
   zoomIn(){
 var num = this.state.cellHeight + 15
     this.setState({cellHeight:num})
   }
   zoomOut(){
 var num = this.state.cellHeight - 15
     this.setState({cellHeight:num})
   }
 
 
   handleDateRangeChange (startDate, endDate) {
       this.setState({startDate:startDate })
 
   }
 
   handleRangeSelection (selected) {
 
     console.log(selected)
 this.setState({selected:selected , showCtrl:true})
 this._openModal();
 
 }
 
 _openModal(){
   this.setState({showModal:true})
 }
 _closeModal(e){
   if(e){
     e.stopPropagation();
     e.preventDefault();
   }
     this.setState({showModal:false})
 }
 
 handleItemChange(items , item){
 
 this.setState({items:items})
 }
 
 handleItemSize(items , item){
 
   this.setState({items:items})
 
 }
 
 removeEvent(items , item){
   console.log(item)
     
     if(this.confirmar(item)){
       this.setState({ items:items});      
       return
     }
     
     
 }
 //Por si se quiere eliminar alguna cita
 confirmar = (item) => {
   
   var r = window.confirm("se eliminara esta cita y no podrá acceder nuevamente")    
   
   if (r == true) {    
     const {firebase} = this.context
 
     try{
         firebase.db.collection("cita").doc(item._id).delete().then(function() {
           console.log("Document successfully deleted!");
       }).catch(function(error) {
           console.error("Error removing document: ", error);
       });
     }catch(e){
       console.log(e)
     }
     return true
 
   } else {
     console.log("no se elimino nada")
     return false
   }
 }
 
 //Al agregar nueva cita no se guarda en la bd
 addNewEvent (items , newItems){
 
   this.setState({showModal:false ,selected:[] , items:items});
   this._closeModal();
 }
 //Aquí ocurre cuando se le da al botón de Save
 editEvent (items , item){
 
   this.setState({showModal:false ,selected:[] , items:items});
   this._closeModal();
 
   // Editar en la BD        
   const {firebase} = this.context;    
 
   try {
     firebase.db.collection('cita')
               .doc(item._id)
               .update({
                 classes:item.classes,
                 startDateTime:item.startDateTime,
                 endDateTime:item.endDateTime
               })
   } catch (error) {
     console.log(error)
   }
 
 }
 
 changeView (days , event ){
 this.setState({numberOfDays:days})
 }
 
 
   render() {
 
     var AgendaItem = function(props){
       console.log( ' item component props' , props)
       const {subject} = props.item;
       return ( 
         <div style={{display:'block', position:'absolute' , background:'#FFF'}}>{props.item.name} 
           <p>{subject}</p>
           <button onClick={()=> props.edit(props.item)}>Edit </button>
         </div>)
     }
     return (
 
       <div className="content-expanded ">
 
         <div className="control-buttons">
           <button  className="button-control" onClick={this.zoomIn}> <i className="zoom-plus-icon"></i> </button>
           <button  className="button-control" onClick={this.zoomOut}> <i className="zoom-minus-icon"></i> </button>
           {/* <button  className="button-control" onClick={this._openModal}> <i className="schedule-icon"></i> </button> */}
           <button  className="button-control" onClick={this.changeView.bind(null , 7)}> {moment.duration(7, "days").humanize()}  </button>
           <button  className="button-control" onClick={this.changeView.bind(null , 4)}> {moment.duration(4, "days").humanize()}  </button>
           <button  className="button-control" onClick={this.changeView.bind(null , 3)}> {moment.duration(3, "days").humanize()}  </button>
           <button  className="button-control" onClick={this.changeView.bind(null , 1)}> {moment.duration(1, "day").humanize()} </button>
         </div>
 
         <ReactAgenda
           minDate={new Date(now.getFullYear(), now.getMonth()-3)}
           maxDate={new Date(now.getFullYear(), now.getMonth()+3)}
           startDate={this.state.startDate}
           startAtTime={7}
           endAtTime={21}
           cellHeight={this.state.cellHeight}
           locale="es"
           items={this.state.items}
           numberOfDays={this.state.numberOfDays}
           headFormat={"ddd DD MMM"}
           rowsPerHour={this.state.rowsPerHour}
           itemColors={colors}
           helper={true}
           // itemComponent={AgendaItem}
           view="calendar"
           autoScale={false}
           fixedHeader={true}
           // onRangeSelection={this.handleRangeSelection.bind(this)}
           onChangeEvent={this.handleItemChange.bind(this)}
           onChangeDuration={this.handleItemSize.bind(this)}
           onItemEdit={this.handleItemEdit.bind(this)}
           // onCellSelect={this.handleCellSelection.bind(this)}
           onItemRemove={this.removeEvent.bind(this)}
           onDateRangeChange={this.handleDateRangeChange.bind(this)} />
         {
           this.state.showModal 
           ?  <Modal clickOutside={this._closeModal} >
               <div className="modal-content">
                 <ReactAgendaCtrl items={this.state.items} itemColors={colors} selectedCells={this.state.selected} Addnew={this.addNewEvent} edit={this.editEvent}  />
 
               </div>
             </Modal>:''
         }
 
 
        </div>
 
     );
   }
 }
 