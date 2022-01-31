import React, {useState } from 'react'
import Stick from '../../images/postIt.png'
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { db } from '../../Firebase'
import Avatar from 'react-avatar'
import  '../css/post-it.css'

const PostIt = ({author, title, text, markup, userDB}) => {

    const [visible, setVisible] = useState(false)

    const showSticker = () => {
        setVisible(true)
      }
    
    const removeSticker = (event) => {
        console.log(event)
        setVisible(false)
        return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('stickers')
            .doc(markup)
            .delete()      
      }
    
    const handleClose = () => {
        setVisible(false)
      }
    
      
  return (
    <div style={{
        width: "12%",
        height: "10vh",
        marginRight: "3vw"
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
      name={author}
      round={true}
      size="30"
      color={Avatar.getRandomColor('sitebase', ['red', 'green', 'blue'])}
      style={{position: "relative", bottom: "50%"}}
    />
    <Modal show={visible} onClick={handleClose}
    size="md"
    aria-labelledby="contained-modal-title-vcenter"
    centered>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <p>{text}</p>
          <h6 style={{float: "right"}}>{author}</h6>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={removeSticker}>
          Jeter
        </Button>
        <Button variant="success" onClick={handleClose}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  )
}

export default PostIt