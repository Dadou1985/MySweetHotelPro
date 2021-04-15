import React, {useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { FirebaseContext, auth, db } from '../../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Drawer from '@material-ui/core/Drawer'

const PhoneRepair = ({user, userDB}) =>{

    const [formValue, setFormValue] = useState({room: "", client: "", details: "", type: ""})
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
            .collection('maintenance')
            .add({
            author: user.displayName,
            date: new Date(),
            details: formValue.details,
            client: formValue.client,
            room: formValue.room,
            markup: Date.now(),
            type: formValue.type
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


    return(
        
        <div className="phone_container">
            <h2 className="phone_title">Maintenance technique</h2>
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
                        <Form.Control as="textarea" rows="3" value={formValue.details} name="details" onChange={handleChange}  />
                    </Form.Group>
                </Form.Row>
                <Button variant="success" className="phone_submitButton" onClick={handleSubmit}>Enregistrer</Button>
            </div>
                            
    )
}

export default PhoneRepair