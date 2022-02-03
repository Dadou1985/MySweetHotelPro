import React, {useState, useEffect } from 'react'
import LostOnes from '../../images/lostNfound.png'
import { Modal, Table, Card, Button, Form, ButtonGroup, ToggleButton } from 'react-bootstrap'
import { db, functions, specialFirestoreOptions } from '../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Picture from '../../svg/picture.svg'
import Close from '../../svg/close.svg'
import Plus from '../../svg/plus3.svg'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Avatar from 'react-avatar'
import defaultImg from "../../images/avatar-client.png"
import FrenchFlag from '../../images/france.png'
import GermanFlag from '../../images/allemagne.png'
import ItalianFlag from '../../images/italie.png'
import SpanishFlag from '../../images/espagne.png'
import PortugueseFlag from '../../images/le-portugal.png'
import EnglishFlag from '../../images/royaume-uni.png'
import Mail from '../../images/email.png'
import Room from '../../images/room2.png'
import Phone from '../../images/phone.png'
import Birthday from '../../images/calendar.png'
import SendMail from '../../images/mail.png'
import Category from '../../images/categories.png'
import CheckoutDate from '../../images/checkout.png'
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles';
import Loader from "react-loader-spinner"
import '../css/loader.css'
import Chat from './chatRoom'
import { useTranslation } from "react-i18next"

