import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { db } from '../../../../Firebase'
import 'moment/locale/fr';

function PhoneFeedback({userDB}) {

    const [list, setList] = useState(false)
    const [formValue, setFormValue] = useState({categorie: "improvement", feedback: ""})

    const handleClose = () => setList(false)

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

      const handleSubmitFeedback = async(event) => {
        event.preventDefault()
        setFormValue({categorie: "improvement", feedback: ""})
        const notif = "La Team MSH vous remercie pour votre contribution !"
        await db.collection('feedbacks')
            .doc('category')
            .collection(formValue.categorie)
            .add({
                author: userDB.username,
                hotelName: userDB.hotelName,
                hotelRegion: userDB.hotelRegion,
                hotelDept: userDB.hotelDept,
                text: formValue.feedback,
                markup: Date.now()
            })
            return db.collection('notifications')
                .add({
                content: notif,
                hotelId: userDB.hotelId,
                markup: Date.now()})
                .then(doc => console.log('nouvelle notitfication'))
        .then(handleClose)
    }
    return (
        <div className="phone_container">
                <h4 style={{marginBottom: "5vh"}}>Feedback Box</h4>

                <select class="selectpicker" 
                value={formValue.categorie} name="categorie" onChange={handleChange} 
                    style={{width: "90vw", 
                    height: "6vh", 
                    border: "1px solid lightgrey", 
                    borderRadius: "3px",
                    backgroundColor: "white", 
                    paddingLeft: "1vw", 
                    marginBottom: "3vh"}}>
                        <option value="improvement">Améliorations</option>
                        <option value="satisfaction">Satisfaction</option>
                    </select>

            <Form.Row>
                <Form.Group controlId="description">
                <Form.Control as="textarea" type="text" 
                placeholder="Faites-nous un retour de votre expérience..." 
                style={{width: "90vw", height: "30vh", resize: "none", marginBottom: "30vh"}} 
                value={formValue.feedback} name="feedback" onChange={handleChange} />
                </Form.Group>
            </Form.Row>
            <Button variant="success" size="md" style={{position: "absolute", bottom: 0,left: 0, width: "100%", padding: "3%"}} className="phone_submitButton" onClick={handleSubmitFeedback}>Envoyer maintenant</Button>
        </div>
    )
}

export default PhoneFeedback
