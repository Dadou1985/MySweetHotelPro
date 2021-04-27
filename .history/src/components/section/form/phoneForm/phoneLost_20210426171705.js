import React, {useState, useEffect} from 'react'
import { Form, Button, Table } from 'react-bootstrap'
import { auth, db, storage } from '../../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Drawer from '@material-ui/core/Drawer'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Left from '../../../../svg/arrow-left.svg'
import Right from '../../../../svg/arrow-right.svg'
import Close from '../../../../svg/close.svg'
import Picture from '../../../../svg/picture.svg'
import AddPhotoURL from '../../../../svg/camera.svg'


const PhoneLost = ({user, userDB}) =>{

    const [formValue, setFormValue] = useState({type: "", place: "", details: "", description: "", url: ""})
    const [info, setInfo] = useState([])
    const [activate, setActivate] = useState(false)
    const [expand, setExpand] = useState(false)
    const [newImg, setNewImg] = useState("")
    const [url, setUrl] = useState("")
    const [img, setImg] = useState("")
    const [imgFrame, setImgFrame] = useState(false)

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

      const addLostObject = event => {
        event.preventDefault()
        setFormValue("")
        return db.collection('mySweetHotel')
            .doc('country')
            .collection('France')
            .doc('collection')
            .collection('hotel')
            .doc('region')
            .collection(userDB.hotelRegion)
            .doc('departement')
            .collection(userDB.hotelDept)
            .doc(`${userDB.hotelId}`)
            .collection('lostNfound')
            .add({
            author: user.displayName,
            date: new Date(),
            description: formValue.description,
            details: formValue.details,
            place: formValue.place,
            markup: Date.now(),
            type: formValue.type,
            img: url
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
                    addLostObject(event)
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
            return db.collection('mySweetHotel')
            .doc('country')
            .collection('France')
            .doc('collection')
            .collection('hotel')
            .doc('region')
            .collection(userDB.hotelRegion)
            .doc('departement')
            .collection(userDB.hotelDept)
            .doc(`${userDB.hotelId}`)
            .collection('lostNfound')
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
              <h3 className="phone_title">Objets Trouvés</h3>
              <div style={{width: "90vw", overflow: "scroll", height: '100%'}}>
            <div style={{display: "flex", flexFlow: "row", justifyContent: expand ? "flex-start" : "flex-end", width: "100%"}}>
                <span style={{display: "flex", flexFlow: expand ? "row-reverse" : "row"}}  onClick={handleChangeExpand}>
                {expand ? "Rétrécir" : "Agrandir"}
                {expand ? <img src={Left} style={{width: "3vw", marginRight: "1vw"}} /> : <img src={Right} style={{width: "3vw", marginLeft: "1vw"}} />}
                </span>
            </div>
            {!imgFrame ? <Table striped bordered hover size="sm" className="text-center">
                <thead className="bg-dark text-center text-light">
                    <tr>
                    {expand && <th>Type</th>}
                    <th>Description</th>
                    <th>Date</th>
                    {expand && <th>Photo</th>}
                    <th>Lieu</th>
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
                            return db.collection('mySweetHotel')
                            .doc('country')
                            .collection('France')
                            .doc('collection')
                            .collection('hotel')
                            .doc('region')
                            .collection(userDB.hotelRegion)
                            .doc('departement')
                            .collection(userDB.hotelDept)
                            .doc(`${userDB.hotelId}`)
                            .collection("lostNfound")
                            .doc(flow.id)
                            .delete()
                            .then(function() {
                                console.log("Document successfully deleted!");
                            }).catch(function(error) {
                                console.log(error);
                            });
                        }}>Supprimer</Button></td>}
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
              <Button variant="outline-success" className="phone_submitButton" onClick={handleShow}>Enregistrer un objet trouvé</Button>
          
              <Drawer anchor="bottom" open={activate} onClose={handleHide}  className="phone_container_drawer">
                <div  className="phone_container_drawer">
                <h4 style={{marginBottom: "5vh", borderBottom: "1px solid lightgrey"}}>Enregistrer un objet trouvé</h4>
                <Form.Row>
                  <Form.Group controlId="exampleForm.SelectCustom">
                  <Form.Label>Quel type d'objet ?</Form.Label><br/>
                      <select class="selectpicker" value={formValue.type} name="type" onChange={handleChange} 
                      className="phonePage_select">
                          <option></option>
                          <option>High Tech</option>
                          <option>Documents Officiels</option>
                          <option>Vêtements</option>
                          <option>Autres</option>
                      </select>
                  </Form.Group>
              </Form.Row>
              <Form.Row>
                  <Form.Group controlId="exampleForm.SelectCustom">
                  <Form.Label>Lieu ?</Form.Label><br/>
                      <select class="selectpicker" value={formValue.place} name="place" onChange={handleChange} 
                      className="phonePage_select">
                          <option></option>
                          <option>Hall</option>
                          <option>Restaurant</option>
                          <option>Parking</option>
                          <option>Toilettes</option>
                          <option>Etages</option>
                          <option>Autres</option>
                      </select>
                  </Form.Group>
              </Form.Row>
              <Form.Row>
                  <Form.Group controlId="description" className="phone_input">
                  <Form.Label>Description de l'objet</Form.Label>
                  <Form.Control type="text" placeholder="ex: un i-phone noir" value={formValue.description} name="description" onChange={handleChange} />
                  </Form.Group>
              </Form.Row>
              <Form.Row>
                  <Form.Group controlId="details" className="phone_textarea">
                      <Form.Label>Plus de détails</Form.Label>
                      <Form.Control as="textarea" rows="2" name="details" value={formValue.details} onChange={handleChange}  />
                  </Form.Group>
              </Form.Row>
              <Form.Row style={{marginBottom: "3vh", display: "flex", flexFlow: 'row', justifyContent: "center", alignItems: "center"}}>
                <input type="file" className="modal-note-file-input"
                    onChange={handleImgChange} />
                <img src={AddPhotoURL} className="modal-note-file-icon" alt="uploadIcon" />
                <span style={{marginLeft: "1vw"}}>Ajouter une photo</span>
              </Form.Row>
                <Button variant="success" className="phone_submitButton" onClick={(event) => {
                    handleSubmit(event)
                    setActivate(false)
                    }}>Enregistrer maintenant</Button>
                </div>
            </Drawer>
          </div>
    )
}

export default PhoneLost