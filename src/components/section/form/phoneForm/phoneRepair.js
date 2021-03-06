import React, {useState, useEffect } from 'react'
import { Form, Button, Table } from 'react-bootstrap'
import { storage, db } from '../../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Drawer from '@material-ui/core/Drawer'
import Switch from '@material-ui/core/Switch';
import Close from '../../../../svg/close.svg'
import Picture from '../../../../svg/picture.svg'
import AddPhotoURL from '../../../../svg/camera.svg'
import { useTranslation } from "react-i18next"
import '../../../css/section/form/phoneForm/phonePageTemplate.css'

const PhoneRepair = ({userDB}) =>{

    const [formValue, setFormValue] = useState({room: "", client: "", details: "", type: "", url: ""})
    const [info, setInfo] = useState([])
    const [activate, setActivate] = useState(false)
    const [expand, setExpand] = useState(false)
    const [img, setImg] = useState("")
    const [imgFrame, setImgFrame] = useState(false)
    const [newImg, setNewImg] = useState("")
    const [url, setUrl] = useState("")
    const { t, i18n } = useTranslation()

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

      const handleImgChange = (event) => {
        if (event.target.files[0]){
            setNewImg(event.target.files[0])
        }
    }

      const addNotification = (notification) => {
        return db.collection('notifications')
            .add({
            content: notification,
            hotelId: userDB.hotelId,
            markup: Date.now()})
    }

      const addTechnicalProblem = (event, photo) => {
        event.preventDefault()
        setFormValue("")
        const notif = t("msh_maintenance.m_notif") 
        addNotification(notif)
        return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('maintenance')
            .add({
            author: userDB.username,
            date: new Date(),
            details: formValue.details,
            client: formValue.client,
            room: formValue.room,
            markup: Date.now(),
            type: formValue.type,
            status: false,
            img: photo
            })
    }

    const handleSubmit = (event) =>{
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
                    addTechnicalProblem(event, url)
                }
                  return setUrl(url, uploadTask())})
          }
        )
        }else{
            addTechnicalProblem(event)
        }
        
    }

    const changeIssueStatus = (document) => {
        return db.collection('hotels')
          .doc(userDB.hotelId)
          .collection('maintenance')
          .doc(document)
          .update({
            status: false,
        })      
      }

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('maintenance')
            .orderBy("markup", "asc")
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

     const handleDeleteImg = (imgId) => {
        const storageRef = storage.refFromURL(imgId)
        const imageRef = storage.ref(storageRef.fullPath)

        imageRef.delete()
        .then(() => {
            console.log(`${imgId} has been deleted succesfully`)
        })
        .catch((e) => {
            console.log('Error while deleting the image ', e)
        })
      }

     const handleShow = () => setActivate(true)
     const handleHide = () => setActivate(false)

    return(
        
        <div className="phone_container">
            <h3 className="phone_title">{t("msh_maintenance.m_title")}</h3>
            <div style={{width: "90vw", overflow: "scroll", height: '100%'}}>
            {/*<div style={{display: "flex", flexFlow: "row", justifyContent: expand ? "flex-start" : "flex-end", width: "100%"}}>
                <span style={{display: "flex", flexFlow: expand ? "row-reverse" : "row"}}  onClick={handleChangeExpand}>
                {expand ? "R??tr??cir" : "Agrandir"}
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
                        {expand && <th>D??tails</th>}
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
                                onChange={() => changeIssueStatus(flow.id)}
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
                                return db.collection('hotels')
                                .doc(userDB.hotelId)
                                .collection("maintenance")
                                .doc(flow.id)
                                .delete()
                                .then(function() {
                                    console.log("Document successfully deleted!");
                                }).catch(function(error) {
                                    console.log(error);
                                });
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
                    <div>
                        <Form.Group controlId="description" className="phone_input">
                        <Form.Label>{t("msh_maintenance.m_client")}</Form.Label>
                        <Form.Control type="text" placeholder="ex: Jane Doe" value={formValue.client} name="client" onChange={handleChange} />
                        </Form.Group>
                    </div>
                    <div>
                        <Form.Group controlId="description" className="phone_input">
                        <Form.Label>{t("msh_maintenance.m_room")}</Form.Label>
                        <Form.Control type="text" placeholder="ex: 409" value={formValue.room} name="room" onChange={handleChange} />
                        </Form.Group>
                    </div>
                    <div>
                        <Form.Group controlId="exampleForm.SelectCustom">
                        <Form.Label>{t("msh_maintenance.m_type.t_label")}</Form.Label><br/>
                        <select class="selectpicker" value={formValue.type} name="type" onChange={handleChange} 
                        className="phonePage_select">
                            <option></option>
                            <option>{t("msh_room_change.r_reason.r_paint")}</option>
                            <option>{t("msh_room_change.r_reason.r_plumbery")}</option>
                            <option>{t("msh_room_change.r_reason.r_electricity")}</option>
                            <option>{t("msh_room_change.r_reason.r_cleaning")}</option>
                            <option>{t("msh_room_change.r_reason.r_other")}</option>
                        </select>
                    </Form.Group>
                    </div>
                    <div>
                        <Form.Group controlId="details" className="phone_textarea">
                            <Form.Label>{t("msh_maintenance.m_details")}</Form.Label>
                            <Form.Control as="textarea" rows="2" value={formValue.details} name="details" onChange={handleChange}  />
                        </Form.Group>
                    </div>
                    <div style={{marginBottom: "3vh", display: "flex", flexFlow: 'row', justifyContent: "center", alignItems: "center", width: "100%"}}>
                        <input type="file" className="phone-camera-icon"
                            onChange={handleImgChange} />
                        <img src={AddPhotoURL} className="modal-note-file-icon" alt="uploadIcon" />
                        <span style={{marginLeft: "2vw"}}>{t("msh_general.g_button.b_add_photo")}</span>
                    </div>
                <Button variant="success" className="phone_submitButton" onClick={(event) => {
                    handleSubmit(event)
                    setActivate(false)
                    }}>{t("msh_maintenance.m_phone_button.b_validation")}</Button>
                </div>
            </Drawer>
            </div>
                            
    )
}

export default PhoneRepair