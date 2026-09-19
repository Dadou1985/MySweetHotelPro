import React, { useState, useContext } from 'react'
import { Form, Button, Table } from 'react-bootstrap'
import { functions, FirebaseContext } from '../../../../config/Firebase'
import Drawer from '@material-ui/core/Drawer'
import Switch from '@material-ui/core/Switch';
import { useTranslation } from "react-i18next"
import '../../../css/section/form/phoneForm/phonePageTemplate.css'
import InputElement from '../../../../helper/common/InputElement'
import { useFirestoreSubscription, useAdd, useSet, useUpdate, useDelete } from '../../../../utils/hooks/useFirestore'

function PhoneAdmin() {
    const { userDB } = useContext(FirebaseContext)
    const [formValue, setFormValue] = useState({username: "", email: ""})
    const [activate, setActivate] = useState(false)
    const [expand, setExpand] = useState(false)
    const [language] = useState(navigator.language || navigator.userLanguage)
    const { t } = useTranslation()

    const isMobile = window.innerWidth < 768

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

    const handleShow = () => setActivate(true)
    const handleHide = () => setActivate(false)

    const { data: info = [] } = useFirestoreSubscription(
        ['businessUsers'],
        { where: ['hotelId', '==', userDB.hotelId] }
    )

    const { mutate: notify } = useAdd()
    const { mutate: setBusinessUser } = useSet([['businessUsers']])
    const { mutate: updateUserStatus } = useUpdate([['businessUsers']])
    const { mutate: deleteBusinessUser } = useDelete([['businessUsers']])

    const createUser = functions.httpsCallable('createUser')
    const deleteUser = functions.httpsCallable('deleteUser')
    let newUid = userDB.hotelId + Date.now()

    const handleSubmit = async(event) => {
        event.preventDefault()
        //setFormValue("")
        const notif = t("msh_admin_board.a_notif")
        notify({ path: ['notifications'], data: { content: notif, hotelId: userDB.hotelId, markup: Date.now() } })
        await createUser({email: formValue.email, password: "password", username: formValue.username, uid: newUid})
        setBusinessUser({
            path: ['businessUsers', newUid],
            data: {
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
            }
        })
        handleHide()
      }

      const changeUserStatus = (documentId, status) => {
        updateUserStatus({
            path: ['businessUsers', documentId],
            data: { adminStatus: status }
        })
      }

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
                    {userDB?.adminStatus && <th>{t("msh_general.g_table.t_administrator")}</th>}
                    {expand && <th>E-mail</th>}
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                {info.map(flow =>(
                    <tr key={flow.markup}>
                    <td>{flow.username}</td>
                    {userDB?.adminStatus && <td>
                        <Switch
                            checked={flow.adminStatus}
                            onChange={() => {
                                let userStatus = !flow.adminStatus
                                return changeUserStatus(flow.id, userStatus)}}
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                    </td>}
                    {expand && <td>{flow.email}</td>}
                    <td className="bg-light"><Button variant={isMobile ? "danger" : "outline-danger"} size="sm" onClick={async()=>{
                        deleteBusinessUser({ path: ['businessUsers', flow.id] })
                        return deleteUser({uid: flow.userId})
                    }}>{isMobile ? "x": t("msh_general.g_button.b_delete")}</Button></td>
                </tr>
                ))}
                </tbody>
            </Table>
        </div>
        <Button className="btn-msh phone_submitButton" size="md" onClick={handleShow}>{t("msh_admin_board.a_phone_button.b_show_modal")}</Button>

        <Drawer anchor="bottom" open={activate} onClose={handleHide}  className="phone_container_drawer">
            <div style={{
                display: "flex",
                flexFlow: "column wrap",
                justifyContent: "space-around",
                alignItems: "center",
                padding: "5%",
                textAlign: "center"
            }}>
            <h4 className='phone_tab'>{t("msh_admin_board.a_first_tab_title")}</h4>
                <InputElement 
                containerStyle={{marginBottom: "1vh"}} 
                size="90vw"
                value={formValue.username} 
                name="username" type="text" 
                label={t("msh_admin_board.a_cowoker")} 
                placeholder={t("msh_admin_board.a_cowoker")} 
                handleChange={handleChange} 
                setFormValue={setFormValue}
                required />
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
                <InputElement 
                containerStyle={{marginBottom: "10vh"}} 
                size="90vw"
                value={formValue.email} name="email" 
                type="text" 
                label={t("msh_admin_board.a_email")} 
                placeholder={t("msh_admin_board.a_email")} 
                handleChange={handleChange} 
                setFormValue={setFormValue} 
                required />

            <Button className="btn-msh phone_submitButton" onClick={handleSubmit}>{t("msh_admin_board.a_phone_button.b_validation")}</Button>
        </div>
        </Drawer>
    </div>

    )
}

export default PhoneAdmin
