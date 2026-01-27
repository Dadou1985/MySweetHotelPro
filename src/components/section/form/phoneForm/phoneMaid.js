import React, {useState, useEffect } from 'react'
import { Form, Button, Table, FloatingLabel } from 'react-bootstrap'
import { Input } from 'reactstrap'
import moment from 'moment'
import 'moment/locale/fr';
import Drawer from '@material-ui/core/Drawer'
import Switch from '@material-ui/core/Switch';
import Close from '../../../../svg/close.svg'
import Picture from '../../../../svg/picture.svg'
import { useTranslation } from "react-i18next"
import '../../../css/section/form/phoneForm/phonePageTemplate.css'
import { handleDeleteImg } from '../../../../helper/globalCommonFunctions'
import InputElement from '../../../../helper/common/InputElement'
import TextareaElement from '../../../../helper/common/textareaElement'
import { 
    fetchCollectionBySorting2, 
    handleSubmitData2, 
    addNotification,
    handleUpdateData1,
    handleUpdateData2,
    handleDeleteData2
} from '../../../../helper/globalCommonFunctions'
import { handleChange } from '../../../../helper/formCommonFunctions'

/* 
    ! FIX => PHOTO SUBMISSION
*/

const PhoneMaid = ({userDB}) =>{

    const [formValue, setFormValue] = useState({
        client: "", 
        details: "", 
        fromRoom: "", 
        toRoom: "", 
        reason: "", 
        state: ""
    })
    const [info, setInfo] = useState([])
    const [activate, setActivate] = useState(false)
    const [expand, setExpand] = useState(false)
    const [img, setImg] = useState("")
    const [imgFrame, setImgFrame] = useState(false)
    const [newRoom, setNewRoom] = useState(false)
    const [roomState, setRoomState] = useState(false)
    const [currentRoom, setCurrentRoom] = useState("")
    const [guestId, setGuestId] = useState("")
    const [reasonBack, setReasonBack] = useState("")
    const [stateClone, setStateClone] = useState("")
    const { t } = useTranslation()

    const handleShow = () => setActivate(true)
    const handleHide = () => {
        setActivate(false)
        setFormValue("")
    }

    const notif = t("msh_room_change.r_notif")
    const dataStatus = {status: false} 
    const hotelRoomData = {toRoom: formValue.toRoom}
    const userRoomData = {room: formValue.toRoom}
    const roomStateUpdated = {
        state: formValue.state,
        stateClone: stateClone
    }

    const newData = {
        author: userDB.username,
        date: new Date(),
        details: formValue.details,
        client: formValue.client,
        fromRoom: formValue.fromRoom,
        markup: Date.now(),
        toRoom: formValue.toRoom,
        reason: formValue.reason,
        reasonClone: reasonBack !== "" ? reasonBack : t("msh_room_change.r_reason.r_noise"),
        state: formValue.state,
        stateClone: stateClone !== "" ? stateClone : t("msh_room_change.r_state.s_dirty"),
        status: false
    }

    useEffect(() => {
        let unsubscribe = fetchCollectionBySorting2("hotels", userDB.hotelId, "roomChange", "markup", "asc").onSnapshot(function(snapshot) {
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
            <h3 className="phone_title">{t("msh_room_change.r_title")}</h3>
            <div style={{width: "90vw", overflow: "scroll", height: '100%'}}>
            {/*<div style={{display: "flex", flexFlow: "row", justifyContent: expand ? "flex-start" : "flex-end", width: "100%"}}>
                <span style={{display: "flex", flexFlow: expand ? "row-reverse" : "row"}}  onClick={handleChangeExpand}>
                {expand ? "Rétrécir" : "Agrandir"}
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
                                <td><Button variant="outline-warning" size="sm" style={{width: "100%"}} onClick={() => {
                                    setCurrentRoom(flow.id)
                                    setGuestId(flow.userId)
                                    setNewRoom(true)}}>{t("msh_room_change.r_action.a_attribute")}</Button></td> : 
                                <td>{flow.toRoom}</td>}
                            {flow.state === "" ? 
                                <td><Button variant="outline-warning" size="sm" style={{width: "100%"}} onClick={() => {
                                    setRoomState(true)
                                    setCurrentRoom(flow.id)
                                }}>{t("msh_room_change.r_action.a_check")}</Button></td>
                                : <td>{flow.state}</td>}
                            {expand && <td>{flow.reason}</td>}
                            <td>
                            <Switch
                                checked={flow.status}
                                onChange={() => handleUpdateData2("hotels", userDB.hotelId, "roomChange", flow.id, dataStatus)}
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
                                return handleDeleteData2("hotels", userDB.hotelId, "roomChange", flow.id)
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
                <Button className="btn-msh phone_submitButton" size="md" onClick={handleShow}>{t("msh_room_change.r_phone_button.b_show_modal")}</Button>
           
                <Drawer anchor="bottom" open={activate} onClose={handleHide}  className="phone_container_drawer">
                    <div  className="phone_container_drawer">
                    <h4  className='phone_tab'>{t("msh_room_change.r_phone_button.b_show_modal")}</h4>
                    <InputElement
                        containerStyle={{marginBottom: "0vh"}} 
                        label={t("msh_room_change.r_client")}
                        placeholder="ex: Jane Doe"
                        size="90vw"
                        value={formValue.client}
                        name="client"
                        handleChange={handleChange}
                        setFormValue={setFormValue}
                    />
                <div style={{display: "flex", flexFlow: "row", justifyContent: "space-between", width: "90vw"}}>
                    <InputElement
                        containerStyle={{marginBottom: "0"}} 
                        label={t("msh_room_change.r_from")}
                        placeholder="ex: 310"
                        size="40vw"
                        value={formValue.fromRoom}
                        name="fromRoom"
                        handleChange={handleChange}
                        setFormValue={setFormValue}
                    />
                    <InputElement
                        containerStyle={{marginBottom: "0"}} 
                        label={t("msh_room_change.r_to")}
                        placeholder="ex: 409"
                        size="40vw"
                        value={formValue.toRoom}
                        name="toRoom"
                        handleChange={handleChange}
                        setFormValue={setFormValue}
                    />
                </div>
                <div>
                    <Form.Group controlId="exampleForm.SelectCustom">
                    <FloatingLabel
                        controlId="floatingInput"
                        label={t("msh_room_change.r_reason.r_label")}
                        className="mb-3"
                    >
                    <Form.Select class="Form.Selectpicker" value={formValue.reason} name="reason" onChange={(event) => handleChange(event, setFormValue)} 
                    className="phonePage_select">
                        <option value="noise" onClick={() => setReasonBack(t("msh_room_change.r_reason.r_noise"))}>{t("msh_room_change.r_reason.r_noise")}</option>
                        <option value="temperature" onClick={() => setReasonBack(t("msh_room_change.r_reason.r_temperature"))}>{t("msh_room_change.r_reason.r_temperature")}</option>
                        <option value="maintenance" onClick={() => setReasonBack(t("msh_room_change.r_reason.r_maintenance"))}>{t("msh_room_change.r_reason.r_maintenance")}</option>
                        <option value="cleaning" onClick={() => setReasonBack(t("msh_room_change.r_reason.r_cleaning"))}>{t("msh_room_change.r_reason.r_cleaning")}</option>
                        <option value="others" onClick={() => setReasonBack(t("msh_room_change.r_reason.r_others"))}>{t("msh_room_change.r_reason.r_others")}</option>
                    </Form.Select>
                    </FloatingLabel>
                </Form.Group>
                </div>
                <div>
                    <Form.Group controlId="exampleForm.SelectCustom">
                    <FloatingLabel
                        controlId="floatingInput"
                        label={t("msh_room_change.r_state.s_label")}
                        className="mb-3"
                    >                    
                    <Form.Select class="selectpicker" value={formValue.state} name="state" onChange={(event) => handleChange(event, setFormValue)} 
                    className="phonePage_select">
                        <option value="dirty" onClick={() => setStateClone(t("msh_room_change.r_state.s_dirty"))}>{t("msh_room_change.r_state.s_dirty")}</option>
                        <option value="clean" onClick={() => setStateClone(t("msh_room_change.r_state.s_clean"))}>{t("msh_room_change.r_state.s_clean")}</option>
                    </Form.Select>
                    </FloatingLabel>
                    </Form.Group>
                </div>
                <div>
                <TextareaElement
                    label={t("msh_room_change.r_details")}
                    row="2"
                    value={formValue.details} 
                    name="details" 
                    handleChange={handleChange}
                    setFormValue={setFormValue}
                    size={{width: "90vw", maxHeight: "15vh"}}
                />
                </div>
                    <Button className="btn-msh phone_submitButton" onClick={(event) => {
                            handleSubmitData2(event, "hotels", userDB.hotelId, "roomChange", newData)
                            addNotification(notif, userDB.hotelId)
                            return handleHide()
                        }}>{t("msh_room_change.r_phone_button.b_validation")}</Button>
                    </div>
                </Drawer>

                <Drawer anchor="bottom" open={newRoom} onClose={() => setNewRoom(false)}  className="phone_container_drawer">
                    <div className="phone_container_drawer">
                        <h4  className='phone_tab' style={{textAlign: "center"}}>{t("msh_room_change.r_action.a_attribute_room")}</h4>
                        <InputElement
                            containerStyle={{}} 
                            size="90vw"
                            label={t("msh_room_change.r_action.a_input")}
                            placeholder={t("msh_room_change.r_action.a_input")}
                            value={formValue.toRoom}
                            name="toRoom"
                            handleChange={handleChange}
                            setFormValue={setFormValue}
                        />
                    </div>
                    <Button className="btn-msh phone_submitButton" size="md" onClick={() => {
                        handleUpdateData2("hotels", userDB.hotelId, "roomChange", currentRoom, hotelRoomData)
                        handleUpdateData1("guestUsers", guestId, userRoomData)
                        setNewRoom(false)}}>{t("msh_register_form.r_button.b_phone_validation")}
                    </Button>
                </Drawer>

                <Drawer anchor="bottom" open={roomState} onClose={() => setRoomState(false)}  className="phone_container_drawer">
                    <div className="phone_container_drawer">
                        <h4  className='phone_tab' style={{textAlign: "center"}}>{t("msh_room_change.r_state.s_label")}</h4>
                        <FloatingLabel
                        controlId="floatingInput"
                        label={t("msh_maintenance.m_type.t_label")}
                        className="mb-3"
                    >    
                        <Form.Select class="selectpicker" value={formValue.state} name="state" onChange={(event) => handleChange(event, setFormValue)} className="phonePage_select">
                                <option></option>
                                <option>{t("msh_room_change.r_state.s_dirty")}</option>
                                <option>{t("msh_room_change.r_state.s_clean")}</option>
                        </Form.Select>
                        </FloatingLabel>
                        </div>
                    <Button className="btn-msh phone_submitButton" onClick={() => {
                        handleUpdateData2("hotels", userDB.hotelId, "roomChange", currentRoom, roomStateUpdated)
                        setRoomState(false)
                    }}>{t("msh_register_form.r_button.b_phone_validation")}</Button>
                </Drawer>
            </div>
                            
    )
}

export default PhoneMaid