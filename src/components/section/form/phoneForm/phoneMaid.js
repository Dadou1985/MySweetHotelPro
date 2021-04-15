import React, {useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { FirebaseContext, auth, db } from '../../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Drawer from '@material-ui/core/Drawer'

const PhoneMaid = ({user, userDB}) =>{

    const [formValue, setFormValue] = useState({client: "", details: "", fromRoom: "", toRoom: "", reason: "", state: ""})
    const [info, setInfo] = useState([])

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

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
            .collection('roomChange')
            .add({
            author: user.displayName,
            date: new Date(),
            details: formValue.details,
            client: formValue.client,
            fromRoom: formValue.fromRoom,
            markup: Date.now(),
            toRoom: formValue.toRoom,
            reason: formValue.reason,
            state: formValue.state
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
            .collection('roomChange')
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

    return(
        
        <div className="phone_container">
            <h2 className="phone_title">Délogements clients</h2>
                <Form.Row>
                    <Form.Group controlId="description" className="phone_input">
                    <Form.Label>Nom du client</Form.Label>
                    <Form.Control type="text" placeholder="ex: Jane Doe" value={formValue.client} name="client" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="description" className="phone_smallInput">
                    <Form.Label>Depuis la chambre...</Form.Label>
                    <Form.Control type="text" placeholder="ex: 310" value={formValue.fromRoom} name="fromRoom" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="description" className="phone_smallInput">
                    <Form.Label>...vers la chambre</Form.Label>
                    <Form.Control type="text" placeholder="ex: 409" value={formValue.toRoom} name="toRoom" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>Pour quel motif ?</Form.Label><br/>
                    <select class="selectpicker" value={formValue.reason} name="reason" onChange={handleChange} 
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
                    <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>Etat de la chambre</Form.Label><br/>
                    <select class="selectpicker" value={formValue.state} name="state" onChange={handleChange} 
                    className="phonePage_select">
                        <option></option>
                        <option>Sale</option>
                        <option>Propre</option>
                    </select>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="details" className="phone_textarea">
                        <Form.Label>Plus de détails</Form.Label>
                        <Form.Control as="textarea" rows="3" value={formValue.details} name="details" onChange={handleChange}  />
                    </Form.Group>
                </Form.Row>
                <Button variant="success" className="phone_submitButton" onClick={handleSubmit}>Enregistrer</Button>
            </div>
                            
    )
}

export default PhoneMaid