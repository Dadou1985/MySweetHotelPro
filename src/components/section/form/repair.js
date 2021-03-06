import React, {useState, useEffect } from 'react'
import { Form, Button, Table, Tabs, Tab, Tooltip, OverlayTrigger, Modal, FloatingLabel } from 'react-bootstrap'
import Maintenance from '../../../svg/repair.svg'
import { db, storage } from '../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Switch from '@material-ui/core/Switch';
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles';
import Picture from '../../../svg/picture.svg'
import Close from '../../../svg/close.svg'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from "react-i18next"


const Repair = ({userDB}) =>{

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({room: "", client: "", details: "", type: "paint"})
    const [typeClone, setTypeClone] = useState(null)
    const [issueQty, setIssueQty] = useState([])
    const [img, setImg] = useState("")
    const [imgFrame, setImgFrame] = useState(false)
    const [footerState, setFooterState] = useState(true)
    const { t } = useTranslation()

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
    }

      const handleSubmit = event => {
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
            typeClone: typeClone !== null ? typeClone : t("msh_dashboard.maintenance_data.d_paint"),
            status: false
            })
        .then(handleClose)
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

     useEffect(() => {
        const toolOnAir = () => {
            return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('maintenance')
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
                    setIssueQty(snapInfo)
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
            <StyledBadge badgeContent={issueQty.length} color="secondary">
                <OverlayTrigger
                placement="right"
                overlay={
                <Tooltip id="title">
                    {t("msh_toolbar.tooltip_technical")}
                </Tooltip>
                }>
                        <img src={Maintenance} className="icon" alt="contact" onClick={handleShow} style={{width: "2vw"}} />
                    </OverlayTrigger>
            </StyledBadge>            

            <Modal show={list}
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={handleClose}
                    >
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title id="contained-modal-title-vcenter">
                        {t("msh_maintenance.m_title")}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    
                    <Tabs defaultActiveKey="Signaler un probl??me technique" id="uncontrolled-tab-example" onSelect={(eventKey) => {
                        if(eventKey === 'Liste des probl??mes techniques'){
                            return setFooterState(false)
                        }else{
                            return setFooterState(true)
                        }
                    }}>
                            <Tab eventKey="Signaler un probl??me technique" title={t("msh_maintenance.m_first_tab_title")}>
                            <div style={{
                                    display: "flex",
                                    flexFlow: "column",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    padding: "5%",
                                    textAlign: "center"
                                }}>
                                    <div style={{marginBottom: "2vh"}}>
                                        <Form.Group controlId="description">
                                        <FloatingLabel
                                            controlId="floatingInput"
                                            label={t("msh_maintenance.m_client")}
                                            className="mb-3"
                                        >
                                            <Form.Control type="text" placeholder="ex: Jane Doe" style={{width: "20vw"}} value={formValue.client} name="client" onChange={handleChange} />
                                        </FloatingLabel>
                                        </Form.Group>
                                    </div>
                                    <div style={{marginBottom: "2vh"}}>
                                        <Form.Group controlId="description">
                                        <FloatingLabel
                                            controlId="floatingInput"
                                            label={t("msh_maintenance.m_room")}
                                            className="mb-3"
                                        >
                                            <Form.Control type="text" placeholder="ex: 409" style={{width: "20vw"}} value={formValue.room} name="room" onChange={handleChange} />
                                        </FloatingLabel>
                                        </Form.Group>
                                    </div>
                                    <div style={{marginBottom: "2vh"}}>
                                        <Form.Group controlId="exampleForm.SelectCustom">
                                        <FloatingLabel
                                            controlId="floatingInput"
                                            label={t("msh_maintenance.m_type.t_label")}
                                            className="mb-3"
                                        >
                                            <Form.Select class="selectpicker" value={formValue.type} name="type" onChange={handleChange} 
                                            style={{width: "20vw", 
                                            border: "1px solid lightgrey", 
                                            borderRadius: "3px",
                                            backgroundColor: "white", 
                                            paddingLeft: "1vw"}}>
                                                <option value="paint" onClick={() => setTypeClone(t("msh_dashboard.maintenance_data.d_paint"))}>{t("msh_dashboard.maintenance_data.d_paint")}</option>
                                                <option value="electricity" onClick={() => setTypeClone(t("msh_dashboard.maintenance_data.d_electricity"))}>{t("msh_dashboard.maintenance_data.d_electricity")}</option>
                                                <option value="plumbery" onClick={() => setTypeClone(t("msh_dashboard.maintenance_data.d_plumbery"))}>{t("msh_dashboard.maintenance_data.d_plumbery")}</option>
                                                <option value="cleaning" onClick={() => setTypeClone(t("msh_dashboard.maintenance_data.d_cleaning"))}>{t("msh_dashboard.maintenance_data.d_cleaning")}</option>
                                                <option value="others" onClick={() => setTypeClone(t("msh_dashboard.maintenance_data.d_others"))}>{t("msh_dashboard.maintenance_data.d_others")}</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Form.Group>
                                    </div>
                                    <div>
                                        <Form.Group controlId="details">
                                            <FloatingLabel
                                            controlId="floatingInput"
                                            label={t("msh_maintenance.m_details")}
                                            className="mb-3"
                                        >
                                            <Form.Control as="textarea" rows="3" style={{width: "20vw", maxHeight: "15vh"}} value={formValue.details} name="details" onChange={handleChange}  />
                                        </FloatingLabel>
                                        </Form.Group>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="Liste des probl??mes techniques" title={t("msh_maintenance.m_second_tab_title")}>
                            {!imgFrame ? 
                                <PerfectScrollbar style={{height: "55vh"}}>
                                    <Table striped bordered hover size="sm" className="text-center">
                                        <thead className="bg-dark text-center text-light">
                                            <tr>
                                            <th>{t("msh_general.g_table.t_client")}</th>
                                            <th>{t("msh_general.g_table.t_room")}</th>
                                            <th>{t("msh_general.g_table.t_category")}</th>
                                            <th>{t("msh_general.g_table.t_details")}</th>
                                            <th>{t("msh_general.g_table.t_date")}</th>
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
                                                <td>{flow.room}</td>
                                                <td>{flow.typeClone}</td>
                                                <td>{flow.details}</td>
                                                <td>{moment(flow.markup).format('L')}</td>
                                                {flow.img ? <td style={{cursor: "pointer"}} onClick={() => {
                                                    setImg(flow.img)
                                                    setImgFrame(true)
                                                }}><img src={Picture} style={{width: "1vw"}} /></td> : 
                                                <td>{t("msh_maintenance.m_photo_state")}</td>}
                                                <td>{flow.author}</td>
                                                <td>
                                                <Switch
                                                    checked={flow.status}
                                                    onChange={() => changeIssueStatus(flow.id)}
                                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                />
                                                </td>
                                                <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
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

export default Repair