import React, {useState, useEffect, useContext } from 'react'
import { Form, Button, Table, Tabs, Tab, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import Maintenance from '../../../svg/repair.svg'
import { db, auth } from '../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Switch from '@material-ui/core/Switch';
import Badge from '@material-ui/core/Badge'
import StyleBadge from '../common/badgeMaker'
import { withStyles } from '@material-ui/core/styles';
import Picture from '../../../svg/picture.svg'
import Close from '../../../svg/close.svg'


const Repair = ({userDB, user}) =>{

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({room: "", client: "", details: "", type: ""})
    const [issueQty, setIssueQty] = useState([])
    const [img, setImg] = useState("")
    const [imgFrame, setImgFrame] = useState(false)

    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

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
            .collection('maintenance')
            .add({
            author: user.displayName,
            date: new Date(),
            details: formValue.details,
            client: formValue.client,
            room: formValue.room,
            markup: Date.now(),
            type: formValue.type,
            status: false
            })
        .then(handleClose)
    }

    const changeIssueStatus = (document) => {
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
          .collection('maintenance')
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
            .collection('maintenance')
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
            .collection('maintenance')
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
                    setIssueQty(snapInfo)
                });
                return unsubscribe
           
     },[])

    return(
        <div>
            <StyledBadge badgeContent={issueQty.length} color="secondary">
                <OverlayTrigger
                placement="right"
                overlay={
                <Tooltip id="title">
                    Maintenance
                </Tooltip>
                }>
                        <img src={Maintenance} className="icon" alt="contact" onClick={handleShow} style={{width: "3vw", marginRight: "1vw"}} />
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
                        Maintenance technique
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    
                    <Tabs defaultActiveKey="Signaler un problème technique" id="uncontrolled-tab-example" onSelect={(eventKey) => {
                        if(eventKey === 'Liste des problèmes techniques'){
                            return setFooterState(false)
                        }else{
                            return setFooterState(true)
                        }
                    }}>
                            <Tab eventKey="Signaler un problème technique" title="Signaler un problème technique">
                            <div style={{
                                    display: "flex",
                                    flexFlow: "column",
                                    justifyContent: "space-around",
                                    alignItems: "center",
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
                                        <Form.Group controlId="exampleForm.SelectCustom">
                                        <Form.Label>Quel type de problème ?</Form.Label><br/>
                                        <select class="selectpicker" value={formValue.type} name="type" onChange={handleChange} 
                                        style={{width: "20vw", 
                                        height: "6vh", 
                                        border: "1px solid lightgrey", 
                                        borderRadius: "3px",
                                        backgroundColor: "white", 
                                        paddingLeft: "1vw"}}>
                                            <option></option>
                                            <option>Peinture</option>
                                            <option>Plomberie</option>
                                            <option>Electricité</option>
                                            <option>Ménage</option>
                                            <option>Autres</option>
                                        </select>
                                    </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group controlId="details">
                                            <Form.Label>Plus de détails</Form.Label>
                                            <Form.Control as="textarea" rows="3" style={{width: "20vw", maxHeight: "15vh"}} value={formValue.details} name="details" onChange={handleChange}  />
                                        </Form.Group>
                                    </Form.Row>
                                </div>
                            </Tab>
                            <Tab eventKey="Liste des problèmes techniques" title="Liste des problèmes techniques">
                            {!imgFrame ? <Table striped bordered hover size="sm" className="text-center">
                                <thead className="bg-dark text-center text-light">
                                    <tr>
                                    <th>Client</th>
                                    <th>Chambre</th>
                                    <th>Catégorie</th>
                                    <th>Détails</th>
                                    <th>Date</th>
                                    <th>Photo</th>
                                    <th>Collaborateur</th>
                                    <th>Statut</th>
                                    <th className="bg-dark"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {info.map(flow =>(
                                        <tr key={flow.id}>
                                        <td>{flow.client}</td>
                                        <td>{flow.room}</td>
                                        <td>{flow.type}</td>
                                        <td>{flow.details}</td>
                                        <td>{moment(flow.markup).format('L')}</td>
                                        {flow.img ? <td style={{cursor: "pointer"}} onClick={() => {
                                            setImg(flow.img)
                                            setImgFrame(true)
                                        }}><img src={Picture} style={{width: "1vw"}} /></td> : 
                                        <td>Aucune</td>}
                                        <td>{flow.author}</td>
                                        <td>
                                        <Switch
                                            checked={flow.status}
                                            onChange={() => changeIssueStatus(flow.id)}
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                        </td>
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
                                            .collection("maintenance")
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
                            </Table> : 
                            <div style={{
                                display: "flex",
                                flexFlow: 'column',
                                alignItems: "center",
                                padding: "2%"
                            }}>
                                <div style={{width: "100%"}}>
                                    <img src={Close} style={{width: "1vw", float: "right", cursor: "pointer"}} onClick={() => setImgFrame(false)} /> 
                                </div>
                                <img src={img} style={{width: "70%"}} />
                            </div>}
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                    {footerState && <Modal.Footer>
                        <Button variant="outline-success" onClick={handleSubmit}>Enregistrer</Button>
                    </Modal.Footer>}
                </Modal>

                
        </div>
    )
}

export default Repair