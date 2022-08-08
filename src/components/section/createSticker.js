import React, {useState } from 'react'
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { db } from '../../Firebase'
import { useTranslation } from "react-i18next"
import '../css/section/createSticker.css'
import { StaticImage } from 'gatsby-plugin-image'

const CreateSticker = ({userDB}) => {

    const [visible, setVisible] = useState(false)
    const [formValue, setFormValue] = useState({title: "", text: ""})
    const { t } = useTranslation()

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
    
    const handleSubmit = () => {
        setVisible(false)
        setFormValue({title: "", text: ""})
        return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('stickers')
            .add({
            title: formValue.title,
            text: formValue.text,
            author: userDB.username,
            markup: Date.now()
            })
      }
    
    const handleClose = (event) => {
        setVisible(false)
    }

    return (
            <div>
                <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip id="title">
                    {t("msh_memo.m_create_sticker.s_tooltip")}
                    </Tooltip>
                }>
                <StaticImage src='../../images/postItPlus.png' placeholder="blurred" alt="post-it" className="sticker_img" onClick={showSticker} />
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
                <input value={formValue.title} name="title" type="text" placeholder={t("msh_memo.m_create_sticker.s_title")} onChange={handleChange} 
                className="sticker_modalTitle_input" required />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <textarea value={formValue.text} name="text" placeholder={t("msh_memo.m_create_sticker.s_body")} onChange={handleChange} 
                className="sticker_modalBody_textarea" required></textarea>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={handleClose}>{t("msh_memo.m_create_sticker.s_close_button")}</Button>
                <Button variant="outline-success" onClick={handleSubmit}>{t("msh_memo.m_create_sticker.s_stick_button")}</Button>
            </Modal.Footer>
            </Modal>
            </div>
    )
}

export default CreateSticker