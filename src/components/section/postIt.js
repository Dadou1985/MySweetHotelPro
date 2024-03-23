import React, {useState } from 'react'
import Stick from '../../images/postIt.png'
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { db } from '../../Firebase'
import Avatar from 'react-avatar'
import  '../css/section/post-it.css'
import { useTranslation } from "react-i18next"
import { StaticImage } from 'gatsby-plugin-image'

const PostIt = ({author, title, text, markup, userDB}) => {

    const [visible, setVisible] = useState(false)
    const { t } = useTranslation()

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
        width: "10%",
        height: "8vh",
        marginRight: "3vw"
    }}>
    <OverlayTrigger
    placement="top"
    overlay={
      <Tooltip id="intitulé">
        {title}
      </Tooltip>
    }>
      <div onClick={showSticker}>
        <StaticImage objectFit='contain' placeholder='blurred' src='../../images/postIt.png' alt="stick" className="stick" style={{
            width: "100%",
            height: "100%",
            cursor: "pointer"
        }} />
      </div>
      
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
          {t("msh_memo.m_post_it.p_remove_button")}
        </Button>
        <Button variant="success" onClick={handleClose}>
        {t("msh_memo.m_create_sticker.s_close_button")}
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  )
}

export default PostIt