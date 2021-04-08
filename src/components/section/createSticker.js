import React, {useState, useEffect, useContext } from 'react'
import Avatar from 'react-avatar'
import PostIt from '../../svg/paper.svg'
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Plus from '../../svg/plus3.svg'
import { FirebaseContext, db, auth } from '../../Firebase'


const CreateSticker = () => {

    const [info, setInfo] = useState([])
    const [visible, setVisible] = useState(false)
    const [formValue, setFormValue] = useState({title: "", text: ""})
    const [user, setUser] = useState(auth.currentUser)

    const { userDB, setUserDB } = useContext(FirebaseContext)

    const showSticker = () => {
        setVisible(true)
      }

    const handleChange = (event) =>{
    event.persist()
    setFormValue(currentValue =>({
        ...currentValue,
        [event.target.name]: event.target.value
    }))
    }
    
    const handleSubmit = (event) => {
        setVisible(false)
        setFormValue({title: "", text: ""})
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
            .collection('stickers')
            .add({
            title: formValue.title,
            text: formValue.text,
            author: user.displayName,
            markup: Date.now()
            })
      }
    
    const handleClose = (event) => {
        console.log(event)
        setVisible(false)
    }

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('mySweetHotel')
            .doc('country')
            .collection('France')
            .doc('collection')
            .collection('users')
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

    return (
            <div>
                <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip id="title">
                    Créer un mémo
                    </Tooltip>
                }>
                <img src={Plus} alt="post-it" className="sticker_img" onClick={showSticker} />
                </OverlayTrigger>

            <Modal show={visible}
            onHide={handleClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header className="bg-light">
                <Modal.Title id="contained-modal-title-vcenter" style={{
                    diplay: "flex",
                    flexFlow: "row",
                    justifyContent: "space-between",
                    width: "100%"
                }}>
                <input value={formValue.title} name="title" type="text" placeholder="Donner un titre au mémo..." onChange={handleChange} 
                className="memo_modalTitle_input" required />
                {/*<select class="selectpicker" defaultValue={formValue.assignee} name="assignee" onChange={handleChange} 
                    style={{width: "15%", 
                    height: "3vh", 
                    border: "none", 
                    backgroundColor: "transparent", 
                    fontSize: "15px"}}>
                        <option value={formValue.assignee}>Général</option>
                        {info.map(flow => (
                            <option value={flow.id}>
                                {flow.id}
                            </option> 
                        ))}
                </select>*/}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <textarea value={formValue.text} name="text" placeholder="Ecrire un mémo..." onChange={handleChange} 
                className="memo_modalBody_textarea" required></textarea>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={handleClose}>Fermer</Button>
                <Button variant="outline-success" onClick={handleSubmit}>Epingler</Button>
            </Modal.Footer>
            </Modal>
            </div>
    )
}

export default CreateSticker