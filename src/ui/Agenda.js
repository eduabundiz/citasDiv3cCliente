// @flow
import React, { Component } from 'react';
import moment from 'moment';
import { ReactAgenda , ReactAgendaCtrl, guid , getUnique , getLast , getFirst , Modal } from 'react-agenda';

import {FirebaseContext} from '../firebase';

var now = new Date();

require('moment/locale/es.js');
    var colors= {
      'color-1':"rgba(102, 195, 131 , 1)" ,
      "color-2":"rgba(242, 177, 52, 1)" ,
      "color-3":"rgba(235, 85, 59, 1)" ,
      "color-4":"rgba(70, 159, 213, 1)",
      "color-5":"rgba(170, 59, 123, 1)"
    }


var items = [
  {
   _id            :guid(),
    name          : 'Meeting , dev staff!',
    startDateTime : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
    endDateTime   : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0),
    classes       : 'color-1 color-4'
  },
  {
   _id            :guid(),
    name          : 'Working lunch , Holly',
    startDateTime : new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 11, 0),
    endDateTime   : new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 13, 0),
    classes       : 'color-2'
  },
  {
   _id            :guid(),
    name          : 'Conference , plaza',
    startDateTime : new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 11 , 0),
    endDateTime   : new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 14 ,30),
    classes       : 'color-4'
  },
  {
   _id            :'event-4',
    name          : 'Customers issues review',
    startDateTime : new Date(now.getFullYear(), now.getMonth(), now.getDate()+2, 10, 0),
    endDateTime   : new Date(now.getFullYear(), now.getMonth(), now.getDate()+2, 15, 0),
    classes       : 'color-3'

  },
  {
    _id           :'event-5',
    name          : 'Group activity',
    startDateTime : new Date(now.getFullYear(), now.getMonth(), now.getDate()+3, 10, 0),
    endDateTime   : new Date(now.getFullYear(), now.getMonth(), now.getDate()+3, 16, 30),
    classes       : 'color-4'
  },
  {
    _id           :'event-6',
    name          : 'Fun Day !',
    startDateTime : new Date(now.getFullYear(), now.getMonth(), now.getDate()+7, 9, 14),
    endDateTime   : new Date(now.getFullYear(), now.getMonth(), now.getDate()+7, 17),
    classes       : 'color-3'
  }
];

export default class Agenda extends Component {

   static contextType = FirebaseContext;


  constructor(props){
  super(props);



this.state = {
  items:[],
  selected:[],
  cellHeight:(60 / 4),
  showModal:false,
  locale:"es",
  rowsPerHour:3,
  numberOfDays:4,
  startDate: new Date(),
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

    this.setState({items:items})
    const {firebase} = this.context;    
    try{
    firebase.db.collection('cita').onSnapshot(this.handleSnapshot)
    } catch(e){
      console.log(e)
    }
    // this.setState({items:values})
    // console.log(values)

  }

//Snapshot nos permite utilizar la base de datos en tiempo real de firestore
 handleSnapshot = (snapshot)=>{
    const cites = snapshot.docs.map(doc =>{
        return {
            id: doc.id,
            ...doc.data()
        }
    });
    this.setState({citas: cites})
    const values = this.obtenerItems(this.state.citas)
    this.setState({items:values})
    // console.log("this.state.citas-->")
    // console.log(cites)
}

obtenerItems = (citas) => {
    var listaCitas = [];
    citas.map( cite => {
      const {nombre,id,codigo,date,day,time,centro,carrera,subject,startDateTime,endDateTime} = cite
      const fechaDia = day.split('-')
      const dia = new Date(date * 1000);     
      if(cite.startDateTime){
        // console.log("cita Editada -->")
        // console.log(startDateTime)
        const start = new Date(startDateTime*1000)
        const end = new Date(endDateTime*1000)
          
        
        
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
          classes:'color-2',
        }
        listaCitas.push(eventoEditado)
      } else{
        
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
    
    return listaCitas
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
    // console.log(item)
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
confirmar = (item) => {
  
  var r = window.confirm("se eliminara esta cita y no podrá acceder nuevamente")    
  
  if (r == true) {
    console.log("confirmacion")

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
addNewEvent (items , newItems){

  this.setState({showModal:false ,selected:[] , items:items});
  this._closeModal();
}
//Aquí ocurre cuando se le da al botón de Save
editEvent (items , item){

  this.setState({showModal:false ,selected:[] , items:items});
  
  // console.log(selected)
  // console.log("Item -->")
  // console.log(items);
  // console.log(item)
  this._closeModal();

  // Editar en la BD
  console.log("Antes de Editar")
  console.log(item)
  console.log(item.startDateTime)
  // console.log(item.startDateTime.toString())
    
  const {firebase} = this.context;    

  try {
    firebase.db.collection('cita')
              .doc(item._id)
              .update({
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
      return <div style={{display:'block', position:'absolute' , background:'#FFF'}}>{props.item.name} <button onClick={()=> props.edit(props.item)}>Edit </button></div>
    }
    return (

      <div className="content-expanded ">

        <div className="control-buttons">
          <button  className="button-control" onClick={this.zoomIn}> <i className="zoom-plus-icon"></i> </button>
          <button  className="button-control" onClick={this.zoomOut}> <i className="zoom-minus-icon"></i> </button>
          <button  className="button-control" onClick={this._openModal}> <i className="schedule-icon"></i> </button>
          <button  className="button-control" onClick={this.changeView.bind(null , 7)}> {moment.duration(7, "days").humanize()}  </button>
          <button  className="button-control" onClick={this.changeView.bind(null , 4)}> {moment.duration(4, "days").humanize()}  </button>
          <button  className="button-control" onClick={this.changeView.bind(null , 3)}> {moment.duration(3, "days").humanize()}  </button>
          <button  className="button-control" onClick={this.changeView.bind(null , 1)}> {moment.duration(1, "day").humanize()} </button>
        </div>

        <ReactAgenda
          minDate={new Date(now.getFullYear(), now.getMonth()-3)}
          maxDate={new Date(now.getFullYear(), now.getMonth()+3)}
          startDate={this.state.startDate}
          startAtTime={8}
          endAtTime={23}
          cellHeight={this.state.cellHeight}
          locale="es"
          items={this.state.items}
          numberOfDays={this.state.numberOfDays}
          headFormat={"ddd DD MMM"}
          rowsPerHour={this.state.rowsPerHour}
          itemColors={colors}
          helper={true}
          //itemComponent={AgendaItem}
          view="calendar"
          autoScale={false}
          fixedHeader={true}
          onRangeSelection={this.handleRangeSelection.bind(this)}
          onChangeEvent={this.handleItemChange.bind(this)}
          onChangeDuration={this.handleItemSize.bind(this)}
          onItemEdit={this.handleItemEdit.bind(this)}
          onCellSelect={this.handleCellSelection.bind(this)}
          onItemRemove={this.removeEvent.bind(this)}
          onDateRangeChange={this.handleDateRangeChange.bind(this)} />
        {
          this.state.showModal? <Modal clickOutside={this._closeModal} >
          <div className="modal-content">
             <ReactAgendaCtrl items={this.state.items} itemColors={colors} selectedCells={this.state.selected} Addnew={this.addNewEvent} edit={this.editEvent}  />

          </div>
   </Modal>:''
}


       </div>

    );
  }
}
