import React, { useState, useEffect } from 'react'
import { Form, Button, Table } from 'react-bootstrap'
import { db, functions } from '../../../../Firebase'
import Drawer from '@material-ui/core/Drawer'
import Switch from '@material-ui/core/Switch';
import { useTranslation } from "react-i18next"
import '../../../css/section/form/phoneForm/phonePageTemplate.css'

function PhoneAdmin({userDB}) {
    const [formValue, setFormValue] = useState({username: "", email: ""})
    const [activate, setActivate] = useState(false)
    const [info, setInfo] = useState([])
    const [expand, setExpand] = useState(false)
    const [language, setLanguage] = useState(navigator.language || navigator.userLanguage)
    const { t } = useTranslation()

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

     const handleShow = () => setActivate(true)
     const handleHide = () => setActivate(false)

    const addNotification = (notification) => {
        return db.collection('notifications')
            .add({
            content: notification,
            hotelId: userDB.hotelId,
            markup: Date.now()})
    }

    const createUser = functions.httpsCallable('createUser')
    const deleteUser = functions.httpsCallable('deleteUser')
    let newUid = userDB.hotelId + Date.now()

    const handleSubmit = async(event) => {
        event.preventDefault()
        //setFormValue("")
        const notif = t("msh_admin_board.a_notif")
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
        code_postal: userDB.code_postal,
        language: language.substring(0, 2),
        logo: userDB.logo,
        appLink: userDB.appLink,
        pricingModel: userDB.pricingModel
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
                    setInfo(snapInfo)
                });
                return unsubscribe
     },[])

    return (
        <div className="phone_container">
            <h3 className="phone_title">{t("msh_admin_board.a_phone_title")}</h3>
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
                    <th>{t("msh_general.g_table.t_username")}</th>
                    <th>{t("msh_general.g_table.t_administrator")}</th>
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
                    }}>{t("msh_general.g_button.b_delete")}</Button></td>
                </tr>
                ))}
                </tbody>
            </Table>
        </div>
        <Button variant="success" size="md" style={{position: "absolute", bottom: 0,left: 0, width: "100%", padding: "3%", borderRadius: 0}} onClick={handleShow}>{t("msh_admin_board.a_phone_button.b_show_modal")}</Button>

        <Drawer anchor="bottom" open={activate} onClose={handleHide}  className="phone_container_drawer">
            <div style={{
                display: "flex",
                flexFlow: "column wrap",
                justifyContent: "space-around",
                alignItems: "center",
                padding: "5%",
                textAlign: "center"
            }}>
            <h4 style={{marginBottom: "5vh", borderBottom: "1px solid lightgrey"}}>{t("msh_admin_board.a_first_tab_title")}</h4>
            <Form.Group controlId="formGroupName">
                <Form.Control style={{width: "80vw"}} value={formValue.username} name="username" type="text" placeholder={t("msh_admin_board.a_cowoker")} onChange={handleChange} required />
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
                <Form.Control style={{width: "80vw"}} value={formValue.email} name="email" type="text" placeholder={t("msh_admin_board.a_email")} onChange={handleChange} required />
            </Form.Group>

            <Button variant="success" onClick={handleSubmit}>{t("msh_admin_board.a_phone_button.b_validation")}</Button>
        </div>
        </Drawer>
    </div>

    )
}

export default PhoneAdmin
