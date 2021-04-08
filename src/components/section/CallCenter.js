import React, { useState } from 'react'
import { Form, Button, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import Assistance from '../../svg/call-center.svg'


export default function CallCenter() {
    const [list, setList] = useState(false)

    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

    return (
        <div style={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "center"
        }}>
            <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip id="title">
                            Assistance Technique
                          </Tooltip>
                        }>
                        <img src={Assistance} className="icon" alt="contact" onClick={handleShow} style={{width: "40%"}} />

                    </OverlayTrigger>

                    <Modal show={list}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={handleClose}
                    >
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title id="contained-modal-title-vcenter">
                        Feedback Box
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
            
                    <div style={{
                            display: "flex",
                            flexFlow: "column",
                            justifyContent: "space-around",
                            padding: "5%",
                            textAlign: "center"
                        }}>
                        <p>Nos équipes vous assistent au :</p>
                            <p>06.59.87.28.84</p>
                        
                        </div>
                    </Modal.Body>
                </Modal>
        </div>
    )
}
