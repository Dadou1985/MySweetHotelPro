import React, {useState, useEffect} from 'react'
import { Form, Button, Table } from 'react-bootstrap'
import { db, storage } from '../../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Drawer from '@material-ui/core/Drawer'
import Close from '../../../../svg/close.svg'
import Picture from '../../../../svg/picture.svg'
import AddPhotoURL from '../../../../svg/camera.svg'
import { useTranslation } from "react-i18next"


const PhoneLost = ({userDB}) =>{

    const [formValue, setFormValue] = useState({type: "", place: "", details: "", description: "", url: ""})
    const [info, setInfo] = useState([])
    const [activate, setActivate] = useState(false)
    const [expand, setExpand] = useState(false)
    const [newImg, setNewImg] = useState(null)
    const [url, setUrl] = useState("")
    const [img, setImg] = useState("")
    const [imgFrame, setImgFrame] = useState(false)
    const { t, i18n } = useTranslation()

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
            .then(doc => console.log('nouvelle notitfication'))
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
            markup: Date.now(),
            type: formValue.type,
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
                    console.log(snapInfo)
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
            {!imgFrame ? <Table striped bordered hover size="sm" className="text-center">
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
              <Button variant="success" size="md" style={{position: "absolute", bottom: 0,left: 0, width: "100%", padding: "3%", borderRadius: 0}} onClick={handleShow}>{t("msh_lost_found.l_button.b_show_modal")}</Button>
          
              <Drawer anchor="bottom" open={activate} onClose={handleHide}  className="phone_container_drawer">
                <div  className="phone_container_drawer">
                <h4 style={{marginBottom: "5vh", borderBottom: "1px solid lightgrey"}}>{t("msh_lost_found.l_button.b_show_modal")}</h4>
                <Form.Row>
                  <Form.Group controlId="exampleForm.SelectCustom">
                  <Form.Label>{t("msh_lost_found.l_type.t_label")}</Form.Label><br/>
                      <select class="selectpicker" value={formValue.type} name="type" onChange={handleChange} 
                      className="phonePage_select">
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
                      className="phonePage_select">
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
                  <Form.Group controlId="description" className="phone_input">
                  <Form.Label>{t("msh_lost_found.l_description.d_label")}</Form.Label>
                  <Form.Control type="text" placeholder={t("msh_lost_found.l_description.d_placeholder")} value={formValue.description} name="description" onChange={handleChange} />
                  </Form.Group>
              </Form.Row>
              <Form.Row>
                  <Form.Group controlId="details" className="phone_textarea">
                      <Form.Label>{t("msh_lost_found.l_details")}</Form.Label>
                      <Form.Control as="textarea" rows="2" name="details" value={formValue.details} onChange={handleChange}  />
                  </Form.Group>
              </Form.Row>
              <Form.Row style={{marginBottom: "3vh", display: "flex", flexFlow: 'row', justifyContent: "center", alignItems: "center", width: "100%"}}>
                <input type="file" className="phone-camera-icon"
                    onChange={handleImgChange} />
                <img src={AddPhotoURL} className="modal-note-file-icon" alt="uploadIcon" />
                <span style={{marginLeft: "2vw"}}>{t("msh_general.g_button.b_add_photo")}</span>
                </Form.Row>
                <Button variant="success" className="phone_submitButton" onClick={(event) => {
                    handleSubmit(event)
                    setActivate(false)
                    }}>{t("msh_lost_found.l_button.b_validation")}</Button>
                </div>
            </Drawer>
          </div>
    )
}

export default PhoneLost