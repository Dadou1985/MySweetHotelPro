import React, {useState, useEffect } from 'react'
import { 
    Form, 
    Button, 
    Table, 
    Tabs, 
    Tab, 
    Modal, 
    FloatingLabel,
    Popover,
    OverlayTrigger
} from 'react-bootstrap'
import { Input } from 'reactstrap'
import ChangeRoom from '../../../svg/logout.png'
import moment from 'moment'
import 'moment/locale/fr'
import Switch from '@material-ui/core/Switch'
import Picture from '../../../svg/picture.svg'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from "react-i18next"
import { handleDeleteImg } from '../../../helper/globalCommonFunctions'
import { StyledBadge } from '../../../helper/formCommonUI'
import InputElement from "../../../helper/common/InputElement"
import BadgeContent from '../../../helper/common/badgeContent'
import ModalHeaderFormTemplate from '../../../helper/common/modalHeaderFormTemplate'
import TextareaElement from '../../../helper/common/textareaElement'
import ModalFormImgLayout from '../../../helper/common/modalFormImgLayout'
import { 
    fetchCollectionBySorting2, 
    fetchCollectionByMapping2, 
    handleSubmitData2, 
    addNotification,    
    handleUpdateData1,
    handleUpdateData2,
    handleDeleteData2
} from '../../../helper/globalCommonFunctions'
import { handleChange } from '../../../helper/formCommonFunctions'

