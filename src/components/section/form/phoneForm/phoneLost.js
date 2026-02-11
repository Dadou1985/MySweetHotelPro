import React, {useState, useEffect, useContext} from 'react'
import { Form, Button, Table, FloatingLabel } from 'react-bootstrap'
import { db, storage, FirebaseContext } from '../../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Drawer from '@material-ui/core/Drawer'
import Close from '../../../../svg/close.svg'
import Picture from '../../../../svg/picture.svg'
import AddPhotoURL from '../../../../svg/camera.svg'
import { useTranslation } from "react-i18next"
import '../../../css/section/form/phoneForm/phonePageTemplate.css'
import InputElement from '../../../../helper/common/InputElement'
import TextareaElement from '../../../../helper/common/textareaElement'

const PhoneLost = () =>{
    const { userDB } = useContext(FirebaseContext)

    const [formValue, setFormValue] = useState({type: "", place: "", details: "", description: "", url: ""})
    const [info, setInfo] = useState([])
    const [activate, setActivate] = useState(false)
    const [expand, setExpand] = useState(false)
    const [newImg, setNewImg] = useState(null)
    const [url, setUrl] = useState("")
    const [img, setImg] = useState("")
    const [imgFrame, setImgFrame] = useState(false)
    const [typeClone, setTypeClone] = useState(null)
    const [placeClone, setPlaceClone] = useState(null)
    const { t } = useTranslation()

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

    const handleImgChange = (event) => {
        if (event.target.files[0]){
            setNewImg(event.target.files[0])
        }
    }

    const handleChangeExpand = () => setExpand(!expand)

    const addNotification = (notification) => {
        return db.collection('notifications')
            .add({
            content: notification,
            hotelId: userDB.hotelId,
            markup: Date.now()})
    }

      const addLostObject = (event, photo) => {
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
            placeClone: placeClone !== null ? placeClone : t("msh_lost_found.l_place.p_hall"),
            markup: Date.now(),
            type: formValue.type,
            typeClone: typeClone !== null ? typeClone : "High Tech",
            img: photo,
            status: false
            })
    }

    const handleSubmit = (event) =>{
        event.preventDefault()
        if(newImg !== null) {
            const uploadTask = storage.ref(`msh-photo-lost/${newImg.name}`).put(newImg)
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {console.log(error)},
          () => {
            storage
              .ref("msh-photo-lost")
              .child(newImg.name)
              .getDownloadURL()
              .then(url => {
                const uploadTask = () => {
                    addLostObject(event, url)
                }
                  return setUrl(url, uploadTask())})
          }
        )
        }else{
            addLostObject(event)
        }
        
    }

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('lostAndFound')
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

     const handleShow = () => setActivate(true)
     const handleHide = () => setActivate(false)

    return(
      <div className="phone_container">
              <h3 className="phone_title">{t("msh_lost_found.l_title")}</h3>
              <div style={{width: "90vw", overflow: "scroll", height: '100%'}}>
            {/*<div style={{display: "flex", flexFlow: "row", justifyContent: expand ? "flex-start" : "flex-end", width: "100%"}}>
                <span style={{display: "flex", flexFlow: expand ? "row-reverse" : "row"}}  onClick={handleChangeExpand}>
                {expand ? "Rétrécir" : "Agrandir"}
                {expand ? <img src={Left} style={{width: "3vw", marginRight: "1vw"}} /> : <img src={Right} style={{width: "3vw", marginLeft: "1vw"}} />}
                </span>
            </div>*/}
            {!imgFrame ? <Table striped bordered hover className="text-center">
                <thead className="bg-dark text-center text-light">
                    <tr>
                    {expand && <th>Type</th>}
                    <th>{t("msh_general.g_table.t_description")}</th>
                    <th>{t("msh_general.g_table.t_date")}</th>
                    {expand && <th>Photo</th>}
                    <th>{t("msh_general.g_table.t_place")}</th>
                    {expand && <th>Details</th>}
                    {expand &&<th>Collaborateur</th>}
                    {expand && <th className="bg-dark"></th>}
                    </tr>
                </thead>
                <tbody>
                    {info.map(flow =>(
                        <tr key={flow.id}>
                        {expand && <td>{flow.type}</td>}
                        <td>{flow.description}</td>
                        <td>{moment(flow.markup).format('L')}</td>
                        {expand && <td style={{cursor: "pointer"}} onClick={() => {
                                setImg(flow.img)
                                setImgFrame(true)
                            }}>{flow.img ? <img src={Picture} style={{width: "5vw"}} /> : "Aucune"}</td>}
                        <td>{flow.place}</td>
                        {expand && <td>{flow.details}</td>}
                        {expand && <td>{flow.author}</td>}
                        {expand && <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
                            return db.collection('hotels')
                            .doc(userDB.hotelId)
                            .collection('lostAndFound')
                            .doc(flow.id)
                            .delete()
                            .then(function() {
                                console.log("Document successfully deleted!");
                            }).catch(function(error) {
                                console.log(error);
                            });
                        }}>{t("msh_general.g_button.b_delete")}</Button></td>}
                        </tr>
                    ))}
                </tbody>
            </Table> : 
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
              <Button className="btn-msh phone_submitButton" size="md" onClick={handleShow}>{t("msh_lost_found.l_button.b_show_modal")}</Button>
          
              <Drawer anchor="bottom" open={activate} onClose={handleHide}>
                <div className="phone_container_drawer" style={{gap: "2vh"}}>
                    <h4 className='phone_tab'>{t("msh_lost_found.l_button.b_show_modal")}</h4>
                    <div>
                    <Form.Group controlId="exampleForm.SelectCustom">
                        <FloatingLabel
                            controlId="floatingInput"
                            label={t("msh_lost_found.l_type.t_label")}
                            className="mb-3"
                        >  
                        <Form.Select class="selectpicker" value={formValue.type} name="type" onChange={handleChange} 
                        className="phonePage_select">
                            <option></option>
                            <option value="tech" onClick={() => setTypeClone("High Tech")}>High Tech</option>
                            <option value="ids" onClick={() => setTypeClone(t("msh_lost_found.l_second_tab_title"))} >{t("msh_lost_found.l_second_tab_title")}</option>
                            <option value="clothes" onClick={() => setTypeClone(t("msh_lost_found.l_third_tab_title"))} >{t("msh_lost_found.l_third_tab_title")}</option>
                            <option value="others" onClick={() => setTypeClone(t("msh_lost_found.l_fourth_tab_title"))} >{t("msh_lost_found.l_fourth_tab_title")}</option>
                        </Form.Select>
                        </FloatingLabel>
                    </Form.Group>
                </div>
                <div>
                    <Form.Group controlId="exampleForm.SelectCustom">
                    <FloatingLabel
                            controlId="floatingInput"
                            label={t("msh_lost_found.l_place.p_label")}
                            className="mb-3"
                        >  
                        <Form.Select class="selectpicker" value={formValue.place} name="place" onChange={handleChange} 
                        className="phonePage_select">
                            <option></option>
                            <option value="hall" onClick={() => setPlaceClone(t("msh_lost_found.l_place.p_hall"))}>{t("msh_lost_found.l_place.p_hall")}</option>
                            <option value="restaurant" onClick={() => setPlaceClone(t("msh_lost_found.l_place.p_restaurant"))}>{t("msh_lost_found.l_place.p_restaurant")}</option>
                            <option value="parking" onClick={() => setPlaceClone(t("msh_lost_found.l_place.p_parking"))}>{t("msh_lost_found.l_place.p_parking")}</option>
                            <option value="toilet" onClick={() => setPlaceClone(t("msh_lost_found.l_place.p_toilet"))}>{t("msh_lost_found.l_place.p_toilet")}</option>
                            <option value="floors" onClick={() => setPlaceClone(t("msh_lost_found.l_place.p_floors"))}>{t("msh_lost_found.l_place.p_floors")}</option>
                            <option value="others" onClick={() => setPlaceClone(t("msh_lost_found.l_place.p_other"))}>{t("msh_lost_found.l_place.p_other")}</option>
                        </Form.Select>
                        </FloatingLabel>
                    </Form.Group>
                </div>
                <div>
                    <InputElement 
                    containerStyle={{height: "58px", marginBottom: "2vh"}} 
                    type="text" 
                    size="90vw"
                    label={t("msh_lost_found.l_description.d_placeholder")}
                    value={formValue.description} 
                    name="description" 
                    handleChange={handleChange}
                    setFormValue={setFormValue}
                    />
                </div>
                <div>
                    <TextareaElement 
                    label={t("msh_lost_found.l_details")}
                    row="2"
                    name="details" v
                    value={formValue.details} 
                    handleChange={handleChange}  
                    setFormValue={setFormValue}
                    size={{width: "90vw", height: "10vh", maxHeight: "15vh"}}
                    />
                </div>
                <div style={{margin: "0 auto 8vh", display: "flex", flexFlow: 'row wrap', justifyContent: "center", alignItems: "center", width: "fit-content", position: "relative"}}>
                    <input type="file" className="phone-camera-icon"
                        onChange={handleImgChange} />
                    <img src={AddPhotoURL} style={{width: "3em"}} alt="uploadIcon" />
                    <div style={{width: "100%", textAlign: "center"}}>{t("msh_general.g_button.b_add_photo")}</div>
                </div>
                <Button className="btn-msh phone_submitButton" onClick={(event) => {
                    handleSubmit(event)
                    setActivate(false)
                    }}>{t("msh_lost_found.l_button.b_validation")}</Button>
                </div>
            </Drawer>
          </div>
    )
}

export default PhoneLost