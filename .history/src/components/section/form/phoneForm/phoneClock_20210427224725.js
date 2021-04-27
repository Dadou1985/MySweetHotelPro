import React, {useState, useEffect } from 'react'
import { Form, Button, Table } from 'react-bootstrap'
import { FirebaseContext, auth, db } from '../../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Drawer from '@material-ui/core/Drawer'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Left from '../../../../svg/arrow-left.svg'
import Right from '../../../../svg/arrow-right.svg'
import Switch from '@material-ui/core/Switch';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';

const PhoneClock = ({user, userDB}) =>{

    const [formValue, setFormValue] = useState({room: "", client: "", hour: "", date: ""})
    const [info, setInfo] = useState([])
    const [activate, setActivate] = useState(false)
    const [expand, setExpand] = useState(false)

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

      const handleChangeExpand = () => setExpand(!expand)

      const handleSubmit = event => {
        event.preventDefault()
        setFormValue("")
        return db.collection('mySweetHotel')
            .doc('country')
            .collection('France')
            .doc('collection')
            .collection('hotel')
            .doc('region')
            .collection(userDB.hotelRegion)
            .doc('departement')
            .collection(userDB.hotelDept)
            .doc(`${userDB.hotelId}`)
            .collection('clock')
            .add({
            author: user.displayName,
            date: formValue.date,
            client: formValue.client,
            room: formValue.room,
            day: new Date(),
            markup: Date.now(),
            hour: formValue.hour,
            status: false
            })
    }

    const changeDemandStatus = (document) => {
        return db.collection('mySweetHotel')
          .doc('country')
          .collection('France')
          .doc('collection')
          .collection('hotel')
          .doc('region')
          .collection(userDB.hotelRegion)
          .doc('departement')
          .collection(userDB.hotelDept)
          .doc(`${userDB.hotelId}`)
          .collection('clock')
          .doc(document)
          .update({
            status: false,
        })      
      }

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('mySweetHotel')
            .doc('country')
            .collection('France')
            .doc('collection')
            .collection('hotel')
            .doc('region')
            .collection(userDB.hotelRegion)
            .doc('departement')
            .collection(userDB.hotelDept)
            .doc(`${userDB.hotelId}`)
            .collection('clock')
            .orderBy("markup", "asc")
        }

        let unsubscribe = toolOnAir().onSnapshot(function(snapshot) {
                    const snapInfo = []
                  snapshot.forEach(function(doc) {          
                    snapInfo.push({
                        id: doc.id,
                        ...doc.data()
                      })        
                    });
                    console.log(snapInfo)
                    setInfo(snapInfo)
                });
                return unsubscribe
           
     },[])

     const handleShow = () => setActivate(true)
     const handleHide = () => setActivate(false)

    return(

    <div className="phone_container">
        <h3 className="phone_title">Programmation des réveils</h3>
        <div style={{width: "90vw", overflow: "scroll", height: '100%'}}>
            <div style={{display: "flex", flexFlow: "row", justifyContent: expand ? "flex-start" : "flex-end", width: "100%"}}>
                <span style={{display: "flex", flexFlow: expand ? "row-reverse" : "row"}}  onClick={handleChangeExpand}>
                {expand ? "Rétrécir" : "Agrandir"}
                {expand ? <img src={Left} style={{width: "3vw", marginRight: "1vw"}} /> : <img src={Right} style={{width: "3vw", marginLeft: "1vw"}} />}
                </span>
            </div>
            <Table striped bordered hover size="sm" className="text-center">
                            <thead className="bg-dark text-center text-light">
                                <tr>
                                {expand && <th>Client</th>}
                                <th>Chambre</th>
                                <th>Jour</th>
                                <th>Heure</th>
                                <th>Statut</th>
                                {expand && <th>Date</th>}
                                {expand && <th>Collaborateur</th>}
                                {expand && <th className="bg-dark"></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {info.map(flow =>(
                                    <tr key={flow.id}>
                                    {expand && <td>{flow.client}</td>}
                                    <td>{flow.room}</td>
                                    <td>{moment(flow.day).format('LLL')}</td>
                                    <td>{moment(flow.hour).format('LT')}</td>
                                    <td>
                                        <Switch
                                            checked={flow.status}
                                            onChange={() => changeDemandStatus(flow.id)}
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                        </td>
                                    {expand && <td>{moment(flow.date).format('LLL')}</td>}
                                    {expand && <td>{flow.author}</td>}
                                    {expand && <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
                                            return db.collection('mySweetHotel')
                                            .doc('country')
                                            .collection('France')
                                            .doc('collection')
                                            .collection('hotel')
                                            .doc('region')
                                            .collection(userDB.hotelRegion)
                                            .doc('departement')
                                            .collection(userDB.hotelDept)
                                            .doc(`${userDB.hotelId}`)
                                            .collection("clock")
                                            .doc(flow.id)
                                            .delete()
                                            .then(function() {
                                              console.log("Document successfully deleted!");
                                            }).catch(function(error) {
                                                console.log(error);
                                            });
                                        }}>Supprimer</Button></td>}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
            </div>
        <Button variant="outline-success" className="phone_submitButton" onClick={handleShow}>Programmer un réveil</Button>
    
        <Drawer anchor="bottom" open={activate} onClose={handleHide}  className="phone_container_drawer">
                <div  className="phone_container_drawer">
                <h4 style={{marginBottom: "5vh", borderBottom: "1px solid lightgrey"}}>Programmer un réveil</h4>
                <Form.Row>
            <Form.Group controlId="description" className="phone_input">
            <Form.Label>Nom du client</Form.Label>
            <Form.Control type="text" placeholder="ex: Jane Doe" value={formValue.client} name="client" onChange={handleChange} />
            </Form.Group>
        </Form.Row>
        <Form.Row>
            <Form.Group controlId="description" className="phone_input">
            <Form.Label>Numéro de chambre</Form.Label>
            <Form.Control type="text" placeholder="ex: 409" value={formValue.room} name="room" onChange={handleChange} />
            </Form.Group>
        </Form.Row>
        <Form.Row>
                <Form.Group controlId="description" className="phone_input">
                <Form.Label>Date de réveil</Form.Label>
                <Form.Control type="text" placeholder="ex: 16/04/2020" value={formValue.date} name="date" onChange={handleChange} />
                </Form.Group>
            </Form.Row>
        <Form.Row>
            <Form.Group controlId="description" className="phone_input">
            <Form.Label>Heure de réveil</Form.Label>
            <Form.Control type="text" placeholder="ex: 08h30" value={formValue.hour} name="hour" onChange={handleChange} />
            </Form.Group>
        </Form.Row>
                <Button variant="success" className="phone_submitButton" onClick={(event) => {
                    handleSubmit(event)
                    setActivate(false)
                    }}>Programmer maintenant</Button>
                </div>
            </Drawer>
    </div>
    )
}

export default PhoneClock