const Maid = ({userDB}) =>{

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({
        client: "", 
        details: "", 
        fromRoom: "", 
        toRoom: "", 
        reason: "noise", 
        state: "dirty"
    })
    const [demandQty, setDemandQty] = useState([])
    const [img, setImg] = useState("")
    const [imgFrame, setImgFrame] = useState(false)
    const [footerState, setFooterState] = useState(true)
    const [reasonBack, setReasonBack] = useState("")
    const [stateClone, setStateClone] = useState("")
    const { t } = useTranslation()

    const handleShow = () => setList(true)
    const handleClose = () => {
        setList(false)
        setFormValue("")
    }

    const notif = t("msh_room_change.r_notif")
    const dataStatus = {status: false} 
    const hotelRoomData = {toRoom: formValue.toRoom}
    const userRoomData = {room: formValue.toRoom}
    const roomState = {
        state: formValue.state,
        stateClone: stateClone
    }
    const tooltipTitle = t("msh_toolbar.tooltip_room_change")
    const modalTitle = t("msh_room_change.r_title")

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

     useEffect(() => {
        let unsubscribe = fetchCollectionByMapping2("hotels", userDB.hotelId, "roomChange", "status", "==", true).onSnapshot(function(snapshot) {
            const snapInfo = []
            snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
                })        
            });
            setDemandQty(snapInfo)
        });
        return unsubscribe
           
     },[])

    return(
        <div>
            <StyledBadge badgeContent={demandQty.length} color="secondary">
                <BadgeContent tooltipTitle={tooltipTitle} icon={ChangeRoom} handleShow={handleShow} />
            </StyledBadge>  
           <Modal show={list}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleClose}
                enforceFocus={false}
                >
                <ModalHeaderFormTemplate title={modalTitle} />
                <Modal.Body>   
                    <Tabs defaultActiveKey="Déloger un client" id="uncontrolled-tab-example" onSelect={(eventKey) => {
                        if(eventKey === 'Liste des délogements'){
                            return setFooterState(false)
                        }else{
                            return setFooterState(true)
                        }
                    }}>
                        <Tab eventKey="Déloger un client" title={t("msh_room_change.r_phone_button.b_show_modal")}>
                            <div style={{
                                    display: "flex",
                                    flexFlow: "column",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    padding: "5%",
                                    textAlign: "center",
                                }}>
                                    <InputElement
                                        containerStyle={{marginBottom: "2vh"}} 
                                        label={t("msh_room_change.r_client")}
                                        placeholder="ex: Jane Doe"
                                        size="25vw"
                                        value={formValue.client}
                                        name="client"
                                        handleChange={handleChange}
                                        setFormValue={setFormValue}
                                    />
                                    <div style={{
                                        display: "flex",
                                        flexFlow: "row",
                                        justifyContent: "space-around",
                                        width: "50%",
                                        marginBottom: "2vh"
                                    }}>
                                        <InputElement
                                            containerStyle={{marginBottom: "0"}} 
                                            label={t("msh_room_change.r_from")}
                                            placeholder="ex: 310"
                                            size="12vw"
                                            value={formValue.fromRoom}
                                            name="fromRoom"
                                            handleChange={handleChange}
                                            setFormValue={setFormValue}
                                        />
                                        <InputElement
                                            containerStyle={{marginBottom: "0"}} 
                                            label={t("msh_room_change.r_to")}
                                            placeholder="ex: 409"
                                            size="12vw"
                                            value={formValue.toRoom}
                                            name="toRoom"
                                            handleChange={handleChange}
                                            setFormValue={setFormValue}
                                        />
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        flexFlow: "row",
                                        justifyContent: "space-around",
                                        width: "50%",
                                        marginBottom: "2vh"
                                    }}>
                                        <Form.Group controlId="exampleForm.SelectCustom">
                                            <FloatingLabel
                                                controlId="floatingInput"
                                                label={t("msh_room_change.r_reason.r_label")}
                                                className="mb-3"
                                            >
                                            <Form.Select className="selectpicker" value={formValue.reason} name="reason" onChange={(event) => handleChange(event, setFormValue)} onClick={(event) => {
                                                    if (event.target.value === "noise") {setReasonBack(t("msh_room_change.r_reason.r_noise"))}
                                                    if(event.target.value === "temperature") {setReasonBack(t("msh_room_change.r_reason.r_temperature"))}
                                                    if(event.target.value === "maintenance") {setReasonBack(t("msh_room_change.r_reason.r_maintenance"))}
                                                    if(event.target.value === "cleaning") {setReasonBack(t("msh_room_change.r_reason.r_cleaning"))}
                                                    if(event.target.value === "others") {setReasonBack(t("msh_lost_found.l_place.p_other"))}
                                                }}
                                                style={{width: "12vw", 
                                                height: "60%", 
                                                border: "1px solid lightgrey", 
                                                borderRadius: "3px",
                                                backgroundColor: "white", 
                                                paddingLeft: "1vw"}}>
                                                    <option value="noise">{t("msh_room_change.r_reason.r_noise")}</option>
                                                    <option value="temperature">{t("msh_room_change.r_reason.r_temperature")}</option>
                                                    <option value="maintenance">{t("msh_room_change.r_reason.r_maintenance")}</option>
                                                    <option value="cleaning">{t("msh_room_change.r_reason.r_cleaning")}</option>
                                                    <option value="others">{t("msh_room_change.r_reason.r_others")}</option>
                                            </Form.Select>
                                            </FloatingLabel>
                                        </Form.Group>
                                    
                                        <Form.Group controlId="exampleForm.SelectCustom">
                                            <FloatingLabel
                                                controlId="floatingInput"
                                                label={t("msh_room_change.r_state.s_label")}
                                                className="mb-3"
                                            >
                                                <Form.Select class="selectpicker" value={formValue.state} name="state" onChange={(event) => handleChange(event, setFormValue)} onClick={(event) => {
                                                    if (event.target.value === "dirty") {setStateClone(t("msh_room_change.r_state.s_dirty"))}
                                                    if(event.target.value === "clean") {setStateClone(t("msh_room_change.r_state.s_clean"))}
                                                }}
                                                    style={{width: "12vw", 
                                                    height: "60%", 
                                                    border: "1px solid lightgrey", 
                                                    borderRadius: "3px",
                                                    backgroundColor: "white", 
                                                    paddingLeft: "1vw"}}>
                                                        <option value="dirty">{t("msh_room_change.r_state.s_dirty")}</option>
                                                        <option value="clean">{t("msh_room_change.r_state.s_clean")}</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Form.Group>
                                    </div>
                                    <TextareaElement
                                        label={t("msh_room_change.r_details")}
                                        row="3"
                                        value={formValue.details} 
                                        name="details" 
                                        handleChange={handleChange}
                                        setFormValue={setFormValue}
                                        size={{width: "25vw", maxHeight: "15vh"}}
                                    />
                                </div>
                            </Tab>
                            <Tab eventKey="Liste des délogements" title={t("msh_room_change.r_table_title")}>
                            {!imgFrame ? 
                                <PerfectScrollbar style={{height: "55vh"}}>
                                    <Table striped bordered hover size="sm" className="text-center"  style={{overflowX: "auto",
                                            maxWidth: "90vw"}}>
                                        <thead className="bg-dark text-center text-light">
                                            <tr>
                                            <th>{t("msh_general.g_table.t_client")}</th>
                                            <th>{t("msh_general.g_table.t_from")}</th>
                                            <th>{t("msh_general.g_table.t_to")}</th>
                                            <th>{t("msh_general.g_table.t_reason")}</th>
                                            <th>{t("msh_general.g_table.t_state")}</th>
                                            <th>{t("msh_general.g_table.t_details")}</th>
                                            <td>{t("msh_general.g_table.t_date")}</td>
                                            <th>{t("msh_general.g_table.t_photo")}</th>
                                            <th>{t("msh_general.g_table.t_coworker")}</th>
                                            <th>{t("msh_general.g_table.t_statut")}</th>
                                            <th className="bg-dark"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {info.map(flow =>(
                                                <tr key={flow.id}>
                                                <td>{flow.client}</td>
                                                <td>{flow.fromRoom}</td>
                                                {flow.toRoom === "" ? 
                                                <td className="bg-dark"><OverlayTrigger
                                                    trigger="click"
                                                    placement="top"
                                                    overlay={
                                                    <Popover 
                                                        id="popover-positioned-top">
                                                        <Popover.Header as="h3">
                                                            <Input 
                                                                placeholder={t("msh_room_change.r_action.a_attribute_room")}
                                                                value={formValue.toRoom}
                                                                name="toRoom"
                                                                onChange={(e) => setFormValue({toRoom: e.target.value})}
                                                                />
                                                        </Popover.Header>
                                                        <Popover.Body className="text-center">
                                                            <Button variant="success" size="sm" style={{width: "5vw"}} onClick={() => {
                                                                handleUpdateData2("hotels", userDB.hotelId, "roomChange", flow.id, hotelRoomData)
                                                                handleUpdateData1("guestUsers", flow.userId, userRoomData)
                                                            }}>{t("msh_general.g_button.b_send")}
                                                            </Button>
                                                        </Popover.Body>
                                                    </Popover>
                                                    }
                                                >
                                                    <Button variant="outline-danger" size="sm" style={{width: "5vw"}}>{t("msh_room_change.r_action.a_attribute")}</Button>
                                                </OverlayTrigger>
                                                        </td> : <td>{flow.toRoom}</td>}
                                                <td>{flow.reasonClone}</td>
                                                {flow.state === "" ? 
                                                    <td className="bg-dark">
                                                        <OverlayTrigger
                                                            trigger="click"
                                                            placement="top"
                                                            overlay={
                                                            <Popover 
                                                                id="popover-positioned-top">
                                                                <Popover.Header as="h3" className="text-center">
                                                                <h6>{t("msh_room_change.r_state.s_label")}</h6>
                                                                <select class="selectpicker" value={formValue.state} name="state" onChange={(event) => handleChange(event, setFormValue)} 
                                                                    style={{width: "5vw", 
                                                                    height: "100%", 
                                                                    border: "1px solid lightgrey", 
                                                                    borderRadius: "3px",
                                                                    backgroundColor: "white", 
                                                                    paddingLeft: "1vw"}}>
                                                                        <option value="dirty" onClick={() => setStateClone(t("msh_room_change.r_state.s_dirty"))}>{t("msh_room_change.r_state.s_dirty")}</option>
                                                                        <option value="clean" onClick={() => setStateClone(t("msh_room_change.r_state.s_clean"))}>{t("msh_room_change.r_state.s_clean")}</option>
                                                                    </select>
                                                                </Popover.Header>
                                                                <Popover.Body className="text-center">
                                                                    <Button variant="success" size="sm" style={{width: "5vw"}} onClick={() => handleUpdateData2("hotels", userDB.hotelId, "roomChange", flow.id, roomState)}>{t("msh_general.g_button.b_send")}</Button>
                                                                </Popover.Body>
                                                            </Popover>
                                                            }
                                                        >
                                                    <Button variant="outline-danger" size="sm" style={{width: "5vw"}}>{t("msh_room_change.r_action.a_check")}</Button>
                                                </OverlayTrigger>
                                                    </td> : 
                                                    <td>{flow.stateClone}</td>}
                                                <td>{flow.details}</td>
                                                <td>{moment(flow.markup).format('L')}</td>
                                                {flow.img ? <td style={{cursor: "pointer"}} onClick={() => {
                                                    setImg(flow.img)
                                                    setImgFrame(true)
                                                }}><img src={Picture} style={{width: "1vw"}} /></td> : 
                                                <td>{t("msh_room_change.r_photo_state")}</td>}
                                                <td>{flow.author}</td>
                                                <td>
                                                <Switch
                                                    checked={flow.status}
                                                    onChange={() => handleUpdateData2("hotels", userDB.hotelId, "roomChange", flow.id, dataStatus)}
                                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                />
                                                </td>
                                                <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
                                                    if(flow.img) {
                                                        handleDeleteImg(flow.img)
                                                    }
                                                    return handleDeleteData2("hotels", userDB.hotelId, "roomChange", flow.id)
                                                }}>{t("msh_general.g_button.b_delete")}</Button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </PerfectScrollbar> : 
                                <ModalFormImgLayout
                                    setImgFrame={setImgFrame}
                                    img={img}
                                />}
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                    {footerState && <Modal.Footer>
                        <Button variant="dark" onClick={(event) => {
                            handleSubmitData2(event, "hotels", userDB.hotelId, "roomChange", newData)
                            addNotification(notif, userDB.hotelId)
                            return handleClose()
                        }}>{t("msh_general.g_button.b_send")}</Button>
                    </Modal.Footer>}
                </Modal>
        </div>
    )
}

export default Maid