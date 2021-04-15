import React, {useState, useEffect} from 'react'
import { Form, Button } from 'react-bootstrap'
import { FirebaseContext, auth, db } from '../../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Drawer from '@material-ui/core/Drawer'

const PhoneLost = ({user, userDB}) =>{

    const [formValue, setFormValue] = useState({type: "", place: "", details: "", description: ""})
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
            .collection('lostNfound')
            .add({
            author: user.displayName,
            date: new Date(),
            description: formValue.description,
            details: formValue.details,
            place: formValue.place,
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
            .collection('lostNfound')
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
              <h2 className="phone_title">Objets Perdus</h2>
              <Form.Row>
                  <Form.Group controlId="exampleForm.SelectCustom">
                  <Form.Label>Quel type d'objet ?</Form.Label><br/>
                      <select class="selectpicker" value={formValue.type} name="type" onChange={handleChange} 
                      className="phonePage_select">
                          <option></option>
                          <option>High Tech</option>
                          <option>Documents Officiels</option>
                          <option>Vêtements</option>
                          <option>Autres</option>
                      </select>
                  </Form.Group>
              </Form.Row>
              <Form.Row>
                  <Form.Group controlId="exampleForm.SelectCustom">
                  <Form.Label>Lieu ?</Form.Label><br/>
                      <select class="selectpicker" value={formValue.place} name="place" onChange={handleChange} 
                      className="phonePage_select">
                          <option></option>
                          <option>Hall</option>
                          <option>Restaurant</option>
                          <option>Parking</option>
                          <option>Toilettes</option>
                          <option>Etages</option>
                          <option>Autres</option>
                      </select>
                  </Form.Group>
              </Form.Row>
              <Form.Row>
                  <Form.Group controlId="description" className="phone_input">
                  <Form.Label>Description de l'objet</Form.Label>
                  <Form.Control type="text" placeholder="ex: un i-phone noir" value={formValue.description} name="description" onChange={handleChange} />
                  </Form.Group>
              </Form.Row>
              <Form.Row>
                  <Form.Group controlId="details" className="phone_textarea">
                      <Form.Label>Plus de détails</Form.Label>
                      <Form.Control as="textarea" rows="3" name="details" value={formValue.details} onChange={handleChange}  />
                  </Form.Group>
              </Form.Row>
              <Button variant="success" className="phone_submitButton" onClick={handleSubmit}>Enregistrer</Button>
          </div>
    )
}

export default PhoneLost