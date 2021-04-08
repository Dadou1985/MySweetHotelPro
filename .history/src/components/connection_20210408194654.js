import React, { useState, useContext, useEffect } from 'react'
import { Jumbotron, Modal } from 'react-bootstrap'
import { FirebaseContext, db, auth } from '../Firebase'
import Register from '../components/section/form/register'
import { navigate } from 'gatsby'


const Connection = () =>{

  const [list, setList] = useState(false)
  const [formValue, setFormValue] = useState ({usernameemail: "", password: ""})
  
     
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
        .then(() => navigate('singlePage'))
        .catch(error=>{
          if (error.message !== ""){
            return document.getElementById('warning').innerHTML = "Vos identifiants sont erronés !"
          }else{}
        })
      }   

    const handleShow = () => setList(true)
    const handleClose = () => setList(false)
    
    return (
        <div className="connection_container">
            <div id="jumbo" fluid className="bg-info">
            <h2 className="connection_title">My<br/>Sweet<br/>Hotel</h2>
            <h2 className="connection_title_firstWord">Pro</h2>
            </div>
            <form 
              method="post"
              className="text-center p-5"
              onSubmit={(event) => handleSubmit(event)}>


            <input 
                value={formValue.email}
                type="email" 
                name="email" 
                className="form-control mb-4" 
                placeholder="Email"
                onChange={handleChange}
                required />

            <input 
                value={formValue.password}
                type="password" 
                name="password" 
                className="form-control mb-4" 
                placeholder="Password"
                onChange={handleChange}
                required />

            <div id="warning"></div>

            <button className="btn btn-info btn-block my-4" type="submit">Connecter</button>
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