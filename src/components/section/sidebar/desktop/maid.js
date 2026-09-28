import React, {useState, useContext } from 'react'
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
import ChangeRoom from '../../../../assets/svg/logout.png'
import moment from 'moment'
import 'moment/locale/fr'
import Switch from '@material-ui/core/Switch'
import Picture from '../../../../assets/svg/picture.svg'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from "react-i18next"
import { handleDeleteImg } from '../../../../utils/form/formCommonFunctions'
import { StyledBadge } from '../../../../utils/form/formCommonUI'
import InputElement from "../../../../utils/form/InputElement"
import BadgeContent from '../../../../utils/badge/badgeContent'
import ModalHeaderFormTemplate from '../../../../utils/modal/modalHeaderFormTemplate'
import TextareaElement from '../../../../utils/form/textareaElement'
import ModalFormImgLayout from '../../../../utils/modal/modalFormImgLayout'
import { handleChange } from '../../../../utils/form/formCommonFunctions'
import { FirebaseContext } from '../../../../config/Firebase'
import { useFirestoreSubscription, useAdd, useUpdate, useDelete } from '../../../../utils/hooks/useFirestore'

const Maid = () =>{
    const { userDB } = useContext(FirebaseContext)

    const [list, setList] = useState(false)
    const [formValue, setFormValue] = useState({
        client: "",
        details: "",
        fromRoom: "",
        toRoom: "",
        reason: "noise",
        state: "dirty"
    })
    const [img, setImg] = useState("")
    const [imgFrame, setImgFrame] = useState(false)
    const [footerState, setFooterState] = useState(true)
    const [reasonBack, setReasonBack] = useState("")
    const [stateClone, setStateClone] = useState("")
    const { t } = useTranslation()

    const { data: info = [] } = useFirestoreSubscription(
        ['hotels', userDB.hotelId, 'roomChange'],
        { orderBy: ['markup', 'asc'] }
    )

    const { data: demandQty = [] } = useFirestoreSubscription(
        ['hotels', userDB.hotelId, 'roomChange'],
        { where: ['status', '==', true] }
    )

    const { mutate: addRoomChange } = useAdd(['hotels', userDB.hotelId, 'roomChange'])
    const { mutate: updateRoomChange } = useUpdate(['hotels', userDB.hotelId, 'roomChange'])
    const { mutate: updateUser } = useUpdate(['guestUsers'])
    const { mutate: deleteRoomChange } = useDelete(['hotels', userDB.hotelId, 'roomChange'])
    const { mutate: notify } = useAdd()

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
                                    width: "100%"
                                }}>
                                    <InputElement
                                        containerStyle={{marginBottom: "2vh", width: "95%"}} 
                                        label={t("msh_room_change.r_client")}
                                        placeholder="ex: Jane Doe"
                                        size="100%"
                                        value={formValue.client}
                                        name="client"
                                        handleChange={handleChange}
                                        setFormValue={setFormValue}
                                    />
                                    <div style={{
                                        display: "flex",
                                        flexFlow: "row",
                                        justifyContent: "space-around",
                                        width: "100%",
                                        marginBottom: "2vh"
                                    }}>
                                        <InputElement
                                            containerStyle={{marginBottom: "0", width: "45%"}} 
                                            label={t("msh_room_change.r_from")}
                                            placeholder="ex: 310"
                                            size="100%"
                                            value={formValue.fromRoom}
                                            name="fromRoom"
                                            handleChange={handleChange}
                                            setFormValue={setFormValue}
                                        />
                                        <InputElement
                                            containerStyle={{marginBottom: "0", width: "45%"}} 
                                            label={t("msh_room_change.r_to")}
                                            placeholder="ex: 409"
                                            size="100%"
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
                                        width: "100%",
                                        marginBottom: "2vh"
                                    }}>
                                        <div style={{width: "45%"}}>
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
                                                    style={{width: "100%", 
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
                                        </div>
                                        
                                        <div style={{width: "45%"}}>
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
                                                        style={{width: "100%", 
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
                                    </div>
                                    <div style={{width: "95%"}}>
                                        <TextareaElement
                                            label={t("msh_room_change.r_details")}
                                            row="3"
                                            value={formValue.details} 
                                            name="details" 
                                            handleChange={handleChange}
                                            setFormValue={setFormValue}
                                            size={{width: "100%", maxHeight: "15vh"}}
                                        />
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="Liste des délogements" title={t("msh_room_change.r_table_title")}>
                            {!imgFrame ? 
                                <PerfectScrollbar style={{height: "55vh"}}>
                                    <Table striped bordered hover size="sm" className="text-center"  style={{overflow:"scroll"}}>
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
                                                        <Popover.Header as="h3" className="msh-bg">
                                                            <Input 
                                                                placeholder={t("msh_room_change.r_action.a_attribute_room")}
                                                                value={formValue.toRoom}
                                                                name="toRoom"
                                                                onChange={(e) => setFormValue({toRoom: e.target.value})}
                                                                />
                                                        </Popover.Header>
                                                        <Popover.Body className="text-center">
                                                            <Button className="btn-msh-dark" size="sm" onClick={() => {
                                                                updateRoomChange({ path: ['hotels', userDB.hotelId, 'roomChange', flow.id], data: hotelRoomData })
                                                                updateUser({ path: ['guestUsers', flow.userId], data: userRoomData })
                                                            }}>{t("msh_general.g_button.b_send")}
                                                            </Button>
                                                        </Popover.Body>
                                                    </Popover>
                                                    }
                                                >
                                                    <Button variant="outline-danger" size="sm">{t("msh_room_change.r_action.a_attribute")}</Button>
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
                                                                <Popover.Header as="h3" className="text-center msh-bg">
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
                                                                    <Button className="btn-msh-dark" size="sm" onClick={() => updateRoomChange({ path: ['hotels', userDB.hotelId, 'roomChange', flow.id], data: roomState })}>{t("msh_general.g_button.b_send")}</Button>
                                                                </Popover.Body>
                                                            </Popover>
                                                            }
                                                        >
                                                    <Button variant="outline-danger" size="sm">{t("msh_room_change.r_action.a_check")}</Button>
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
                                                    onChange={() => updateRoomChange({ path: ['hotels', userDB.hotelId, 'roomChange', flow.id], data: dataStatus })}
                                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                />
                                                </td>
                                                <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
                                                    if(flow.img) {
                                                        handleDeleteImg(flow.img)
                                                    }
                                                    return deleteRoomChange({ path: ['hotels', userDB.hotelId, 'roomChange', flow.id] })
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
                        <Button className='btn-msh-dark' onClick={(event) => {
                            event.preventDefault()
                            addRoomChange({ path: ['hotels', userDB.hotelId, 'roomChange'], data: newData })
                            notify({ path: ['notifications'], data: { content: notif, hotelId: userDB.hotelId, markup: Date.now() } })
                            return handleClose()
                        }}>{t("msh_general.g_button.b_send")}</Button>
                    </Modal.Footer>}
                </Modal>
        </div>
    )
}

export default Maid