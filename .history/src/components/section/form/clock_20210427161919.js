import React, {useState, useEffect, useContext } from 'react'
import { Form, Button, Table, Tabs, Tab, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import Timer from '../../../svg/timer.svg'
import { db, auth } from '../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Badge from '@material-ui/core/Badge'
import Switch from '@material-ui/core/Switch';
import StyleBadge from '../common/badgeMaker'
import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker
  } from '@material-ui/pickers';

const Clock = ({userDB, user}) =>{

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({room: "", client: "", hour: new Date(), date: new Date()})
    const [demandQty, setDemandQty] = useState([])

    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

      const handleDateChange = (date) => {
        setFormValue({date: date});
      };

      const handleHourChange = (hour) => {
        setFormValue({hour: hour});
      };

      const StyledBadge = withStyles((theme) => ({
        badge: {
          right: -3,
          top: 13,
          border: `2px solid ${theme.palette.background.paper}`,
          padding: '0 4px',
        },
      }))(Badge);

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
            day: Date.now(),
            markup: Date.now(),
            hour: formValue.hour,
            status: false
            })
        .then(handleClose)
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
            .where("status", "==", true)
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
                    setDemandQty(snapInfo)
                });
                return unsubscribe
           
     },[])

    return(
        <div>
            <StyledBadge badgeContent={demandQty.length} color="secondary">
                <OverlayTrigger
                placement="right"
                overlay={
                <Tooltip id="title">
                    Réveil
                </Tooltip>
                }>
                        <img src={Timer} className="icon" alt="contact" onClick={handleShow} style={{width: "3vw", marginRight: "1vw"}} />
                </OverlayTrigger>
            </StyledBadge>

            <Modal show={list}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={handleClose}
                    >
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title id="contained-modal-title-vcenter">
                        Programmation des réveils
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    
                    <Tabs defaultActiveKey="Programmer un réveil" id="uncontrolled-tab-example">
                        <Tab eventKey="Programmer un réveil" title="Programmer un réveil">
                        <div style={{
                                    display: "flex",
                                    flexFlow: "row wrap",
                                    justifyContent: "space-around",
                                    padding: "5%", 
                                    textAlign: "center"
                                }}>
                                <Form.Row>
                                    <Form.Group controlId="description">
                                    <Form.Label>Nom du client</Form.Label>
                                    <Form.Control type="text" placeholder="ex: Jane Doe" style={{width: "20vw"}} value={formValue.client} name="client" onChange={handleChange} />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group controlId="description">
                                    <Form.Label>Numéro de chambre</Form.Label>
                                    <Form.Control type="text" placeholder="ex: 409" style={{width: "20vw"}} value={formValue.room} name="room" onChange={handleChange} />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                        <Form.Group controlId="description">
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            margin="normal"
                                            id="date-picker-dialog"
                                            label="Date de réveil"
                                            format="dd/MM/yyyy"
                                            value={formValue.date}
                                            onChange={handleDateChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            />    
                                        </MuiPickersUtilsProvider>                                        </Form.Group>

                                    <Form.Group controlId="description">
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardTimePicker
                                            margin="normal"
                                            id="time-picker"
                                            label="Heure de réveil"
                                            value={formValue.hour}
                                            onChange={handleHourChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change time',
                                            }}
                                            />
                                        </MuiPickersUtilsProvider>                                    </Form.Group>
                                </Form.Row>
                            </div>
                        </Tab>
                        <Tab eventKey="Liste des réveils" title="Liste des réveils">
                        <Table striped bordered hover size="sm" className="text-center">
                            <thead className="bg-dark text-center text-light">
                                <tr>
                                <th>Client</th>
                                <th>Chambre</th>
                                <th>Jour</th>
                                <th>Heure</th>
                                <th>Date</th>
                                <th>Statut</th>
                                <th>Collaborateur</th>
                                <th className="bg-dark"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {info.map(flow =>(
                                    <tr key={flow.id}>
                                    <td>{flow.client}</td>
                                    <td>{flow.room}</td>
                                    <td>{moment(flow.day).format('LLL')}</td>
                                    <td>{moment(flow.date).format('LLL')}</td>
                                    <td>{moment(flow.hour).format('LT')}</td>
                                    <td>
                                        <Switch
                                            checked={flow.status}
                                            onChange={() => changeDemandStatus(flow.id)}
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                        </td>
                                    <td>{flow.author}</td>
                                    <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
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
                                        }}>Supprimer</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        </Tab>
                    </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-success" onClick={handleSubmit}>Enregistrer</Button>
                    </Modal.Footer>
                </Modal>
        </div>
    )
}

export default Clock