import React, {useState, useEffect } from 'react'
import LostOnes from '../../images/lostNfound.png'
import { Form, Button, Table, Tabs, Tab, Card, Modal } from 'react-bootstrap'
import { db } from '../../Firebase'
import moment from 'moment'
import Picture from '../../svg/picture.svg'
import Close from '../../svg/close.svg'
import Plus from '../../svg/plus3.svg'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from "react-i18next"


const LostNFound = ({userDB}) =>{
    const { t, i18n } = useTranslation()


    const [list, setList] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({type: "", place: "", details: "", description: ""})
    const [img, setImg] = useState("")
    const [imgFrame, setImgFrame] = useState(false)
    const [footerState, setFooterState] = useState(true)
    const [filter, setFilter] = useState("High Tech")
    const [item, setItem] = useState({
        img: LostOnes,
        description: t("msh_lost_found.l_sheet.s_title"),
        details: t("msh_lost_found.l_sheet.s_subtitle")
    })

    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

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
        const notif = t("msh_lost_found.l_notif") 
        addNotification(notif)
        return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('lostAndFound')
            .add({
            author: userDB.username,
            date: new Date(),
            description: formValue.description,
            details: formValue.details,
            place: formValue.place,
            markup: Date.now(),
            type: formValue.type,
            status: false
            })
        .then(handleClose)
    }

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('lostAndFound')
            .where("type", "==", filter)
            .orderBy("markup")
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
           
     },[filter])

     console.log("/*/**/*/*", filter)

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
                    width: "75%",
                    padding: "1%",
                }}>
                <Tabs defaultActiveKey="High Tech" id="uncontrolled-tab-example" onSelect={(eventKey) => {
                    if(eventKey === "High Tech") {return setFilter("High Tech")}
                    if(eventKey === "Documents") {return setFilter("Documents Officiels")}
                    if(eventKey === "Vêtements") {return setFilter("Vêtements")}
                    if(eventKey === "Autres") {return setFilter("Autres")}
                }}>
                    <Tab eventKey="High Tech" title="High Tech"></Tab>
                    <Tab eventKey="Documents" title={t("msh_lost_found.l_second_tab_title")}></Tab>
                    <Tab eventKey="Vêtements" title={t("msh_lost_found.l_third_tab_title")}></Tab>
                    <Tab eventKey="Autres" title={t("msh_lost_found.l_fourth_tab_title")}></Tab>
                </Tabs>
                    <PerfectScrollbar style={{maxHeight: "70vh"}}>
                        <Table striped bordered hover size="sm" className="text-center" style={{maxHeight: "70vh"}}>
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
                                    <tr key={flow.id} style={{cursor: "pointer"}} onClick={() => setItem(flow)}>
                                        {flow.img ? <td style={{cursor: "pointer"}} onClick={() => {
                                        setImg(flow.img)
                                        setImgFrame(true)
                                        }}><img src={flow.img} style={{width: "5vw", borderRadius: "5%"}} /></td> : 
                                        <td><img src={Picture} style={{width: "1vw"}} /></td>}
                                        <td>{flow.description}</td>
                                        <td>{moment(flow.markup).format('L')}</td>
                                        <td>{flow.place}</td>
                                        <td>{flow.author}</td>
                                        <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
                                            return db.collection('hotels')
                                            .doc(userDB.hotelId)
                                            .collection("lostAndFound")
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
                    </PerfectScrollbar>
                    <div style={{display: "flex", justifyContent: "flex-end"}}>
                        <Button variant="dark" style={{marginLeft: "1vw"}} onClick={handleShow}>{t("msh_lost_found.l_button.b_add")}</Button>
                    </div>


                <Modal show={list}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        onHide={handleClose}
                        >
                        <Modal.Header closeButton className="bg-light">
                            <Modal.Title id="contained-modal-title-vcenter">
                            {t("msh_lost_found.l_button.b_add")}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                                <div style={{
                                        display: "flex",
                                        flexFlow: "column",
                                        justifyContent: "space-around",
                                        alignItems: "center",
                                        padding: "5%",
                                        textAlign: "center"
                                    }}>
                                        <Form.Row>
                                            <Form.Group controlId="exampleForm.SelectCustom">
                                            <Form.Label>{t("msh_lost_found.l_type.t_label")}</Form.Label><br/>
                                                <select class="selectpicker" value={formValue.type} name="type" onChange={handleChange} 
                                                style={{width: "20vw", 
                                                height: "4vh", 
                                                border: "1px solid lightgrey", 
                                                borderRadius: "3px",
                                                backgroundColor: "white"}}>
                                                    <option></option>
                                                    <option>High Tech</option>
                                                    <option>{t("msh_lost_found.l_second_tab_title")}</option>
                                                    <option>{t("msh_lost_found.l_third_tab_title")}</option>
                                                    <option>{t("msh_lost_found.l_fourth_tab_title")}</option>
                                                </select>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group controlId="exampleForm.SelectCustom">
                                            <Form.Label>{t("msh_lost_found.l_place.p_label")}</Form.Label><br/>
                                                <select class="selectpicker" value={formValue.place} name="place" onChange={handleChange} 
                                                style={{width: "20vw", 
                                                height: "4vh", 
                                                border: "1px solid lightgrey", 
                                                borderRadius: "3px",
                                                backgroundColor: "white"}}>
                                                    <option></option>
                                                    <option>{t("msh_lost_found.l_place.p_hall")}</option>
                                                    <option>{t("msh_lost_found.l_place.p_restaurant")}</option>
                                                    <option>{t("msh_lost_found.l_place.p_parking")}</option>
                                                    <option>{t("msh_lost_found.l_place.p_toilet")}</option>
                                                    <option>{t("msh_lost_found.l_place.p_floors")}</option>
                                                    <option>{t("msh_lost_found.l_place.p_other")}</option>
                                                </select>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group controlId="description">
                                            <Form.Label>{t("msh_lost_found.l_description.d_label")}</Form.Label>
                                            <Form.Control type="text" placeholder={t("msh_lost_found.l_description.d_placeholder")} style={{width: "20vw"}} value={formValue.description} name="description" onChange={handleChange} />
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group controlId="details">
                                                <Form.Label>{t("msh_lost_found.l_details")}</Form.Label>
                                                <Form.Control as="textarea" rows="3" style={{width: "20vw", maxHeight: "30vh"}} value={formValue.details} name="details" onChange={handleChange}  />
                                            </Form.Group>
                                        </Form.Row>
                                    </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="dark" onClick={handleSubmit}>{t("msh_general.g_button.b_send")}</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div style={{width: "25%", padding: "3%"}}>
                <Card style={{ width: '100%', borderRadius: "5px", textAlign: "center" }}>
                    <Card.Img variant="top" src={item.img ? item.img : Picture} style={{width: "100%", filter: item.img !== LostOnes ? "none" : "grayscale() drop-shadow(1px 1px 1px)"}} />
                    <Card.Body>
                        <Card.Title style={{fontWeight: "bolder", borderBottom: "1px solid lightgrey", paddingBottom: "1vh"}}>{item.description}</Card.Title>
                        <Card.Text>
                        {item.details}
                        </Card.Text>
                        {/*<Button variant="outline-dark">{t("msh_lost_found.l_button.b_send")}</Button>*/}
                    </Card.Body>
                </Card>
                </div>
            </div>
        </div>
    )
}

export default LostNFound
