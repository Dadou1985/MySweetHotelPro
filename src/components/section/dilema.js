import React, {useState, useEffect, useContext } from 'react'
import Fom from '../../svg/fom.svg'
import { navigate } from 'gatsby'
import { sha256, sha224 } from 'js-sha256';
import { Form, Button, Tabs, Tab, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Input } from 'reactstrap'
import Tips from '../../svg/coin.svg'
import DefaultProfile from "../../svg/profile.png"
import ToggleDisplay from 'react-toggle-display'
import Arrow from '../../svg/arrowDown.svg'
import Dialog from './common/fullScreenDialog'
import Divider from '@material-ui/core/Divider'
import AddPhotoURL from '../../svg/camera.svg'
import Avatar from '@material-ui/core/Avatar';
import { FirebaseContext, db, auth, storage } from '../../Firebase'


const Dilema = () => {

    const [showModal, setShowModal] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [confModal, setConfModal] = useState(true)
    const [createRefSpace, setCreateRefSpace] = useState("")
    const [joinRefSpace, setJoinRefSpace] = useState("")
    const [info, setInfo] = useState([])
    const [list, setList] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [formValue, setFormValue] = useState({hotelName: "", job: "", level: "", mood: ""})
    const [img, setImg] = useState(null)
    const [url, setUrl] = useState("")
    const [user, setUser] = useState(auth.currentUser)

    const { userDB, setUserDB } = useContext(FirebaseContext)

    const handleWorkspace = () => {
        if(!user.displayName) {
            if(window.innerWidth > 480) {
                setShowModal(true)
            }else{
                setShowDialog(true)
            }
        }else{
            navigate('/singlePage')
        }
    }

    const handleShowDetails = () =>{
        let arrowTop = document.getElementById("arrowTop")
        const sentence = document.getElementById('dilema-sentence')
      if(arrowTop.style.transform === "rotate(0turn)"){
        setShowDetails(!showDetails)
        sentence.style.display = "none"
          return arrowTop.style.transform = "rotate(0.5turn)"
      }
      if(arrowTop.style.transform === "rotate(0.5turn)"){
        setShowDetails(!showDetails)
        sentence.style.display = "block"
          return arrowTop.style.transform = "rotate(0turn)"
      }
      
  }  

  const handleChangePhotoUrl = (event) => {
    event.preventDefault()
    const uploadTask = storage.ref(`photo-user/${img.name}`).put(img)
    uploadTask.on(
      "state_changed",
      snapshot => {},
      error => {console.log(error)},
      () => {
        storage
          .ref("photo-user")
          .child(img.name)
          .getDownloadURL()
          .then(url => {
            const uploadTask = () => {
                setConfModal(false)
                auth.user.updateProfile({ photoURL: url })
                setTimeout(
                    () => window.location.reload(),
                    1000
                );
            }
              return setUrl(url, uploadTask())})
      }
    )
  } 
  

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
        ...currentValue,
        [event.target.name]: event.target.value
        }))
    }

    const handleImgChange = (event) => {
        if (event.target.files[0]){
            setImg(event.target.files[0])
        }
    }


    const handleSubmit = async(event) => {
        event.preventDefault()
        setFormValue({hotelName: "", job: "", level: "", mood: ""})
        
        return db.collection("mySweetHotel")
        .doc("country")
        .collection("France")
        .doc('collection')
        .collection('business')
        .doc('collection')
        .collection('users')
        .doc(user.displayName)
        .update({
            job: formValue.job,
            category: formValue.level
          })
    }


    const handleClose = () => setShowModal(false)
    const handleShow = () => setShowModal(true)

    const handleCloseUpdate = () => setList(false)
    const handleShowUpdate = () => setList(true)

    const hideDialog = () => {
        setShowDialog(false)
    }


    useEffect(() => {
        const iziUserOnAir2 = () => {
            return db.collection("mySweetHotel")
            .doc("country")
            .collection("France")
            .doc('collection')
            .collection('business')
            .doc('collection')
            .collection('users')
            .where("userId", "==", user.uid)
        }

       let unsubscribe = iziUserOnAir2().onSnapshot(function(snapshot) {
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
    
    console.log(window.innerWidth)

    return (
        info.map(flow => (

        <div className="global-container"
        style={{ backgroundImage: user.photoURL ? `url(${user.photoURL})` : `url(${DefaultProfile})` }}>
                <div className="profile-container">
                    <h1>
                        <div style={{color: "#5bc0de", fontWeight: "bold"}}>{flow.id}</div>
                       { /*<div className="header-profile">
                            <img src={Tips} alt="tips" className="tips" /> 
                            {flow.tips} tips 
                            <img src={Arrow} alt="arrow" style={{width: "1vw", cursor: "pointer", marginLeft: "1vw", transform: "rotate(0turn)"}} id="arrowTop" onClick={handleShowDetails} /> 
                        </div>*/}
                    </h1>
                    <ToggleDisplay show={showDetails}>
                        <div>
                        <div className="header-toggle-container">
                            <div>
                                <b>hotel</b><p className="profile-details">{flow.hotelName}</p>
                            </div>
                            <div>
                                <b>poste</b><p className="profile-details">{flow.job}</p>
                            </div>
                            <div>
                                <b>level</b><p className="profile-details">{flow.category}</p>
                            </div>
                        </div>
                        <Button variant="secondary" className="update-profile-button" onClick={handleShowUpdate}>Actualiser votre profil</Button>
                        </div>
                    </ToggleDisplay>
                </div>
            <div className="space-container">
            <div className="space-box">
                <div className="softSkin space-card"
                    onClick={handleWorkspace}>
                <h2>Work Space</h2>
                <img src={Fom} alt="Fom" className="white-fom-icon" />
                </div>
            </div>
        </div>
        
                    <Modal show={list}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={handleCloseUpdate}
                    >
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title id="contained-modal-title-vcenter">
                        Modifier mon profil
                        </Modal.Title>
                    </Modal.Header>
            <Modal.Body>
            <div className="update_modal_container">
            <Form.Row>
                <Form.Group controlId="description">
                <Form.Label>Change d'hôtel</Form.Label>
                <Form.Control type="text" placeholder={flow.hotelName} className="hotelName-input" value={formValue.hotelName} name="hotelName" onChange={handleChange} />
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group controlId="description">
                <Form.Label>Change de <i>casquette</i></Form.Label><br/>
                <select class="selectpicker" value={formValue.job} name="job" onChange={handleChange} 
                className="update-profile-select">
                    <option></option>
                    <option>Réceptionniste</option>
                    <option>Chef de Brigade</option>
                    <option>Chef de Réception</option>
                    <option>Assistant de direction</option>
                    <option>Head Manager</option>
                </select>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group controlId="description">
                <Form.Label>Change de <i>level</i></Form.Label><br/>
                <select class="selectpicker"defaultValue={flow.category} value={formValue.level} name="level" onChange={handleChange} 
                className="update-profile-select">
                    <option></option>
                    <option>Jeune Padawan</option>
                    <option>Je gère, tranquille</option>
                    <option>I'm a living Legend</option>
                </select>
                </Form.Group>
            </Form.Row>
            </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-success" onClick={handleSubmit}>Modifier</Button>
            </Modal.Footer>
        </Modal>
        
       
        <Avatar alt="user-profile-photo" 
        src={user.photoURL ? user.photoURL : DefaultProfile}
        style={{
            display: typeof window && window.innerWidth > 480 ? "none" : "flex",
            position: "absolute",
            top: "35vh",
            left: "28vw",
            width: "45%",
            height: "25%",
            filter: "grayscale(90%) drop-shadow(1px 1px 1px)",
            zIndex: "10"
        }}
        onClick={() => navigate("/userPage")} />
       
        <img src={AddPhotoURL} alt="add photoURL" 
        className="dilema-add-photo-icon" />
        
        <OverlayTrigger
            placement="top"
            overlay={
                <Tooltip id="title">
                    Ajouter/Changer la photo de votre profil
                </Tooltip>
            }>
        <input type="file" 
            className="dilema-add-photo-input"
            onChange={handleImgChange} />
        </OverlayTrigger>
        <div className="dilema-add-photo-input-mask">
        </div>
        {img && 
        <Modal show={confModal}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={handleCloseUpdate}
        >
        <Modal.Body>
            <p style={{textAlign: "center"}}>Etes-vous sûr.e de vouloir ajouter ou changer votre photo de profil ?</p>
        </Modal.Body>
        <Modal.Footer>
            <div>
                <Button size="sm" variant="success" style={{marginRight: "1vw"}} onClick={handleChangePhotoUrl}>Oui</Button>
                <Button size="sm" variant="danger" onClick={() => setConfModal(false)}>Non</Button>
            </div>
        </Modal.Footer>
    </Modal>}
    </div>
    ))
    )
}

export default Dilema