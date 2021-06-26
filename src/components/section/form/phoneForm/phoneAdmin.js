import React, { useState, useEffect } from 'react'
import { Form, Button, Table } from 'react-bootstrap'
import { auth, db, functions } from '../../../../Firebase'
import Drawer from '@material-ui/core/Drawer'
import Left from '../../../../svg/arrow-left.svg'
import Right from '../../../../svg/arrow-right.svg'
import Switch from '@material-ui/core/Switch';

function PhoneAdmin({user, userDB}) {
    const [formValue, setFormValue] = useState({username: "", email: ""})
    const [activate, setActivate] = useState(false)
    const [info, setInfo] = useState([])
    const [expand, setExpand] = useState(false)

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

      const handleChangeExpand = () => setExpand(!expand)

     const handleShow = () => setActivate(true)
     const handleHide = () => setActivate(false)

    const resetPassword = () => {
        return auth.sendPasswordResetEmail(formValue.email).then(function() {
        }).catch(function(error) {
        });
    }

    const addNotification = (notification) => {
        return db.collection('notifications')
            .add({
            content: notification,
            hotelId: userDB.hotelId,
            markup: Date.now()})
            .then(doc => console.log('nouvelle notitfication'))
    }

    const createUser = functions.httpsCallable('createUser')
    const deleteUser = functions.httpsCallable('deleteUser')
    let newUid = userDB.hotelId + Date.now()

    const handleSubmit = async(event) => {
        event.preventDefault()
        //setFormValue("")
        const notif = "Vous venez de créer un compte collaborateur !" 
        addNotification(notif)
        await createUser({email: formValue.email, password: "password", username: formValue.username, uid: newUid})
        return db.collection('businessUsers')
        .doc(newUid)
        .set({  
        username: formValue.username,  
        adminStatus: false, 
        email: formValue.email,
        password: "password",
        hotelId: userDB.hotelId,
        hotelName: userDB.hotelName,
        hotelRegion: userDB.hotelRegion,
        hotelDept: userDB.hotelDept,
        createdAt: Date.now(),
        userId: newUid,
        city: userDB.city,
        country: userDB.country,
        room: userDB.room,
        classement: userDB.classement,
        code_postal: userDB.codePostal
        }) 
        .then(handleHide())
      }

      const changeUserStatus = (documentId, status) => {
        return db.collection('businessUsers')
          .doc(documentId)
          .update({
            adminStatus: status,
        })      
      }

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('businessUsers')
            .where("hotelId", "==", userDB.hotelId)
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
        <div className="phone_container">
            <h3 className="phone_title">Liste des collaborateurs</h3>
            <div style={{width: "90vw", overflow: "scroll", height: '100%'}}>
            {/*<div style={{display: "flex", flexFlow: "row", justifyContent: expand ? "flex-start" : "flex-end", width: "100%"}}>
                <span style={{display: "flex", flexFlow: expand ? "row-reverse" : "row"}}  onClick={handleChangeExpand}>
                {expand ? "Rétrécir" : "Agrandir"}
                {expand ? <img src={Left} style={{width: "3vw", marginRight: "1vw"}} /> : <img src={Right} style={{width: "3vw", marginLeft: "1vw"}} />}
                </span>
            </div>*/}
            <Table striped bordered hover>
                <thead className="bg-dark text-center text-light">
                    <tr>
                    <th>Pseudo</th>
                    <th>Admin</th>
                    {expand && <th>E-mail</th>}
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                {info.map(flow =>(
                    <tr key={flow.markup}>
                    <td>{flow.username}</td>
                    <td>
                        <Switch
                            checked={flow.adminStatus}
                            onChange={() => {
                                let userStatus = !flow.adminStatus
                                return changeUserStatus(flow.id, userStatus)}}
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    </td>
                    {expand && <td>{flow.email}</td>}
                    <td className="bg-light"><Button variant="outline-danger" size="sm" onClick={async()=>{
                        await db.collection('businessUsers')
                        .doc(flow.id)
                        .delete()
                        .then(function() {
                          console.log("Document successfully deleted!");
                        }).catch(function(error) {
                            console.log(error);
                        })

                        return deleteUser({uid: flow.userId})
                    }}>Supprimer</Button></td>
                </tr>
                ))}
                </tbody>
            </Table>
        </div>
        <Button variant="success" size="md" style={{position: "absolute", bottom: 0,left: 0, width: "100%", padding: "3%"}} onClick={handleShow}>Ajouter un collaborateur</Button>

        <Drawer anchor="bottom" open={activate} onClose={handleHide}  className="phone_container_drawer">
            <div style={{
                display: "flex",
                flexFlow: "column wrap",
                justifyContent: "space-around",
                alignItems: "center",
                padding: "5%",
                textAlign: "center"
            }}>
            <h4 style={{marginBottom: "5vh", borderBottom: "1px solid lightgrey"}}>Créér un compte collaborateur</h4>
            <Form.Group controlId="formGroupName">
                <Form.Control style={{width: "80vw"}} value={formValue.username} name="username" type="text" placeholder="Prénom et Nom du collaborateur" onChange={handleChange} required />
            </Form.Group>
            {/*<Form.Group controlId="formGroupEmail">
                <Form.Control style={{width: "20vw"}} value={formValue.email} name="email" type="email" placeholder="Entrer un email" onChange={handleChange} required />
            </Form.Group>
            <Form.Group controlId="formGroupPassword">
                <Form.Control style={{width: "20vw"}} value={formValue.password} name="password" type="password" placeholder="Entrer un mot de passe" onChange={handleChange} required />
            </Form.Group>
            {!!errorMessage && <div id="wrongConf" style={{color: 'red', textAlign: 'center'}}>{errorMessage}</div>}
            <Form.Group controlId="formGroupConfPassword">
                <Form.Control style={{width: "20vw"}} value={formValue.confPassword} name="confPassword" type="password" placeholder="Confirmer le mot de passe" onChange={handleChange} required />
            </Form.Group>*/}
            <Form.Group controlId="formGroupRefHotel">
                <Form.Control style={{width: "80vw"}} value={formValue.email} name="email" type="text" placeholder="E-mail du collaborateur" onChange={handleChange} required />
            </Form.Group>

            <Button variant="success" onClick={handleSubmit}>Créér un compte maintenant</Button>
        </div>
        </Drawer>
    </div>

    )
}

export default PhoneAdmin
