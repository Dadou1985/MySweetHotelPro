import React, {useState, useEffect } from 'react'
import { 
    Form, 
    Button, 
    Table, 
    Tabs, 
    Tab, 
    Modal, 
    FloatingLabel 
} from 'react-bootstrap'
import Maintenance from '../../../svg/repair.svg'
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
import { fetchCollectionBySorting, fetchCollectionByMapping } from '../../../helper/globalCommonFunctions'
import {
    handleChange,
    handleSubmit,
    handleUpdateHotelData,
    deleteData
} from '../../../helper/formCommonFunctions'

const Repair = ({userDB}) =>{

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({
        room: "", 
        client: "",
        details: "", 
        type: "paint"
    })
    const [typeClone, setTypeClone] = useState(null)
    const [issueQty, setIssueQty] = useState([])
    const [img, setImg] = useState("")
    const [imgFrame, setImgFrame] = useState(false)
    const [footerState, setFooterState] = useState(true)
    const { t } = useTranslation()

    const handleShow = () => setList(true)
    const handleClose = () => {
        setList(false)
        setFormValue("")
    }

    const notif = t("msh_maintenance.m_notif")
    const dataStatus = {status: false} 
    const tooltipTitle = t("msh_toolbar.tooltip_technical")
    const modalTitle = t("msh_maintenance.m_title")
    
    const newData = {
        author: userDB.username,
        date: new Date(),
        details: formValue.details,
        client: formValue.client,
        room: formValue.room,
        markup: Date.now(),
        type: formValue.type,
        typeClone: typeClone !== null ? typeClone : t("msh_dashboard.maintenance_data.d_paint"),
        status: false
    }
    
    useEffect(() => {
       let unsubscribe = fetchCollectionBySorting(userDB.hotelId, "maintenance", "markup", "asc").onSnapshot(function(snapshot) {
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
        let unsubscribe = fetchCollectionByMapping(userDB.hotelId, "maintenance", "status", "==", true).onSnapshot(function(snapshot) {
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

    return(
        <div>
            <StyledBadge badgeContent={issueQty.length} color="secondary">
                <BadgeContent tooltipTitle={tooltipTitle} icon={Maintenance} handleShow={handleShow} />
            </StyledBadge>            
            <Modal show={list}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleClose}
                >
                <ModalHeaderFormTemplate title={modalTitle} />
                <Modal.Body>
                    <Tabs defaultActiveKey="Signaler un problème technique" id="uncontrolled-tab-example" onSelect={(eventKey) => {
                        if(eventKey === 'Liste des problèmes techniques'){
                            return setFooterState(false)
                        }else{
                            return setFooterState(true)
                        }
                    }}>
                        <Tab eventKey="Signaler un problème technique" title={t("msh_maintenance.m_first_tab_title")}>
                            <div style={{
                                    display: "flex",
                                    flexFlow: "column",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    padding: "5%",
                                    textAlign: "center"
                                }}>
                                    <InputElement
                                        containerStyle={{marginBottom: "2vh"}} 
                                        label={t("msh_maintenance.m_client")}
                                        placeholder="ex: Jane Doe"
                                        size="20vw"
                                        value={formValue.client}
                                        name="client"
                                        handleChange={handleChange}
                                        setFormValue={setFormValue}
                                    />
                                    <InputElement
                                        containerStyle={{marginBottom: "2vh"}} 
                                        label={t("msh_maintenance.m_room")}
                                        placeholder="ex: 409"
                                        size="20vw"
                                        value={formValue.room}
                                        name="room"
                                        handleChange={handleChange}
                                        setFormValue={setFormValue}
                                    />
                                    <div style={{marginBottom: "2vh"}}>
                                        <Form.Group controlId="exampleForm.SelectCustom">
                                        <FloatingLabel
                                            controlId="floatingInput"
                                            label={t("msh_maintenance.m_type.t_label")}
                                            className="mb-3"
                                        >
                                            <Form.Select className="selectpicker" value={formValue.type} name="type" onChange={(event) => handleChange(event, setFormValue)} 
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
                                    <TextareaElement
                                        label={t("msh_maintenance.m_details")}
                                        row="3"
                                        value={formValue.details} 
                                        name="details" 
                                        handleChange={handleChange}
                                        setFormValue={setFormValue}
                                        size={{width: "20vw", maxHeight: "15vh"}}
                                    />
                                </div>
                            </Tab>
                            <Tab eventKey="Liste des problèmes techniques" title={t("msh_maintenance.m_second_tab_title")}>
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
                                                    onChange={() => handleUpdateHotelData(userDB.hotelId, "maintenance", flow.id, dataStatus)}
                                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                />
                                                </td>
                                                <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
                                                    if(flow.img){
                                                        handleDeleteImg(flow.img)
                                                    }
                                                        deleteData(userDB.hotelId, "maintenance", flow.id)
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
                            return handleSubmit(
                                event, 
                                notif, 
                                userDB.hotelId, 
                                "maintenance", 
                                newData, 
                                handleClose)
                        }}>{t("msh_general.g_button.b_send")}</Button>
                    </Modal.Footer>}
                </Modal>
        </div>
    )
}

export default Repair