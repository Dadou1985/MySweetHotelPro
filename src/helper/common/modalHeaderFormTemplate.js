import React from 'react'
import { Modal } from 'react-bootstrap'

const ModalHeaderFormTemplate = ({title}) => {
  return (
    <Modal.Header closeButton className="bg-light">
        <Modal.Title id="contained-modal-title-vcenter">
        {title}
        </Modal.Title>
    </Modal.Header>
  )
}

export default ModalHeaderFormTemplate