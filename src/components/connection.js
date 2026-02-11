import React, { useState } from 'react'
import { auth } from '../Firebase'
import { navigate } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import { useTranslation } from "react-i18next"
import { withTrans } from '../../i18n/withTrans'
import { handleChange } from '../helper/formCommonFunctions'
import './css/section/connection.css'
import { Modal } from 'react-bootstrap'
import RegisterForm from './section/form/registerForm'
import { sha256 } from 'js-sha256'

const Connection = () => {

  const [formValue, setFormValue] = useState ({username: "", email: "", password: ""})
  const [list, setList] = useState(false)
  const [footerState, setFooterState] = useState(true)
  const [registerFormValue, setRegisterFormValue] = useState({
    firstName: "",
    lastName: "",
    email: "",
    //password: "",
    //confPassword: "",
    region: "", 
    departement: "", 
    city: "", 
    standing: "", 
    phone: "", 
    room: null, 
    code_postal: "", 
    adresse: "", 
    website: "", 
    hotelName: "", 
})
  const { t } = useTranslation()

  const handleShow = () => setList(true)
  const handleClose = () => {
      setList(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    auth.signInWithEmailAndPassword(formValue.email, formValue.password)
    .then(async(authUser) => {
      await authUser.user.updateProfile({ displayName: formValue.username})
      return navigate('singlePage')})
    .catch(error=>{
      if (error.message !== ""){
        return document.getElementById('warning').innerHTML = t("msh_connexion.c_warning")
      }else{}
    })
  }   
    
  return (
    <div className="connection_container">
        <div id="jumbo" className="bg-light">
          <StaticImage objectFit='contain' src="../svg/new-logo-msh.png" placeholder="blurred" className="connection-logo" alt="Logo" />
        </div>
        <form 
          method="post"
          className="text-center p-5"
          onSubmit={(event) => handleSubmit(event)}>  

          <input 
              data-testid="email"
              style={{zIndex: "1000"}}
              value={formValue.email}
              type="email" 
              name="email" 
              className="form-control mb-4" 
              placeholder={t('msh_connexion.c_email_maj')}
              onChange={(event) => handleChange(event, setFormValue)}
              required />

          <input 
              data-testid="password"
              value={formValue.password}
              type="password" 
              name="password" 
              className="form-control mb-4" 
              placeholder={t("msh_connexion.c_password")}
              onChange={(event) => handleChange(event, setFormValue)}
              required />

          <div data-testid="warning" id="warning"></div>

          <div style={{display: "flex", flexDirection: "column"}}>
            <button data-testid="connexion" style={{borderRadius: "100px", marginBottom: "1vh"}} className="btn btn-msh" type="submit">{t("msh_connexion.c_connexion")}</button>
            <button data-testid="test-register-button" style={{borderRadius: "100px"}} type="button" className="btn btn-msh-outline" onClick={handleShow}>{t("msh_connexion.c_create_account")}</button>
          </div>
        </form>
      <Modal show={list}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={handleClose}
        >
        <Modal.Header closeButton className="msh-bg">
            <Modal.Title id="contained-modal-title-vcenter">
            {t("msh_connexion.c_create_account")}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegisterForm handleClose={handleClose} />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default withTrans(Connection)