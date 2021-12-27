import React, {useState, useEffect } from 'react'
import { Form, Button, Table, Tabs, Tab, Tooltip, OverlayTrigger, Modal, Popover } from 'react-bootstrap'
import { Input } from 'reactstrap'
import ChangeRoom from '../../../svg/logout.png'
import {  db, storage } from '../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Switch from '@material-ui/core/Switch';
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles';
import Picture from '../../../svg/picture.svg'
import Close from '../../../svg/close.svg'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from "react-i18next"

const Maid = ({userDB}) =>{

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({client: "", details: "", fromRoom: "", toRoom: "", reason: "", state: ""})
    const [demandQty, setDemandQty] = useState([])
    const [img, setImg] = useState("")
    const [imgFrame, setImgFrame] = useState(false)
    const [footerState, setFooterState] = useState(true)
    const { t, i18n } = useTranslation()

    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

      const StyledBadge = withStyles((theme) => ({
        badge: {
          right: -3,
          top: 13,
          border: `2px solid ${theme.palette.background.paper}`,
          padding: '0 4px',
        },
      }))(Badge);

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
            state: formValue.state,
            status: false
            })
        .then(handleClose)
    }

    const handleUpdateRoom = async(demandId, guestId) => {
        await db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('roomChange')
            .doc(demandId)
            .update({
                toRoom: formValue.toRoom,
            })

        return db.collection('guestUsers')
            .doc(`${guestId}`)
            .update({
                room: formValue.toRoom
            })
            .then(() => 
                setFormValue("")
            )
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

    const changeDemandStatus = (document) => {
        return db.collection('hotels')
            .doc(userDB.hotelId)
          .collection('roomChange')
          .doc(document)
          .update({
            status: false,
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

     useEffect(() => {
        const toolOnAir = () => {
            return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('roomChange')
            .where("status", "==", true)
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
                    setDemandQty(snapInfo)
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
  

    return(
        <div>
            <StyledBadge badgeContent={demandQty.length} color="secondary">
                <OverlayTrigger
                placement="right"
                overlay={
                <Tooltip id="title">
                    {t("msh_toolbar.tooltip_room_change")}
                </Tooltip>
                }>
                        <img src={ChangeRoom} className="icon" alt="contact" onClick={handleShow} style={{width: "3vw", marginRight: "1vw"}} />
                </OverlayTrigger>
            </StyledBadge>

            <Modal show={list}
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={handleClose}
                    enforceFocus={false}
                    >
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title id="contained-modal-title-vcenter">
                        {t("msh_room_change.r_title")}
                        </Modal.Title>
                    </Modal.Header>
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
                                    <Form.Row>
                                        <Form.Group controlId="description">
                                        <Form.Label>{t("msh_room_change.r_client")}</Form.Label>
                                        <Form.Control type="text" placeholder="ex: Jane Doe" style={{width: "15vw"}} value={formValue.client} name="client" onChange={handleChange} />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row style={{
                                        display: "flex",
                                        flexFlow: "row",
                                        justifyContent: "space-around",
                                        width: "60%"
                                    }}>
                                        <Form.Group controlId="description">
                                        <Form.Label>{t("msh_room_change.r_from")}</Form.Label>
                                        <Form.Control type="text" placeholder="ex: 310" style={{width: "10vw"}} value={formValue.fromRoom} name="fromRoom" onChange={handleChange} />
                                        </Form.Group>
                                    
                                        <Form.Group controlId="description">
                                        <Form.Label>{t("msh_room_change.r_to")}</Form.Label>
                                        <Form.Control type="text" placeholder="ex: 409" style={{width: "10vw"}} value={formValue.toRoom} name="toRoom" onChange={handleChange} />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row style={{
                                        display: "flex",
                                        flexFlow: "row",
                                        justifyContent: "space-around",
                                        width: "60%"
                                    }}>
                                        <Form.Group controlId="exampleForm.SelectCustom">
                                        <Form.Label>{t("msh_room_change.r_reason.r_label")}</Form.Label><br/>
                                        <select className="selectpicker" value={formValue.reason} name="reason" onChange={handleChange} 
                                        style={{width: "10vw", 
                                        height: "60%", 
                                        border: "1px solid lightgrey", 
                                        borderRadius: "3px",
                                        backgroundColor: "white", 
                                        paddingLeft: "1vw"}}>
                                            <option></option>
                                            <option>{t("msh_room_change.r_reason.r_paint")}</option>
                                            <option>{t("msh_room_change.r_reason.r_plumbery")}</option>
                                            <option>{t("msh_room_change.r_reason.r_electricity")}</option>
                                            <option>{t("msh_room_change.r_reason.r_cleaning")}</option>
                                            <option>{t("msh_room_change.r_reason.r_other")}</option>
                                        </select>
                                    </Form.Group>
                                    
                                        <Form.Group controlId="exampleForm.SelectCustom">
                                        <Form.Label>{t("msh_room_change.r_state.s_label")}</Form.Label><br/>
                                        <select class="selectpicker" value={formValue.state} name="state" onChange={handleChange} 
                                        style={{width: "10vw", 
                                        height: "60%", 
                                        border: "1px solid lightgrey", 
                                        borderRadius: "3px",
                                        backgroundColor: "white", 
                                        paddingLeft: "1vw"}}>
                                            <option></option>
                                            <option>{t("msh_room_change.r_state.s_dirty")}</option>
                                            <option>{t("msh_room_change.r_state.s_clean")}</option>
                                        </select>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group controlId="details">
                                            <Form.Label>{t("msh_room_change.r_details")}</Form.Label>
                                            <Form.Control as="textarea" rows="3" style={{width: "25vw", maxHeight: "15vh"}} value={formValue.details} name="details" onChange={handleChange}  />
                                        </Form.Group>
                                    </Form.Row>
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
                                                        <Popover.Title as="h3">
                                                            <Input 
                                                                placeholder="Entrer un n° de chambre"
                                                                value={formValue.toRoom}
                                                                name="toRoom"
                                                                onChange={(e) => setFormValue({toRoom: e.target.value})}
                                                                />
                                                        </Popover.Title>
                                                        <Popover.Content className="text-center">
                                                            <Button variant="success" size="sm" style={{width: "5vw"}} onClick={() => handleUpdateRoom(flow.id, flow.userId)}>{t("msh_general.g_button.b_send")}</Button>
                                                        </Popover.Content>
                                                    </Popover>
                                                    }
                                                >
                                                    <Button variant="outline-danger" size="sm" style={{width: "5vw"}}>A attribuer</Button>
                                                </OverlayTrigger>
                                                        </td> : <td>{flow.toRoom}</td>}
                                                <td>{flow.reason}</td>
                                                {flow.state === "" ? 
                                                    <td className="bg-dark">
                                                        <OverlayTrigger
                                                            trigger="click"
                                                            placement="top"
                                                            overlay={
                                                            <Popover 
                                                                id="popover-positioned-top">
                                                                <Popover.Title as="h3" className="text-center">
                                                                <h6>Etat de la chambre</h6>
                                                                <select class="selectpicker" value={formValue.state} name="state" onChange={handleChange} 
                                                                    style={{width: "5vw", 
                                                                    height: "100%", 
                                                                    border: "1px solid lightgrey", 
                                                                    borderRadius: "3px",
                                                                    backgroundColor: "white", 
                                                                    paddingLeft: "1vw"}}>
                                                                        <option></option>
                                                                        <option>{t("msh_room_change.r_state.s_dirty")}</option>
                                                                        <option>{t("msh_room_change.r_state.s_clean")}</option>
                                                                    </select>
                                                                </Popover.Title>
                                                                <Popover.Content className="text-center">
                                                                    <Button variant="success" size="sm" style={{width: "5vw"}} onClick={() => handleUpdateRoomState(flow.id)}>{t("msh_general.g_button.b_send")}</Button>
                                                                </Popover.Content>
                                                            </Popover>
                                                            }
                                                        >
                                                    <Button variant="outline-danger" size="sm" style={{width: "5vw"}}>A vérifier</Button>
                                                </OverlayTrigger>
                                                    </td> : 
                                                    <td>{flow.state}</td>}
                                                <td>{flow.details}</td>
                                                <td>{moment(flow.markup).format('L')}</td>
                                                {flow.img ? <td style={{cursor: "pointer"}} onClick={() => {
                                                    setImg(flow.img)
                                                    setImgFrame(true)
                                                }}><img src={Picture} style={{width: "1vw"}} /></td> : 
                                                <td>Aucune</td>}
                                                <td>{flow.author}</td>
                                                <td>
                                                <Switch
                                                    checked={flow.status}
                                                    onChange={() => changeDemandStatus(flow.id)}
                                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                />
                                                </td>
                                                <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
                                                    if(flow.img) {
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
                                                }}>{t("msh_general.g_button.b_delete")}</Button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </PerfectScrollbar> : 
                            <div style={{
                                display: "flex",
                                flexFlow: 'column',
                                alignItems: "center",
                                padding: "2%"
                            }}>
                                <div style={{width: "100%"}}>
                                    <img src={Close} style={{width: "1vw", float: "right", cursor: "pointer"}} onClick={() => setImgFrame(false)} /> 
                                </div>
                                <img src={img} style={{width: "70%"}} />
                            </div>}
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                    {footerState && <Modal.Footer>
                        <Button variant="dark" onClick={handleSubmit}>{t("msh_general.g_button.b_send")}</Button>
                    </Modal.Footer>}
                </Modal>
        </div>
    )
}

export default Maid