const GuestDatabase = ({user, userDB}) =>{
    const { t, i18n } = useTranslation()

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({title: "", gender: "", phone:"", email: "", category: ""})
    const [img, setImg] = useState("")
    const [imgFrame, setImgFrame] = useState(false)
    const [footerState, setFooterState] = useState(true)
    const [filter, setFilter] = useState("High Tech")
    const [item, setItem] = useState({
        img: LostOnes,
        username: t("msh_crm.c_sheet.s_title"),
        details: t("msh_crm.c_sheet.s_subtitle")
    })
    const [selectedUser, setselectedUser] = useState(null)
    const [sendingMail, setSendingMail] = useState(false)
    const [guestMail, setguestMail] = useState([])
    const [IsLoading, setIsLoading] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const [radioValueGender, setRadioValueGender] = useState('male');


    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

    const radiosGender = [
        { name: t("msh_crm.c_gender.g_man"), value: 'male' },
        { name: t("msh_crm.c_gender.g_female"), value: 'female' },
    ];

      const handleChangeCheckbox = (email) => {
        return guestMail.push(email)
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
        const notif = t("msh_crm.c_notif") 
        addNotification(notif)
        return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('chat')
            .doc(formValue.title)
            .set({
                title: formValue.title,
                email: formValue.email,
                gender: radioValueGender,
                guestLanguage: formValue.origin,
                guestCategory: formValue.category,
                phone: formValue.phone,
                markup: Date.now()
                })
        .then(handleClose)
    }

    useEffect(() => {
        const guestOnAir = () => {
          return db.collection('guestUsers')
          .where("hotelVisitedArray", "array-contains", userDB.hotelId)
          }
  
        let unsubscribe = guestOnAir().onSnapshot(function(snapshot) {
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

    const handleDeleteGuest = (guestId) => {
        return db.collection("guestUsers")
            .doc(guestId)
            .update({
                hotelVisitedArray: specialFirestoreOptions.arrayRemove(userDB.hotelId)
            })
    }

    const sendCheckinMail = functions.httpsCallable('sendCheckinMail')

    const handleMailSent = () => {
        setIsLoading(true)
        return sendCheckinMail({hotelName: userDB.hotelName, emails: guestMail, logo: userDB.logo, appLink: userDB.appLink})
    }

    const handleMailSended = () => {
        setSendingMail(false)
        setIsLoading(false)
        setguestMail([])
        return addNotification(t("msh_crm.c_notif_mails"))
    }

    const StyledBadge = withStyles((theme) => ({
        badge: {
          right: -3,
          top: 13,
          border: `2px solid ${theme.palette.background.paper}`,
          padding: '0 4px',
        },
      }))(Badge);

      const renderSwitchFlag = (country) => {
        switch(country) {
            case 'fr':
                return <img src={FrenchFlag} 
                style={{width: "50%", paddingTop: "1vh"}} />
            case 'en':
                return <img src={EnglishFlag} 
                style={{width: "50%", paddingTop: "1vh"}} />
            case 'es':
                return <img src={SpanishFlag} 
                style={{width: "50%", paddingTop: "1vh"}} />
            case 'de':
                return <img src={GermanFlag} 
                style={{width: "50%", paddingTop: "1vh"}} />
            case 'it':
                return <img src={ItalianFlag} 
                style={{width: "50%", paddingTop: "1vh"}} />
            case 'pt':
                return <img src={PortugueseFlag} 
                style={{width: "50%", paddingTop: "1vh"}} />
            default:
                return <img src={FrenchFlag} 
                style={{width: "50%", paddingTop: "1vh"}} />
        }
    }

    console.log("********", item)

    return(
        <div style={{width: "95%"}}>
            <h3 style={{
                width: "100%",
                padding: "1%",
                paddingTop: "2%",
                paddingLeft: "40%"
            }}>{t("msh_crm.c_title")}</h3>
            <div style={{
                display: "flex"
            }}>
                <div style={{
                    width: "50%",
                    padding: "2%",
                }}>
                    <PerfectScrollbar style={{maxHeight: "70vh"}}>
                        <Table hover size="lg" style={{maxHeight: "70vh", border: "transparent"}}>
                            <thead className="text-center">
                                <tr>
                                    <th style={{border: "transparent"}}></th>
                                    <th style={{border: "transparent"}}></th>
                                    <th style={{border: "transparent"}}>{t("msh_general.g_table.t_origin")}</th>
                                    <th style={{border: "transparent"}}>{t("msh_general.g_table.t_category")}</th>
                                    <th style={{border: "transparent"}}>{t("msh_general.g_table.t_connexion")}</th>
                                    <th style={{border: "transparent"}}></th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {info.map(flow =>(
                                    <tr style={{cursor: "pointer"}} onClick={() => {
                                        setItem(flow)
                                        setShowChat(false)}}>
                                        {flow.photo ? 
                                        <td  onClick={() => {
                                        setImg(flow.img)
                                        setImgFrame(true)
                                        }} style={{display: "flex", flexFlow: "row", alignItems: "center"}}>
                                            <Avatar src={flow.photo} round={true} size="70" />
                                        </td> : 
                                        <td style={{display: "flex", flexFlow: "row", alignItems: "center"}} >
                                            <Avatar src={defaultImg} round={true} size="70" />
                                        </td>}
                                        <td>
                                            <span style={{display: "flex", flexFlow: "column", justifyContent: "center", paddingTop: "1vh"}}>
                                                <span style={{fontWeight: "bolder"}}>{flow.username}</span>
                                                {flow.email && <span style={{fontSize: "12px"}}>{flow.email}</span>}
                                            </span>
                                        </td>
                                        <td style={{width: "5vw"}}>{flow.language && renderSwitchFlag(flow.language)}</td>
                                        <td style={{paddingTop: "3vh"}}>{flow.guestCategory && flow.guestCategory}</td>
                                        {flow.hotelId === userDB.hotelId ? 
                                            <td style={{paddingTop: "3vh"}}><StyledBadge badgeContent="" color="primary">.</StyledBadge></td>
                                         : <td style={{paddingTop: "3vh"}}><StyledBadge badgeContent="" color="secondary">.</StyledBadge></td>}
                                        {sendingMail ? 
                                        <Form.Group controlId="formBasicCheckbox" style={{display: "flex", marginTop: "1vh"}}>
                                            <Form.Check type="checkbox" onChange={() => handleChangeCheckbox(flow.email)} style={{marginRight: "1vw"}} /> {t("msh_crm.c_checbox_mail_label")}
                                        </Form.Group> : <td style={{paddingTop: "3vh"}}>
                                            <Button variant="outline-danger" size="sm" onClick={()=> {
                                                handleDeleteGuest(flow.id)
                                                setItem({
                                                    img: LostOnes,
                                                    username: t("msh_crm.c_sheet.s_title"),
                                                    details: t("msh_crm.c_sheet.s_subtitle")
                                                })
                                            }}>{t("msh_general.g_button.b_delete")}</Button>
                                        </td>}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </PerfectScrollbar>
                    <div style={{display: "flex", justifyContent: "flex-end"}}>
                        {sendingMail ? 
                            IsLoading ? <Loader type="Puff" color="#000" height={15} width={15} timeout={10000} /> : <span>
                            <Button variant="outline-dark" style={{marginRight: "1vw"}} onClick={() => setSendingMail(false)}>{t("msh_crm.c_button.b_cancel")}</Button>
                            <Button variant="dark" onClick={async() => {
                            await handleMailSent()
                            return handleMailSended()
                            }}>{t("msh_crm.c_button.b_send_em_all")}</Button>
                        </span>
                            : <Button variant="outline-dark" onClick={() => setSendingMail(true)}>{t("msh_crm.c_button.b_send_mail")}</Button>}
                        {!sendingMail && <Button variant="dark" style={{marginLeft: "1vw"}} onClick={handleShow}>{t("msh_crm.c_button.b_add")}</Button>}
                    </div>


                <Modal show={list}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        onHide={handleClose}
                        >
                        <Modal.Header closeButton className="bg-light">
                            <Modal.Title id="contained-modal-title-vcenter">
                            {t("msh_crm.c_button.b_add")}
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
                                        <Form.Group controlId="formGroupName">
                                            <ButtonGroup className="mb-2">
                                                {radiosGender.map((radio, idx) => (
                                                <ToggleButton
                                                    key={idx}
                                                    id={`radio-${idx}`}
                                                    type="radio"
                                                    variant="secondary"
                                                    name="radio"
                                                    value={radio.value}
                                                    checked={radioValueGender === radio.value}
                                                    onChange={(e) => setRadioValueGender(e.currentTarget.value)}
                                                >
                                                    {radio.name}
                                                </ToggleButton>
                                                ))}
                                            </ButtonGroup>
                                        </Form.Group>
                                        <Form.Row>
                                            <Form.Group controlId="description">
                                            <Form.Label>{t("msh_crm.c_client")}</Form.Label>
                                            <Form.Control type="text" placeholder="ex: Jane Doe" style={{width: "20vw"}} value={formValue.title} name="title" onChange={handleChange} />
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group controlId="description">
                                            <Form.Label>{t("msh_crm.c_email")}</Form.Label>
                                            <Form.Control type="text" placeholder="ex: jane.doe@msh.com" style={{width: "20vw"}} value={formValue.email} name="email" onChange={handleChange} />
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group controlId="description">
                                            <Form.Label>{t("msh_crm.c_phone")}</Form.Label>
                                            <Form.Control type="text" placeholder="ex: 0654789321" style={{width: "20vw"}} value={formValue.phone} name="phone" onChange={handleChange} />
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group controlId="exampleForm.SelectCustom">
                                            <Form.Label>{t("msh_crm.c_origin.o_label")}</Form.Label><br/>
                                                <select class="selectpicker" value={formValue.origin} name="origin" onChange={handleChange} 
                                                style={{width: "20vw", 
                                                height: "4vh", 
                                                border: "1px solid lightgrey", 
                                                borderRadius: "3px",
                                                backgroundColor: "white"}}>
                                                    <option></option>
                                                    <option value="fr">France</option>
                                                    <option value="en">Royaume-uni</option>
                                                    <option value="de">Allemagne</option>
                                                    <option value="es">Espagne</option>
                                                    <option value="it">Italie</option>
                                                    <option value="pt">Portugal</option>
                                                </select>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group controlId="exampleForm.SelectCustom">
                                            <Form.Label>{t("msh_crm.c_category.c_label")}</Form.Label><br/>
                                            <select class="selectpicker" value={formValue.category} name="category" onChange={handleChange} 
                                            style={{width: "10vw", 
                                            height: "60%", 
                                            border: "1px solid lightgrey", 
                                            borderRadius: "3px",
                                            backgroundColor: "white", 
                                            paddingLeft: "1vw"}}>
                                                <option></option>
                                                <option>{t("msh_crm.c_category.c_tourisim")}</option>
                                                <option>{t("msh_crm.c_category.c_business")}</option>
                                            </select>
                                            </Form.Group>
                                        </Form.Row>
                                    </div>
                        </Modal.Body>
                        {footerState && <Modal.Footer>
                            <Button variant="dark" onClick={handleSubmit}>{t("msh_general.g_button.b_send")}</Button>
                        </Modal.Footer>}
                    </Modal>
                </div>
                <div style={{width: "25%", padding: "2%"}}>
                <PerfectScrollbar style={{mawHeight: "75vh"}}>
                    <Card style={{ width: '100%', borderRadius: "10px", maxHeight: "70vh" }}>
                        <Card.Img variant="top" src={item.photo ? item.photo : defaultImg} style={{width: "100%"}} />
                        <Card.Body style={{
                            display: "flex",
                            flexFlow: "column",
                            alignItems: "center"
                            }}>
                            <Card.Title style={{
                                            fontWeight: "bolder", 
                                            fontSize: "1.5em", 
                                            borderBottom: "1px solid lightgrey", 
                                            width: "100%", 
                                            textAlign: "center", 
                                            paddingBottom: "1vh"}}>{item.username}</Card.Title>
                            {item.email && <Card.Text style={{paddingLeft: "1vw"}}>
                                <img src={Mail} style={{width: "5%", marginRight: "1vw"}} />
                            {item.email}
                            </Card.Text>}
                            {item.room && item.checkoutDate && <Card.Text style={{paddingLeft: "1vw"}}>
                            <img src={Room} style={{width: "5%", marginRight: "1vw"}} />
                            {item.room}
                            </Card.Text>}
                            {item.checkoutDate && <Card.Text style={{paddingLeft: "1vw"}}>
                            <img src={CheckoutDate} style={{width: "5%", marginRight: "1vw"}} />
                            {item.checkoutDate}
                            </Card.Text>}
                            {item.phone && <Card.Text style={{paddingLeft: "1vw"}}>
                            <img src={Phone} style={{width: "5%", marginRight: "1vw"}} />
                            {item.phone}
                            </Card.Text>}
                            {item.email && <Card.Text style={{paddingLeft: "1vw"}}>
                            <img src={Birthday} style={{width: "5%", marginRight: "1vw"}} />
                            {moment(item.lastTimeConnected).format('LL')}
                            </Card.Text>}
                            {item.email && <div style={{display: "flex", flexFlow: "row", justifyContent: "space-around", width: "95%"}}>
                                {/*<Button variant="outline-dark">{t("msh_crm.c_button.b_contact")}</Button>*/}
                                <Button variant="outline-dark" onClick={() => setShowChat(true)}>{t("msh_crm.c_button.b_chat")}</Button>
                                </div>}
                            {item.details && <Card.Text style={{textAlign: "center", marginBottom: "5vh", marginTop: "2vh", color: "gray"}}>
                                {item.details}
                            </Card.Text>}
                        </Card.Body>
                    </Card>
                </PerfectScrollbar>
                </div>
                {showChat && <div style={{width: "25%", padding: "2%"}}>
                    <h4 style={{textAlign: "center", borderBottom: "1px solid lightgrey", padding: "1vh"}}>{t("msh_crm.c_chat_title")}</h4>
                    <PerfectScrollbar style={{maxHeight: "70vh"}}>
                        <Chat user={user} userDB={userDB} title={item.username} />
                    </PerfectScrollbar>
                </div>}
            </div>
        </div>
    )
}

export default GuestDatabase
