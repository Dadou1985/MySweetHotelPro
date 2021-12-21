import React, { useState } from 'react'
import { auth } from '../Firebase'
import { navigate } from 'gatsby'
import Logo from '../svg/new-logo-msh-pro2.png'
import MshLogo from '../svg/msh-newLogo-transparent.png'
import MshLogoPro from '../svg/mshPro-newLogo-transparent.png'

const Connection = () => {

  const [formValue, setFormValue] = useState ({username: "", email: "", password: ""})
     
      const handleChange = (event) =>{
        event.persist()
        document.getElementById('warning').innerHTML = ""
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

     const handleSubmit = (event) => {
        event.preventDefault()
        auth.signInWithEmailAndPassword(formValue.email, formValue.password)
        .then(async(authUser) => {
          await authUser.user.updateProfile({ displayName: formValue.username})
          return navigate('singlePage')})
        .catch(error=>{
          if (error.message !== ""){
            return document.getElementById('warning').innerHTML = "Vos identifiants sont erronés !"
          }else{}
        })
      }   
    
    return (
        <div className="connection_container">
            <div id="jumbo" fluid className="bg-light">
            <img src={Logo} className="connection-logo" />
            </div>
            <form 
              method="post"
              className="text-center p-5"
              onSubmit={(event) => handleSubmit(event)}>

            {/*<input 
                value={formValue.username}
                type="text" 
                name="username" 
                className="form-control mb-4" 
                placeholder="Nom d'utilisateur"
                onChange={handleChange}
            required />*/}   

            <input 
                value={formValue.email}
                type="email" 
                name="email" 
                className="form-control mb-4" 
                placeholder="E-mail"
                onChange={handleChange}
                required />

            <input 
                value={formValue.password}
                type="password" 
                name="password" 
                className="form-control mb-4" 
                placeholder="Mot de passe"
                onChange={handleChange}
                required />

            <div id="warning"></div>

            <button className="btn btn-info btn-block my-4" type="submit">Se connecter</button>
            </form>
            {/*<Modal show={list}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleClose}
                >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                Formulaire d'inscription
                </Modal.Title>
            </Modal.Header>
            {!!firebase &&  
            <Register firebase={firebase} hide={handleClose} />}
            </Modal>*/}
        </div>
    )
}

export default Connection