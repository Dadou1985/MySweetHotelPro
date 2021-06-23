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
    const [step, setStep] = useState(false)
    const [footerState, setFooterState] = useState(true)

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

      const StyledBadge = withStyles((theme) => ({
        badge: {
          right: -3,
          top: 13,
          border: `2px solid ${theme.palette.background.paper}`,
          padding: '0 4px',
        },
      }))(Badge);

      const addNotification = (notification) => {
        return db.collection('notifications')
            .add({
            content: notification,
            hotelId: userDB.hotelId,
            markup: Date.now()})
            .then(doc => console.log('nouvelle notitfication'))
    }

    const handleSubmit = event => {
        event.preventDefault()
        setFormValue("")
        setStep(false)
        const notif = "Vous venez d'ajouter une demande de réveil !" 
        addNotification(notif)
        return db.collection('hotel')
            .doc(userDB.hotelId)
            .collection('clock')
            .add({
            author: userDB.username,
            client: formValue.client,
            room: formValue.room,
            day: Date.now(),
            markup: Date.now(),
            hour: moment(formValue.date).format('LT'),
            date: moment(formValue.date).format('L'),            
            status: false
            })
        .then(handleClose)
    }

    const changeDemandStatus = (document) => {
        return db.collection('hotel')
            .doc(userDB.hotelId)
          .collection('clock')
          .doc(document)
          .update({
            status: false,
        })      
      }


    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('hotel')
            .doc(userDB.hotelId)
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
            return db.collection('hotel')
            .doc(userDB.hotelId)
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
                    size="xl"
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
                    
                    <Tabs defaultActiveKey="Programmer un réveil" id="uncontrolled-tab-example"onSelect={(eventKey) => {
                        if(eventKey === 'Liste des réveils'){
                            return setFooterState(false)
                        }else{
                            return setFooterState(true)
                        }
                    }}>
                        <Tab eventKey="Programmer un réveil" title="Programmer un réveil">
                        <div style={{
                                    display: "flex",
                                    flexFlow: "row wrap",
                                    justifyContent: "space-around",
                                    padding: "5%", 
                                    textAlign: "center"
                                }}>
                                    {!step && <Form.Row style={{
                                        display: "flex",
                                        flexFlow: "row",
                                        alignItems: "center",
                                        justifyContent: "space-around",
                                        width: "70%"
                                    }}>
                                        <Form.Group>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDateTimePicker
                                            variant="dialog"
                                            ampm={false}
                                            label="Date et Heure de réservation"
                                            value={formValue.date}
                                            onChange={handleDateChange}
                                            onError={console.log}
                                            disablePast
                                            format="dd/MM/yyyy HH:mm"
                                        />                                        
                                        </MuiPickersUtilsProvider>
                                        </Form.Group>
                                    </Form.Row>}
                                {step && <>
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
                                </>}
                            </div>
                        </Tab>
                        <Tab eventKey="Liste des réveils" title="Liste des réveils">
                        <Table striped bordered hover size="sm" className="text-center">
                            <thead className="bg-dark text-center text-light">
                                <tr>
                                <th>Client</th>
                                <th>Chambre</th>
                                <th>Date</th>
                                <th>Heure</th>
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
                                    <td>{flow.date}</td>
                                    <td>{flow.hour}</td>
                                    <td>
                                        <Switch
                                            checked={flow.status}
                                            onChange={() => changeDemandStatus(flow.id)}
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                        </td>
                                    <td>{flow.author}</td>
                                    <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
                                            return db.collection('hotel')
                                            .doc(userDB.hotelId)
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
                    {footerState && <Modal.Footer>
                        {step && <>
                            <Button variant="outline-info" onClick={() => setStep(false)}>Retour</Button>
                            <Button variant="success" onClick={handleSubmit}>Enregistrer</Button>
                        </>}
                        {!step && <Button variant="outline-info" onClick={() => setStep(true)}>Poursuivre</Button>}
                    </Modal.Footer>}
                </Modal>
        </div>
    )
}

export default Clock