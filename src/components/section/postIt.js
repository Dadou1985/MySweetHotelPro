import React, {useState, useEffect, useContext } from 'react'
import Stick from '../../svg/paper-color.svg'
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FirebaseContext, db, auth } from '../../Firebase'
import Avatar from 'react-avatar'
import  '../css/post-it.css'

const PostIt = ({title, text, markup, assignee}) => {

    const [visible, setVisible] = useState(false)
    const [user, setUser] = useState(auth.currentUser)

    const { userDB, setUserDB } = useContext(FirebaseContext)

    const showSticker = () => {
        setVisible(true)
      }
    
    const removeSticker = (event) => {
        console.log(event)
        setVisible(false)
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
            .doc(markup)
            .delete()      
      }
    
    const handleClose = () => {
        setVisible(false)
      }
    
      if(assignee){
        return (
          <div style={{
              width: "12%",
              height: "10vh",
              marginRight: "1vw"
          }}>
          <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="intitulé">
              {title}
            </Tooltip>
          }>
            <img src={Stick} alt="stick" className="stick" onClick={showSticker} style={{
                  width: "100%",
                  height: "100%",
                  cursor: "pointer"
              }} />
            
          </OverlayTrigger>
          <Avatar 
              name={assignee}
              round={true}
              size="30"
              color={'#'+(Math.random()*0xFFFFFF<<0).toString(16)}
              style={{position: "relative", bottom: "50%"}}
                />
          <Modal show={visible} onClick={handleClose}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered>
            <Modal.Header closeButton className="bg-light">
              <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{text}</Modal.Body>
            <Modal.Footer>
              <Button variant="outline-danger" onClick={removeSticker}>
                Jeter
              </Button>
              <Button variant="success" onClick={handleClose}>
                Fermer
              </Button>
            </Modal.Footer>
          </Modal>
          </div>)
      }else{
        return (
          <div style={{
              width: "12%",
              height: "10vh",
              marginRight: "1vw"
          }}>
          <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="intitulé">
              {title}
            </Tooltip>
          }>
            <img src={Stick} alt="stick" className="stick" onClick={showSticker} style={{
                  width: "100%",
                  height: "100%",
                  cursor: "pointer"
              }} />
            
          </OverlayTrigger>
          <Modal show={visible} onClick={handleClose}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered>
            <Modal.Header closeButton className="bg-light">
              <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{text}</Modal.Body>
            <Modal.Footer>
              <Button variant="outline-danger" onClick={removeSticker}>
                Jeter
              </Button>
              <Button variant="success" onClick={handleClose}>
                Fermer
              </Button>
            </Modal.Footer>
          </Modal>
          </div>)
      }
    
    
}

export default PostIt