import React, {useState, useEffect } from 'react'
import { Form, Button, Table } from 'react-bootstrap'
import { Input } from 'reactstrap'
import { db, storage } from '../../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Drawer from '@material-ui/core/Drawer'
import Switch from '@material-ui/core/Switch';
import Close from '../../../../svg/close.svg'
import Picture from '../../../../svg/picture.svg'
import { useTranslation } from "react-i18next"
import '../../../css/section/form/phoneForm/phonePageTemplate.css'

const PhoneMaid = ({userDB}) =>{

    const [formValue, setFormValue] = useState({client: "", details: "", fromRoom: "", toRoom: null, reason: "", state: ""})
    const [info, setInfo] = useState([])
    const [activate, setActivate] = useState(false)
    const [expand, setExpand] = useState(false)
    const [img, setImg] = useState("")
    const [imgFrame, setImgFrame] = useState(false)
    const [newRoom, setNewRoom] = useState(false)
    const [roomState, setRoomState] = useState(false)
    const [currentRoom, setCurrentRoom] = useState("")
    const [guestId, setGuestId] = useState("")
    const [reasonBack, setReasonBack] = useState(null)
    const [stateClone, setStateClone] = useState(null)
    const { t } = useTranslation()

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

      const addNotification = (notification) => {
        return db.collection('notifications')
            .add({
            content: notification,
            hotelId: userDB.hotelId,
            markup: Date.now()})
            .then(doc => console.log('nouvelle notitfication'))
    }

      const handleSubmit = event => {
        event.preventDefault()
        setFormValue("")
        const notif = t("msh_room_change.r_notif")  
        addNotification(notif)
        return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('roomChange')
            .add({
            author: userDB.username,
            date: new Date(),
            details: formValue.details,
            client: formValue.client,
            fromRoom: formValue.fromRoom,
            markup: Date.now(),
            toRoom: formValue.toRoom,
            reason: formValue.reason,
            reasonClone: reasonBack !== null ? reasonBack : t("msh_room_change.r_reason.r_noise"),
            state: formValue.state,
            stateClone: stateClone !== null ? stateClone : t("msh_room_change.r_state.s_dirty"),
            status: false
            })
    }

    const changeDemandStatus = (document) => {
        return db.collection('hotels')
          .doc(userDB.hotelId)
          .collection('roomChange')
          .doc(document)
          .update({
            status: false,
        })      
      }

    const handleUpdateRoom = (demandId) => {
        setFormValue("")
        return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('roomChange')
            .doc(demandId)
            .update({
                toRoom: formValue.toRoom,
            })
    }

    const handleUpdateRoomState = (demandId) => {
        setFormValue("")
        return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('roomChange')
            .doc(demandId)
            .update({
                state: formValue.state
            })
    }

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('roomChange')
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
                    console.log(snapInfo)
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

     console.log("TOROOM", formValue.toRoom)
     

    return(
        
        <div className="phone_container">
            <h3 className="phone_title">{t("msh_room_change.r_title")}</h3>
            <div style={{width: "90vw", overflow: "scroll", height: '100%'}}>
            {/*<div style={{display: "flex", flexFlow: "row", justifyContent: expand ? "flex-start" : "flex-end", width: "100%"}}>
                <span style={{display: "flex", flexFlow: expand ? "row-reverse" : "row"}}  onClick={handleChangeExpand}>
                {expand ? "R??tr??cir" : "Agrandir"}
                {expand ? <img src={Left} style={{width: "3vw", marginRight: "1vw"}} /> : <img src={Right} style={{width: "3vw", marginLeft: "1vw"}} />}
                </span>
            </div>*/}
            {!imgFrame ? <Table striped bordered hover size="sm" className="text-center"  style={{overflowX: "auto",
                        maxWidth: "90vw"}}>
                    <thead className="bg-dark text-center text-light">
                        <tr>
                        {expand && <th>Client</th>}
                        <th>{t("msh_general.g_table.t_from")}</th>
                        <th>{t("msh_general.g_table.t_to")}</th>
                        {expand && <th>Motif</th>}
                        <th>{t("msh_general.g_table.t_state")}</th>
                        <th>{t("msh_general.g_table.t_statut")}</th>
                        {expand && <th>Details</th>}
                        {expand && <td>Date</td>}
                        {expand && <th>Photo</th>}
                        {expand && <th>Collaborateur</th>}
                        {expand && <th className="bg-dark"></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {info.map(flow =>(
                            <tr key={flow.id}>
                            {expand && <td>{flow.client}</td>}
                            <td>{flow.fromRoom}</td>
                            {flow.toRoom === "" ? 
                                <td><Button variant="warning" size="sm" style={{width: "100%"}} onClick={() => {
                                    setCurrentRoom(flow.id)
                                    setGuestId(flow.userId)
                                    setNewRoom(true)}}>{t("msh_room_change.r_action.a_attribute")}</Button></td> : 
                                <td>{flow.toRoom}</td>}
                            {flow.state === "" ? 
                                <td><Button variant="warning" size="sm" style={{width: "100%"}} onClick={() => {
                                    setRoomState(true)
                                    setCurrentRoom(flow.id)
                                }}>{t("msh_room_change.r_action.a_check")}</Button></td>
                                : <td>{flow.state}</td>}
                            {expand && <td>{flow.reason}</td>}
                            <td>
                            <Switch
                                checked={flow.status}
                                onChange={() => changeDemandStatus(flow.id)}
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                            </td>
                            {expand && <td>{flow.details}</td>}
                            {expand && <td>{moment(flow.markup).format('L')}</td>}
                            {expand && <td style={{cursor: "pointer"}} onClick={() => {
                                setImg(flow.img)
                                setImgFrame(true)
                            }}>{flow.img ? <img src={Picture} style={{width: "5vw"}} /> : t("msh_room_change.r_photo_state")}</td>}
                            {expand && <td>{flow.author}</td>}
                            {expand && <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
                                if(flow.img){
                                    handleDeleteImg(flow.img)
                                }
                                return db.collection('hotels')
                                .doc(userDB.hotelId)
                                .collection("roomChange")
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
                </Table>: 
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
                <Button variant="success" size="md" style={{position: "absolute", bottom: 0,left: 0, width: "100%", padding: "3%"}} onClick={handleShow}>{t("msh_room_change.r_phone_button.b_show_modal")}</Button>
           
                <Drawer anchor="bottom" open={activate} onClose={handleHide}  className="phone_container_drawer">
                    <div  className="phone_container_drawer">
                    <h4 style={{marginBottom: "5vh", borderBottom: "1px solid lightgrey"}}>{t("msh_room_change.r_phone_button.b_show_modal")}</h4>
                <div>
                    <Form.Group controlId="description" className="phone_input">
                    <Form.Label>{t("msh_room_change.r_client")}</Form.Label>
                    <Form.Control type="text" placeholder="ex: Jane Doe" value={formValue.client} name="client" onChange={handleChange} />
                    </Form.Group>
                </div>
                <div style={{display: "flex", flexFlow: "row", justifyContent: "space-between", width: "90vw"}}>
                    <Form.Group controlId="description" className="phone_smallInput">
                    <Form.Label>{t("msh_room_change.r_from")}</Form.Label>
                    <Form.Control type="text" placeholder="ex: 310" value={formValue.fromRoom} name="fromRoom" onChange={handleChange} />
                    </Form.Group>

                    <Form.Group controlId="description" className="phone_smallInput">
                    <Form.Label>{t("msh_room_change.r_to")}</Form.Label>
                    <Form.Control type="text" placeholder="ex: 409" value={formValue.toRoom} name="toRoom" onChange={handleChange} />
                    </Form.Group>
                </div>
                <div>
                    <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>{t("msh_room_change.r_reason.r_label")}</Form.Label><br/>
                    <Form.Select class="Form.Selectpicker" value={formValue.reason} name="reason" onChange={handleChange} 
                    className="phonePage_select">
                        <option value="noise" onClick={() => setReasonBack(t("msh_room_change.r_reason.r_noise"))}>{t("msh_room_change.r_reason.r_noise")}</option>
                        <option value="temperature" onClick={() => setReasonBack(t("msh_room_change.r_reason.r_temperature"))}>{t("msh_room_change.r_reason.r_temperature")}</option>
                        <option value="maintenance" onClick={() => setReasonBack(t("msh_room_change.r_reason.r_maintenance"))}>{t("msh_room_change.r_reason.r_maintenance")}</option>
                        <option value="cleaning" onClick={() => setReasonBack(t("msh_room_change.r_reason.r_cleaning"))}>{t("msh_room_change.r_reason.r_cleaning")}</option>
                        <option value="others" onClick={() => setReasonBack(t("msh_room_change.r_reason.r_others"))}>{t("msh_room_change.r_reason.r_others")}</option>
                    </Form.Select>
                </Form.Group>
                </div>
                <div>
                    <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>{t("msh_room_change.r_state.s_label")}</Form.Label><br/>
                    <Form.Select class="selectpicker" value={formValue.state} name="state" onChange={handleChange} 
                    className="phonePage_select">
                        <option value="dirty" onClick={() => setStateClone(t("msh_room_change.r_state.s_dirty"))}>{t("msh_room_change.r_state.s_dirty")}</option>
                        <option value="clean" onClick={() => setStateClone(t("msh_room_change.r_state.s_clean"))}>{t("msh_room_change.r_state.s_clean")}</option>
                    </Form.Select>
                    </Form.Group>
                </div>
                <div>
                    <Form.Group controlId="details" className="phone_textarea">
                        <Form.Label>{t("msh_room_change.r_details")}</Form.Label>
                        <Form.Control as="textarea" rows="2" value={formValue.details} name="details" onChange={handleChange}  />
                    </Form.Group>
                </div>
                    <Button variant="success" className="phone_submitButton" onClick={(event) => {
                        handleSubmit(event)
                        setActivate(false)
                        }}>{t("msh_room_change.r_phone_button.b_validation")}</Button>
                    </div>
                </Drawer>

                <Drawer anchor="bottom" open={newRoom} onClose={() => setNewRoom(false)}  className="phone_container_drawer">
                    <div className="phone_container_drawer">
                        <h6 style={{textAlign: "center", width: "100%", fontWeight: "bold"}}>{t("msh_room_change.r_action.a_attribute_room")}</h6>
                        <Input
                        style={{margin: "2%"}} 
                            placeholder={t("msh_room_change.r_action.a_input")}
                            value={formValue.toRoom}
                            name="toRoom"
                            onChange={(e) => setFormValue({toRoom: e.target.value})}
                        />
                    </div>
                    <Button variant="success" size="md" onClick={() => {
                        handleUpdateRoom(currentRoom, guestId)
                        setNewRoom(false)}}>{t("msh_register_form.r_button.b_phone_validation")}</Button>
                </Drawer>

                <Drawer anchor="bottom" open={roomState} onClose={() => setRoomState(false)}  className="phone_container_drawer">
                    <div className="phone_container_drawer">
                        <h6 style={{textAlign: "center", width: "100%", fontWeight: "bold"}}>{t("msh_room_change.r_state.s_label")}</h6>
                        <select class="selectpicker" value={formValue.state} name="state" onChange={handleChange} 
                            style={{width: "100%", 
                            height: "100%", 
                            border: "1px solid lightgrey", 
                            borderRadius: "3px",
                            backgroundColor: "white", 
                            padding: "1vw",
                            marginBottom: "2vh", 
                            marginTop: "2vh"}}>
                                <option></option>
                                <option>{t("msh_room_change.r_state.s_dirty")}</option>
                                <option>{t("msh_room_change.r_state.s_clean")}</option>
                        </select>
                        </div>
                    <Button variant="success" onClick={() => {
                            handleUpdateRoomState(currentRoom)
                            setRoomState(false)
                    }}>{t("msh_register_form.r_button.b_phone_validation")}</Button>
                </Drawer>
            </div>
                            
    )
}

export default PhoneMaid