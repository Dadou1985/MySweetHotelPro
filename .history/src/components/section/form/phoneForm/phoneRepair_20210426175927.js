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
import Close from '../../../../svg/close.svg'
import Picture from '../../../../svg/picture.svg'

const PhoneRepair = ({user, userDB}) =>{

    const [formValue, setFormValue] = useState({room: "", client: "", details: "", type: "", url: ""})
    const [info, setInfo] = useState([])
    const [activate, setActivate] = useState(false)
    const [expand, setExpand] = useState(false)
    const [img, setImg] = useState("")
    const [imgFrame, setImgFrame] = useState(false)
    const [newImg, setNewImg] = useState("")

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

      const handleImgChange = (event) => {
        if (event.target.files[0]){
            setNewImg(event.target.files[0])
        }
    }

      const handleChangeExpand = () => setExpand(!expand)

      const addTechnicalProblem = (event, photo) => {
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
            status: false,
            img: photo

            })
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

     const handleShow = () => setActivate(true)
     const handleHide = () => setActivate(false)

    return(
        
        <div className="phone_container">
            <h3 className="phone_title">Maintenance technique</h3>
            <div style={{width: "90vw", overflow: "scroll", height: '100%'}}>
            <div style={{display: "flex", flexFlow: "row", justifyContent: expand ? "flex-start" : "flex-end", width: "100%"}}>
                <span style={{display: "flex", flexFlow: expand ? "row-reverse" : "row"}}  onClick={handleChangeExpand}>
                {expand ? "Rétrécir" : "Agrandir"}
                {expand ? <img src={Left} style={{width: "3vw", marginRight: "1vw"}} /> : <img src={Right} style={{width: "3vw", marginLeft: "1vw"}} />}
                </span>
            </div>
            {!imgFrame ? <Table striped bordered hover size="sm" className="text-center">
                    <thead className="bg-dark text-center text-light">
                        <tr>
                        <th>Client</th>
                        <th>Chambre</th>
                        <th>Catégorie</th>
                        <th>Statut</th>
                        {expand && <th>Détails</th>}
                        {expand && <td>Date</td>}
                        {expand && <th>Photo</th>}
                        {expand && <td>Collaborateur</td>}
                        {expand && <th className="bg-dark"></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {info.map(flow =>(
                            <tr key={flow.id}>
                            <td>{flow.client}</td>
                            <td>{flow.room}</td>
                            <td>{flow.type}</td>
                            <td>
                            <Switch
                                checked={flow.status}
                                onChange={() => changeIssueStatus(flow.id)}
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                            </td>
                            {expand && <td>{flow.details}</td>}
                            {expand && <td>{moment(flow.markup).format('L')}</td>}
                            {expand && <td style={{cursor: "pointer"}} onClick={() => {
                                setImg(flow.img)
                                setImgFrame(true)
                            }}>{flow.img ? <img src={Picture} style={{width: "5vw"}} /> : "Aucune"}</td>}
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
                                .collection("maintenance")
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
                </Table> : 
                    <div style={{
                        display: "flex",
                        flexFlow: 'column',
                        alignItems: "center",
                        padding: "2%"
                    }}>
                        <div style={{width: "100%"}}>
                            <img src={Close} style={{width: "5vw", float: "right", cursor: "pointer", marginBottom: "2vh"}} onClick={() => setImgFrame(false)} /> 
                        </div>
                        <img src={img} style={{width: "90%"}} />
                    </div>}
            </div>
            <Button variant="outline-success" className="phone_submitButton" onClick={handleShow}>Signaler un problème</Button>
            
            <Drawer anchor="bottom" open={activate} onClose={handleHide}  className="phone_container_drawer">
                <div  className="phone_container_drawer">
                <h4 style={{marginBottom: "5vh", borderBottom: "1px solid lightgrey"}}>Signaler un problème technique</h4>
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
                        <Form.Group controlId="exampleForm.SelectCustom">
                        <Form.Label>Quel type de problème ?</Form.Label><br/>
                        <select class="selectpicker" value={formValue.type} name="type" onChange={handleChange} 
                        className="phonePage_select">
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
                        <Form.Group controlId="details" className="phone_textarea">
                            <Form.Label>Plus de détails</Form.Label>
                            <Form.Control as="textarea" rows="2" value={formValue.details} name="details" onChange={handleChange}  />
                        </Form.Group>
                    </Form.Row>
                <Button variant="success" className="phone_submitButton" onClick={(event) => {
                    handleSubmit(event)
                    setActivate(false)
                    }}>Signaler maintenant</Button>
                </div>
            </Drawer>
            </div>
                            
    )
}

export default PhoneRepair