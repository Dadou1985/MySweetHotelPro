import React, {useState, useEffect } from 'react'
import LostOnes from '../../images/lostNfound.png'
import { Modal, Table, Card, Button, Form, ButtonGroup, ToggleButton, FloatingLabel, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { functions, specialFirestoreOptions } from '../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import PerfectScrollbar from 'react-perfect-scrollbar'
import Avatar from 'react-avatar'
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles';
import {Loader} from "react-loader-spinner"
import Chat from './chatRoom'
import { useTranslation } from "react-i18next"
import TimeLine from './guestTimeLine'
import defaultImg from "../../images/avatar-client.png"
import { StaticImage } from 'gatsby-plugin-image'
import { addNotification, handleCreateData2, fetchCollectionByMapping1, handleUpdateData1 } from '../../helper/globalCommonFunctions'
import { handleChange } from '../../helper/formCommonFunctions'
import InputElement from '../../helper/common/InputElement'
import ModalHeaderFormTemplate from '../../helper/common/modalHeaderFormTemplate'
import '../css/common/loader.css'

/* 
 ! FIX => OVERLAYTRIGGER TOOLTIP POSITION (CHAT)
*/

const GuestDatabase = ({user, userDB}) =>{
    const { t } = useTranslation()

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({title: "", gender: "", phone:"", email: "", category: ""})
    const [categoryClone, setCategoryClone] = useState("")
    const [img, setImg] = useState("")
    const [imgFrame, setImgFrame] = useState(false)
    const [footerState, setFooterState] = useState(true)
    const [item, setItem] = useState({
        img: LostOnes,
        username: t("msh_crm.c_sheet.s_title"),
        details: t("msh_crm.c_sheet.s_subtitle")
    })
    const [showChat, setShowChat] = useState(false)
    const [sendingMail, setSendingMail] = useState(false)
    const [guestMail, setguestMail] = useState([])
    const [IsLoading, setIsLoading] = useState(false)
    const [guestId, setGuestId] = useState(null)
    const [radioValueGender, setRadioValueGender] = useState('male');

    const userDataRemoved = {hotelVisitedArray: specialFirestoreOptions.arrayRemove(userDB.hotelId)}
    const emailSentNotif = t("msh_crm.c_notif_mails")
    const userCreationNotif = t("msh_crm.c_notif") 
    const modalTitle = t("msh_crm.c_button.b_add")

    const userDataCreated = {
        title: formValue.title,
        email: formValue.email,
        gender: radioValueGender,
        guestLanguage: formValue.origin,
        guestCategory: formValue.category,
        guestCategoryClone: categoryClone !== "" ? categoryClone : t("msh_crm.c_category.c_tourisim"),
        phone: formValue.phone,
        markup: Date.now()
    }

    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

    const radiosGender = [
        { name: t("msh_crm.c_gender.g_man"), value: 'male' },
        { name: t("msh_crm.c_gender.g_female"), value: 'female' },
    ];

      const handleChangeCheckbox = (email) => {
        return guestMail.push(email)
    }

    useEffect(() => {
        let unsubscribe = fetchCollectionByMapping1("guestUsers", "hotelVisitedArray", "array-contains", userDB.hotelId).onSnapshot(function(snapshot) {
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

    const handleDeleteGuest = (guestId) => {
        return handleUpdateData1("guestUsers", guestId, userDataRemoved)
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
        return addNotification(emailSentNotif, userDB.hotelId)
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
                return <StaticImage objectFit='contain' placeholder="blurred" src='../../images/france.png' 
                style={{width: "50%", paddingTop: "1vh"}} />
            case 'en':
                return <StaticImage objectFit='contain' placeholder="blurred" src='../../images/royaume-uni.png' 
                style={{width: "50%", paddingTop: "1vh"}} />
            case 'es':
                return <StaticImage objectFit='contain' placeholder="blurred" src='../../images/espagne.png' 
                style={{width: "50%", paddingTop: "1vh"}} />
            case 'de':
                return <StaticImage objectFit='contain' placeholder="blurred" src='../../images/allemagne.png' 
                style={{width: "50%", paddingTop: "1vh"}} />
            case 'it':
                return <StaticImage objectFit='contain' placeholder="blurred" src='../../images/italie.png' 
                style={{width: "50%", paddingTop: "1vh"}} />
            case 'pt':
                return <StaticImage objectFit='contain' placeholder="blurred" src='../../images/le-portugal.png' 
                style={{width: "50%", paddingTop: "1vh"}} />
            default:
                return <StaticImage objectFit='contain' placeholder="blurred" src={'../../images/france.png'} 
                style={{width: "50%", paddingTop: "1vh"}} />
        }
    }
        
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
                    <PerfectScrollbar style={{maxHeight: "65vh"}}>
                        <Table hover size="lg" style={{maxHeight: "100%", border: "transparent"}}>
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
                                        setGuestId(flow.id)}}>
                                        {flow.photo ? 
                                        <td  onClick={() => {
                                        setImg(flow.img)
                                        setImgFrame(true)
                                        }} style={{display: "flex", flexFlow: "row", alignItems: "center"}}>
                                            <Avatar src={flow.photo} round={true} size="70" style={{filter: "drop-shadow(2px 4px 6px)"}} />
                                        </td> : 
                                        <td style={{display: "flex", flexFlow: "row", alignItems: "center"}} >
                                            <Avatar src={defaultImg} round={true} size="70" style={{filter: "drop-shadow(2px 4px 6px)"}} />
                                        </td>}
                                        <td>
                                            <span style={{display: "flex", flexFlow: "column", justifyContent: "center", paddingTop: "1vh"}}>
                                                <span style={{fontWeight: "bolder"}}>{flow.username}</span>
                                                {flow.email && <span style={{fontSize: "12px"}}>{flow.email}</span>}
                                            </span>
                                        </td>
                                        <td style={{width: "5vw"}}>{flow.language && renderSwitchFlag(flow.language)}</td>
                                        <td style={{paddingTop: "3vh"}}>{flow.guestCategoryClone && flow.guestCategoryClone}</td>
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
                            <Button variant="light" style={{filter: "drop-shadow(2px 4px 6px)", marginRight: "1vw"}} onClick={() => setSendingMail(false)}>{t("msh_crm.c_button.b_cancel")}</Button>
                            <Button variant="dark" onClick={() => {
                            return handleMailSent()
                            .then(handleMailSended())
                            }}>{t("msh_crm.c_button.b_send_em_all")}</Button>
                        </span>
                            : <Button variant="light" style={{filter: "drop-shadow(2px 4px 6px)"}} onClick={() => setSendingMail(true)}>{t("msh_crm.c_button.b_send_mail")}</Button>}
                        {!sendingMail && <Button variant="dark" style={{marginLeft: "1vw"}} onClick={handleShow}>{t("msh_crm.c_button.b_add")}</Button>}
                    </div>


                <Modal show={list}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={handleClose}
                >
                    <ModalHeaderFormTemplate title={modalTitle} />
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
                            <InputElement
                                containerStyle={{marginBottom: "0"}} 
                                label={t("msh_crm.c_client")}
                                placeholder="ex: Jane Doe"
                                size="20vw"
                                value={formValue.title}
                                name="title"
                                handleChange={handleChange}
                                setFormValue={setFormValue}
                            />
                            <InputElement
                                containerStyle={{marginBottom: "0"}} 
                                label={t("msh_crm.c_email")}
                                placeholder="ex: jane.doe@msh.com"
                                size="20vw"
                                value={formValue.email}
                                name="email"
                                handleChange={handleChange}
                                setFormValue={setFormValue}
                            />
                            <InputElement
                                containerStyle={{marginBottom: "0"}} 
                                label={t("msh_crm.c_phone")}
                                placeholder="ex: 0654789321"
                                size="20vw"
                                value={formValue.phone}
                                name="phone"
                                handleChange={handleChange}
                                setFormValue={setFormValue}
                            />
                            <div>
                                <Form.Group controlId="exampleForm.SelectCustom">
                                <FloatingLabel
                                controlId="floatingInput"
                                label={t("msh_crm.c_origin.o_label")}
                                className="mb-3"
                                >
                                    <Form.Select class="selectpicker" value={formValue.origin} name="origin" onChange={(event) => handleChange(event, setFormValue)} 
                                    style={{width: "20vw", 
                                    border: "1px solid lightgrey", 
                                    borderRadius: "3px",
                                    backgroundColor: "white"}}>
                                        <option value="fr">France</option>
                                        <option value="en">Royaume-uni</option>
                                        <option value="de">Allemagne</option>
                                        <option value="es">Espagne</option>
                                        <option value="it">Italie</option>
                                        <option value="pt">Portugal</option>
                                    </Form.Select>
                                </FloatingLabel>
                                </Form.Group>
                            </div>
                            <div>
                                <Form.Group controlId="exampleForm.SelectCustom">
                                <FloatingLabel
                                controlId="floatingInput"
                                label={t("msh_crm.c_origin.o_label")}
                                className="mb-3"
                                >
                                    <Form.Select class="selectpicker" value={formValue.category} name="category" onChange={(event) => handleChange(event, setFormValue)} 
                                    style={{width: "20vw", 
                                    height: "60%", 
                                    border: "1px solid lightgrey", 
                                    borderRadius: "3px",
                                    backgroundColor: "white", 
                                    paddingLeft: "1vw"}}>
                                        <option valeur="tourism" onClick={() => setCategoryClone(t("msh_crm.c_category.c_tourisim"))}>{t("msh_crm.c_category.c_tourisim")}</option>
                                        <option valeur="business" onClick={() => setCategoryClone(t("msh_crm.c_category.c_business"))}>{t("msh_crm.c_category.c_business")}</option>
                                    </Form.Select>
                                </FloatingLabel>
                                </Form.Group>
                            </div>
                        </div>
                    </Modal.Body>
                        {footerState && <Modal.Footer>
                            <Button variant="dark" onClick={(event) => {
                                handleCreateData2(event, "hotels", userDB.hotelId, "chat", formValue.title, userDataCreated)
                                setFormValue("")
                                addNotification(userCreationNotif, userDB.hotelId)
                                return handleClose()
                            }}>{t("msh_general.g_button.b_send")}</Button>
                        </Modal.Footer>}
                    </Modal>
                </div>
                <div style={{width: "25%", padding: "2%", filter: "drop-shadow(2px 4px 6px)"}}>
                <PerfectScrollbar style={{mawHeight: "75vh"}}>
                    <Card style={{ width: '100%', borderRadius: "10px", maxHeight: "70vh", border: "1px solid lightgrey" }} className="softSkin">
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
                                <StaticImage objectFit='contain' placeholder="blurred" src='../../images/email.png' style={{width: "5%", marginRight: "1vw"}} />
                                {item.email}
                            </Card.Text>}
                            {item.room && item.checkoutDate && <Card.Text style={{paddingLeft: "1vw"}}>
                                <StaticImage objectFit='contain' placeholder="blurred" src='../../images/room2.png' style={{width: "5%", marginRight: "1vw"}} />
                                {item.room}
                            </Card.Text>}
                            {item.checkoutDate && <Card.Text style={{paddingLeft: "1vw"}}>
                                <StaticImage objectFit='contain' placeholder="blurred" src='../../images/checkout.png' style={{width: "5%", marginRight: "1vw"}} />
                                {item.checkoutDate}
                            </Card.Text>}
                            {item.phone && <Card.Text style={{paddingLeft: "1vw"}}>
                                <StaticImage objectFit='contain' placeholder="blurred" src='../../images/phone.png' style={{width: "5%", marginRight: "1vw"}} />
                                {item.phone}
                            </Card.Text>}
                            {item.email && <Card.Text style={{paddingLeft: "1vw"}}>
                                <StaticImage objectFit='contain' placeholder="blurred" src='../../images/calendar.png' style={{width: "5%", marginRight: "1vw"}} />
                                {moment(item.lastTimeConnected).format('LL')}
                            </Card.Text>}
                            {item.email && <div style={{display: "flex", flexFlow: "row", justifyContent: "space-around", width: "95%", marginTop: "1vh"}}>
                                {/*<Button variant="outline-dark">{t("msh_crm.c_button.b_contact")}</Button>*/}
                                <OverlayTrigger
                                placement="bottom"
                                overlay={
                                <Tooltip id="title">
                                    {t("msh_crm.c_button.b_check_chat")}
                                </Tooltip>
                                }>
                                    <div onClick={() => setShowChat(true)}>
                                        <StaticImage objectFit='contain' src='../../images/dialog.png' placeholder="blurred" style={{width: "2vw", cursor: "pointer", borderBottom: "1px solid lightgrey"}} />
                                    </div>
                                </OverlayTrigger>
                                </div>}
                            {item.details && <Card.Text style={{textAlign: "center", marginBottom: "5vh", marginTop: "2vh", color: "gray"}}>
                                {item.details}
                            </Card.Text>}
                        </Card.Body>
                    </Card>
                </PerfectScrollbar>
                </div>
                {guestId !== null && <TimeLine user={user} userDB={userDB} guestId={guestId} />}
            </div>

            <Modal show={showChat}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => setShowChat(false)}
                >
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title id="contained-modal-title-vcenter">
                    <img src={item.photo ? item.photo : defaultImg} style={{width: "2vw", height: "4vh", borderRadius: "50%"}} /> Conversations avec {item.username}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                <div style={{width: "100%", padding: "2%"}}>
                    <PerfectScrollbar style={{maxHeight: "70vh"}}>
                        <Chat user={user} userDB={userDB} title={item.username} />
                    </PerfectScrollbar>
                </div>

                </Modal.Body>
            </Modal>
        </div>
    )
}

export default GuestDatabase
