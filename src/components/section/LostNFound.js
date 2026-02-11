import React, { useState, useEffect, useContext } from 'react'
import LostOnes from '../../images/lostNfound.png'
import { Form, Button, Table, Tabs, Tab, Card, Modal, FloatingLabel } from 'react-bootstrap'
import { storage, FirebaseContext } from '../../Firebase'
import moment from 'moment'
import Picture from '../../svg/picture.svg'
import { StaticImage } from 'gatsby-plugin-image'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from "react-i18next"
import { handleChange } from '../../helper/formCommonFunctions'
import { addNotification, fetchCollectionByCombo2, handleDeleteData2, handleSubmitData2 } from '../../helper/globalCommonFunctions'
import ModalHeaderFormTemplate from '../../helper/common/modalHeaderFormTemplate'
import InputElement from '../../helper/common/InputElement'
import TextareaElement from '../../helper/common/textareaElement'
import AddPhotoURL from '../../svg/camera.svg'

const LostNFound = () =>{
    const { userDB } = useContext(FirebaseContext)
    const { t } = useTranslation()

    const [list, setList] = useState(false)
    const [showObject, setShowObject] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({type: "tech", place: "hall", details: "", description: ""})
    const [typeClone, setTypeClone] = useState("")
    const [placeClone, setPlaceClone] = useState("test")
    const [newImg, setNewImg] = useState(null)
    const [img, setImg] = useState("")
    const [imgFrame, setImgFrame] = useState(false)
    const [filter, setFilter] = useState("tech")
    const [item, setItem] = useState({
        img: LostOnes,
        description: t("msh_lost_found.l_sheet.s_title"),
        details: t("msh_lost_found.l_sheet.s_subtitle")
    })
    const [url, setUrl] = useState("")

    const notif = t("msh_lost_found.l_notif")
    const modalTitle = t("msh_lost_found.l_button.b_add")
    const newData = {
        author: userDB.username,
        date: new Date(),
        description: formValue.description,
        details: formValue.details,
        place: formValue.place,
        placeClone: placeClone !== "" ? placeClone : t("msh_lost_found.l_place.p_hall"),
        markup: Date.now(),
        type: formValue.type,
        typeClone: typeClone !== "" ? typeClone : "High Tech",
        status: false,
        img: url
    }

    const handleClose = () => setList(false)
    const handleShow = () => setList(true)
    const handleShowObject = () => setShowObject(true)
    const handleImgChange = (event) => {
        if (event.target.files[0]){
            setNewImg(event.target.files[0])
        }
    }

    useEffect(() => {
        let unsubscribe = fetchCollectionByCombo2("hotels", userDB.hotelId, "lostAndFound", "type", "==", filter, "markup", "asc").onSnapshot(function(snapshot) {
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
    },[filter])

    const handleSubmit = (event) =>{
        event.preventDefault()
        if(newImg !== null) {
            const uploadTask = storage.ref(`msh-photo-lost/${newImg.name}`).put(newImg)
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {console.log(error)},
          async() => {
            const url = await storage
              .ref("msh-photo-lost")
              .child(newImg.name)
              .getDownloadURL()
              const uploadTask = () => {
                handleSubmitData2(event, "hotels", userDB.hotelId, "lostAndFound", newData)
                }
                  return setUrl(url, uploadTask())
          }
        )
        }else{
            handleSubmitData2(event, "hotels", userDB.hotelId, "lostAndFound", newData)
        }
        
    }

    console.log("88888888888888888", placeClone)

    return(
        <div style={{width: "95%"}}>
            <h3 style={{
                width: "100%",
                padding: "1%",
                paddingTop: "2%",
                paddingLeft: "40%"
            }}>{t("msh_lost_found.l_title")}</h3>
            <div style={{
                display: "flex"
            }}>
                <div style={{
                    width: window?.innerWidth > 1023 ? "75%" : "99%",
                    padding: "1%",
                }}>
                <Tabs defaultActiveKey="High Tech" id="uncontrolled-tab-example" onSelect={(eventKey) => {
                    if(eventKey === "High Tech") {return setFilter("tech")}
                    if(eventKey === "Documents") {return setFilter("ids")}
                    if(eventKey === "Vêtements") {return setFilter("clothes")}
                    if(eventKey === "Autres") {return setFilter("others")}
                }}>
                    <Tab eventKey="High Tech" title="High Tech"></Tab>
                    <Tab eventKey="Documents" title={t("msh_lost_found.l_second_tab_title")}></Tab>
                    <Tab eventKey="Vêtements" title={t("msh_lost_found.l_third_tab_title")}></Tab>
                    <Tab eventKey="Autres" title={t("msh_lost_found.l_fourth_tab_title")}></Tab>
                </Tabs>
                    <PerfectScrollbar style={{height: "auto", maxHeight: "100%"}}>
                        <Table striped bordered hover className="text-center" style={{maxHeight: "100%"}}>
                            <thead className="bg-dark text-center text-light">
                                <tr>
                                    <th>{t("msh_general.g_table.t_photo")}</th>
                                    <th>{t("msh_general.g_table.t_description")}</th>
                                    <th>{t("msh_general.g_table.t_date")}</th>
                                    <th>{t("msh_general.g_table.t_place")}</th>
                                    <th>{t("msh_general.g_table.t_coworker")}</th>
                                    <th className="bg-dark"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {info.map(flow =>(
                                    <tr key={flow.id} style={{cursor: "pointer"}} onClick={() => {
                                        setItem(flow)
                                        window?.innerWidth < 1439 && handleShowObject(true)
                                        }}>
                                        {flow.img ? <td style={{cursor: "pointer"}} onClick={() => {
                                        setImg(flow.img)
                                        setImgFrame(true)
                                        }}><img src={flow.img} style={{height: "49px", borderRadius: "5%"}} /></td> : 
                                        <td><StaticImage objectFit='contain' src='../../svg/picture.svg' style={{width: "1vw"}} /></td>}
                                        <td>{flow.description}</td>
                                        <td>{moment(flow.markup).format('L')}</td>
                                        <td>{flow.placeClone}</td>
                                        <td>{flow.author}</td>
                                        <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
                                            return handleDeleteData2("hotels", userDB.hotelId, "lostAndFound", flow.id)
                                        }}>{t("msh_general.g_button.b_delete")}</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </PerfectScrollbar>
                    <div style={{display: "flex", justifyContent: "flex-end"}}>
                        <Button className='btn-msh' style={{marginLeft: "1vw"}} onClick={handleShow}>{t("msh_lost_found.l_button.b_add")}</Button>
                    </div>


                <Modal show={list}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        onHide={handleClose}
                        >
                        <ModalHeaderFormTemplate title={modalTitle} />
                        <Modal.Body style={{width: "100%"}}>
                                <div style={{
                                        display: "flex",
                                        flexFlow: "column",
                                        justifyContent: "space-around",
                                        alignItems: "center",
                                        padding: "5%",
                                        textAlign: "center",
                                        width: "100%"
                                    }}>
                                        <div style={{marginBottom: "2vh", width: "90%"}}>
                                            <Form.Group controlId="exampleForm.SelectCustom">
                                            <FloatingLabel
                                            controlId="floatingInput"
                                            label={t("msh_lost_found.l_type.t_label")}
                                            className="mb-3">
                                                <Form.Select className="selectpicker" value={formValue.type} name="type" onChange={(event) => handleChange(event, setFormValue)} 
                                                style={{width: "100%", 
                                                height: "60%", 
                                                border: "1px solid lightgrey", 
                                                borderRadius: "3px",
                                                backgroundColor: "white"}}>
                                                    <option value="tech">High Tech</option>
                                                    <option value="ids">{t("msh_lost_found.l_second_tab_title")}</option>
                                                    <option value="clothes">{t("msh_lost_found.l_third_tab_title")}</option>
                                                    <option value="others">{t("msh_lost_found.l_fourth_tab_title")}</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                            </Form.Group>
                                        </div>
                                        <div style={{marginBottom: "2vh", width: "90%"}}>
                                            <Form.Group controlId="exampleForm.SelectCustom">
                                            <FloatingLabel
                                            controlId="floatingInput"
                                            label={t("msh_lost_found.l_place.p_label")}
                                            className="mb-3">
                                                <Form.Select className="selectpicker" value={formValue.place} name="place" onChange={(event) => handleChange(event, setFormValue)} onClick={(event) => {
                                                    if (event.target.value === "hall") {setPlaceClone(t("msh_lost_found.l_place.p_hall"))}
                                                    if(event.target.value === "restaurant") {setPlaceClone(t("msh_lost_found.l_place.p_restaurant"))}
                                                    if(event.target.value === "parking") {setPlaceClone(t("msh_lost_found.l_place.p_parking"))}
                                                    if(event.target.value === "toilet") {setPlaceClone(t("msh_lost_found.l_place.p_toilet"))}
                                                    if(event.target.value === "floors") {setPlaceClone(t("msh_lost_found.l_place.p_floors"))}
                                                    if(event.target.value === "others") {setPlaceClone(t("msh_lost_found.l_place.p_other"))}
                                                }}
                                                style={{width: "100%", 
                                                height: "60%", 
                                                border: "1px solid lightgrey", 
                                                borderRadius: "3px",
                                                backgroundColor: "white"}}>
                                                    <option value="hall">{t("msh_lost_found.l_place.p_hall")}</option>
                                                    <option value="restaurant">{t("msh_lost_found.l_place.p_restaurant")}</option>
                                                    <option value="parking">{t("msh_lost_found.l_place.p_parking")}</option>
                                                    <option value="toilet">{t("msh_lost_found.l_place.p_toilet")}</option>
                                                    <option value="floors">{t("msh_lost_found.l_place.p_floors")}</option>
                                                    <option value="others">{t("msh_lost_found.l_place.p_other")}</option>
                                                </Form.Select>
                                            </FloatingLabel>
                                            </Form.Group>
                                        </div>
                                        <InputElement
                                            containerStyle={{marginBottom: "2vh", width: "90%"}} 
                                            label={t("msh_lost_found.l_description.d_label")}
                                            placeholder="ex: Jane Doe"
                                            size="100%"
                                            value={formValue.description}
                                            name="description"
                                            handleChange={handleChange}
                                            setFormValue={setFormValue}
                                        />
                                        <div style={{width: "90%"}}>
                                            <TextareaElement
                                                label={t("msh_lost_found.l_details")}
                                                row="3"
                                                value={formValue.details} 
                                                name="details" 
                                                handleChange={handleChange}
                                                setFormValue={setFormValue}
                                                size={{width: "100%", maxHeight: "30vh"}}
                                            /> 
                                        </div>
                                        <div style={{marginTop: "2vh", marginBottom: "2vh", display: "flex", flexFlow: 'row wrap', justifyContent: "center", alignItems: "center", width: "fit-content", position: "relative"}}>
                                            <input type="file" className="phone-camera-icon"
                                                onChange={handleImgChange} />
                                            <img src={AddPhotoURL} style={{width: "5em"}} alt="uploadIcon" />
                                            <div style={{width: "100%"}}>{t("msh_general.g_button.b_add_photo")}</div>
                                        </div>
                                    </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className='btn-msh' onClick={(event) => {
                                setFormValue("")
                                addNotification(notif, userDB.hotelId)
                                return handleClose()
                            }}>{t("msh_general.g_button.b_send")}</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                {window?.innerWidth > 1023 ? <div style={{width: "25%", padding: "3%"}}>
                <Card style={{ width: '100%', borderRadius: "5px", textAlign: "center" }}>
                    <Card.Img variant="top" src={item.img ? item.img : Picture} style={{width: "100%", filter: item.img !== LostOnes ? "none" : "grayscale() drop-shadow(1px 1px 1px)"}} />
                    <Card.Body>
                        <Card.Title style={{fontWeight: "bolder", borderBottom: "1px solid #B8860B", paddingBottom: "1vh"}}>{item.description}</Card.Title>
                        <Card.Text>
                        {item.details}
                        </Card.Text>
                        {/*<Button variant="outline-dark">{t("msh_lost_found.l_button.b_send")}</Button>*/}
                    </Card.Body>
                </Card>
                </div> : <Modal show={showObject}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={() => setShowObject(false)}
                    >
                    <ModalHeaderFormTemplate title={modalTitle} />
                    <Modal.Body>
                        <Card style={{ width: '100%', borderRadius: "5px", textAlign: "center" }}>
                            <Card.Img variant="top" src={item.img ? item.img : Picture} style={{width: "100%", filter: item.img !== LostOnes ? "none" : "grayscale() drop-shadow(1px 1px 1px)"}} />
                            <Card.Body>
                                <Card.Title style={{fontWeight: "bolder", borderBottom: "1px solid #B8860B", paddingBottom: "1vh"}}>{item.description}</Card.Title>
                                <Card.Text>
                                {item.details}
                                </Card.Text>
                                {/*<Button variant="outline-dark">{t("msh_lost_found.l_button.b_send")}</Button>*/}
                            </Card.Body>
                        </Card>
                    </Modal.Body>
                </Modal>}
            </div>
        </div>
    )
}

export default LostNFound
