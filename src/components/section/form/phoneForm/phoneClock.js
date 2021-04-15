import React, {useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { FirebaseContext, auth, db } from '../../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Drawer from '@material-ui/core/Drawer'

const PhoneClock = ({user, userDB}) =>{

    const [formValue, setFormValue] = useState({room: "", client: "", hour: "", date: ""})
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
            .collection('clock')
            .add({
            author: user.displayName,
            date: formValue.date,
            client: formValue.client,
            room: formValue.room,
            day: new Date(),
            markup: Date.now(),
            hour: formValue.hour
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


    return(

    <div className="phone_container">
        <h3 className="phone_title">Programmation des réveils</h3>
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
        <Button variant="success" className="phone_submitButton" onClick={handleSubmit}>Enregistrer</Button>
    </div>
    )
}

export default PhoneClock