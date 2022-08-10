import React, {useState, useEffect } from 'react'
import { Form, Button, Table, FloatingLabel } from 'react-bootstrap'
import { storage } from '../../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Drawer from '@material-ui/core/Drawer'
import Switch from '@material-ui/core/Switch';
import Close from '../../../../svg/close.svg'
import Picture from '../../../../svg/picture.svg'
import AddPhotoURL from '../../../../svg/camera.svg'
import { useTranslation } from "react-i18next"
import '../../../css/section/form/phoneForm/phonePageTemplate.css'
import { handleDeleteImg } from '../../../../helper/globalCommonFunctions'
import InputElement from '../../../../helper/common/InputElement'
import TextareaElement from '../../../../helper/common/textareaElement'
import { 
    fetchCollectionBySorting2, 
    handleSubmitData2, 
    addNotification,
    handleUpdateData2,
    handleDeleteData2
} from '../../../../helper/globalCommonFunctions'
import {
    handleChange,
    deleteData
} from '../../../../helper/formCommonFunctions'

/* 
    ! FIX => PHOTO SUBMISSION
*/

const PhoneRepair = ({userDB}) =>{

    const [formValue, setFormValue] = useState({
        room: "", 
        client: "", 
        details: "", 
        type: "", 
        url: ""
    })
    const [typeClone, setTypeClone] = useState("")
    const [info, setInfo] = useState([])
    const [activate, setActivate] = useState(false)
    const [expand, setExpand] = useState(false)
    const [img, setImg] = useState("")
    const [imgFrame, setImgFrame] = useState(false)
    const [newImg, setNewImg] = useState("")
    const [url, setUrl] = useState("")
    const { t } = useTranslation()

    const handleShow = () => setActivate(true)
    const handleHide = () => {
        setActivate(false)
        setFormValue("")
    }

    const handleImgChange = (event) => {
        if (event.target.files[0]){
            setNewImg(event.target.files[0])
        }
    }

    const notif = t("msh_maintenance.m_notif")
    const dataStatus = {status: false} 

    const newData = {
        author: userDB.username,
        date: new Date(),
        details: formValue.details,
        client: formValue.client,
        room: formValue.room,
        markup: Date.now(),
        type: formValue.type,
        typeClone: typeClone !== "" ? typeClone : t("msh_dashboard.maintenance_data.d_paint"),
        status: false,
        photo: url
    }

    const submitForm = (event) =>{
        event.preventDefault()
        if(newImg !== null) {
            const uploadTask = storage.ref(`msh-photo-lost/${newImg.name}`).put(newImg)
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {console.log(error)},
          () => {
            storage
              .ref("msh-photo-lost")
              .child(newImg.name)
              .getDownloadURL()
              .then(url => {
                const uploadTask = () => {
                    handleSubmitData2(event, "hotels", userDB.hotelId, "maintenance", newData)
                    addNotification(notif, userDB.hotelId)
                    return handleHide()
                }
                  return setUrl(url, uploadTask())})
          }
        )
        }else{
            handleSubmitData2(event, "hotels", userDB.hotelId, "maintenance", newData)
            addNotification(notif, userDB.hotelId)
            return handleHide()
        }
        
    }

    useEffect(() => {
        let unsubscribe = fetchCollectionBySorting2("hotels", userDB.hotelId, "maintenance", "markup", "asc").onSnapshot(function(snapshot) {
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

    return(
        
        <div className="phone_container">
            <h3 className="phone_title">{t("msh_maintenance.m_title")}</h3>
            <div style={{width: "90vw", overflow: "scroll", height: '100%'}}>
            {/*<div style={{display: "flex", flexFlow: "row", justifyContent: expand ? "flex-start" : "flex-end", width: "100%"}}>
                <span style={{display: "flex", flexFlow: expand ? "row-reverse" : "row"}}  onClick={handleChangeExpand}>
                {expand ? "Rétrécir" : "Agrandir"}
                {expand ? <img src={Left} style={{width: "3vw", marginRight: "1vw"}} /> : <img src={Right} style={{width: "3vw", marginLeft: "1vw"}} />}
                </span>
            </div>*/}
            {!imgFrame ? <Table striped bordered hover size="sm" className="text-center">
                    <thead className="bg-dark text-center text-light">
                        <tr>
                        <th>{t("msh_general.g_table.t_client")}</th>
                        <th>{t("msh_general.g_table.t_room")}</th>
                        <th>{t("msh_general.g_table.t_category")}</th>
                        <th>{t("msh_general.g_table.t_statut")}</th>
                        {expand && <th>Détails</th>}
                        {expand && <td>Date</td>}
                        {expand && <th>Photo</th>}
                        {expand && <td>Collaborateur</td>}
                        {expand && <th className="bg-dark"></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {info.map(flow =>(
                            <tr key={flow.id}>
                            <td>{flow.client}</td>
                            <td>{flow.room}</td>
                            <td>{flow.type}</td>
                            <td>
                            <Switch
                                checked={flow.status}
                                onChange={() => handleUpdateData2("hotels", userDB.hotelId, "maintenance", flow.id, dataStatus)}
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                            </td>
                            {expand && <td>{flow.details}</td>}
                            {expand && <td>{moment(flow.markup).format('L')}</td>}
                            {expand && <td style={{cursor: "pointer"}} onClick={() => {
                                setImg(flow.img)
                                setImgFrame(true)
                            }}>{flow.img ? <img src={Picture} style={{width: "5vw"}} /> : "Aucune"}</td>}
                            {expand && <td>{flow.author}</td>}
                            {expand && <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
                                if(flow.img){
                                    handleDeleteImg(flow.img)
                                }
                                return handleDeleteData2("hotels", userDB.hotelId, "maintenance", flow.id)
                            }}>{t("msh_general.g_button.b_delete")}</Button></td>}
                            </tr>
                        ))}
                    </tbody>
                </Table> : 
                    <div style={{
                        display: "flex",
                        flexFlow: 'column',
                        alignItems: "center",
                        padding: "2%"
                    }}>
                        <div style={{width: "100%"}}>
                            <img src={Close} style={{width: "5vw", float: "right", cursor: "pointer", marginBottom: "2vh"}} onClick={() => setImgFrame(false)} /> 
                        </div>
                        <img src={img} style={{width: "90%"}} />
                    </div>}
            </div>
            <Button variant="success" size="md" style={{position: "absolute", bottom: 0,left: 0, width: "100%", padding: "3%", borderRadius: 0}} onClick={handleShow}>{t("msh_maintenance.m_phone_button.b_show_modal")}</Button>
            
            <Drawer anchor="bottom" open={activate} onClose={handleHide}  className="phone_container_drawer">
                <div  className="phone_container_drawer">
                <h4 style={{marginBottom: "5vh", borderBottom: "1px solid lightgrey"}}>{t("msh_maintenance.m_phone_button.b_show_modal")}</h4>
                <InputElement
                    containerStyle={{marginBottom: "2vh"}} 
                    label={t("msh_maintenance.m_client")}
                    placeholder="ex: Jane Doe"
                    size="90vw"
                    value={formValue.client}
                    name="client"
                    handleChange={handleChange}
                    setFormValue={setFormValue}
                />
                <InputElement
                    containerStyle={{marginBottom: "2vh"}} 
                    label={t("msh_maintenance.m_room")}
                    placeholder="ex: 409"
                    size="90vw"
                    value={formValue.room}
                    name="room"
                    handleChange={handleChange}
                    setFormValue={setFormValue}
                />
                <div>
                    <Form.Group controlId="exampleForm.SelectCustom">
                    <FloatingLabel
                        controlId="floatingInput"
                        label={t("msh_maintenance.m_type.t_label")}
                        className="mb-3"
                    >                    
                    <select class="selectpicker" value={formValue.type} name="type" onChange={(event) => handleChange(event, setFormValue)} 
                    className="phonePage_select">
                        <option></option>
                        <option value="paint" onClick={() => setTypeClone(t("msh_dashboard.maintenance_data.d_paint"))}>{t("msh_dashboard.maintenance_data.d_paint")}</option>
                        <option value="electricity" onClick={() => setTypeClone(t("msh_dashboard.maintenance_data.d_electricity"))}>{t("msh_dashboard.maintenance_data.d_electricity")}</option>
                        <option value="plumbery" onClick={() => setTypeClone(t("msh_dashboard.maintenance_data.d_plumbery"))}>{t("msh_dashboard.maintenance_data.d_plumbery")}</option>
                        <option value="cleaning" onClick={() => setTypeClone(t("msh_dashboard.maintenance_data.d_cleaning"))}>{t("msh_dashboard.maintenance_data.d_cleaning")}</option>
                        <option value="others" onClick={() => setTypeClone(t("msh_dashboard.maintenance_data.d_others"))}>{t("msh_dashboard.maintenance_data.d_others")}</option>
                    </select>
                    </FloatingLabel>
                </Form.Group>
                </div>
                <div>
                <TextareaElement
                    label={t("msh_maintenance.m_details")}
                    row="2"
                    value={formValue.details} 
                    name="details" 
                    handleChange={handleChange}
                    setFormValue={setFormValue}
                    size={{width: "90vw", maxHeight: "15vh"}}
                />
                </div>
                <div style={{marginBottom: "3vh", display: "flex", flexFlow: 'row', justifyContent: "center", alignItems: "center", width: "100%"}}>
                    <input type="file" className="phone-camera-icon"
                        onChange={handleImgChange} />
                    <img src={AddPhotoURL} className="modal-note-file-icon" alt="uploadIcon" />
                    <span style={{marginLeft: "2vw"}}>{t("msh_general.g_button.b_add_photo")}</span>
                </div>
            <Button variant="success" className="phone_submitButton" onClick={(event) => {
                submitForm(event)
                }}>{t("msh_maintenance.m_phone_button.b_validation")}</Button>
            </div>
        </Drawer>
    </div>
                            
    )
}

export default PhoneRepair