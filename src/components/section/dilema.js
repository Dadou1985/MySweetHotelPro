import React, {useState, useEffect } from 'react'
import Fom from '../../svg/fom.svg'
import { navigate } from 'gatsby'
import { Form, Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import DefaultProfile from "../../svg/profile.png"
import AddPhotoURL from '../../svg/camera.svg'
import Avatar from '@material-ui/core/Avatar';
import { db, auth, storage } from '../../Firebase'


const Dilema = ({user, userDB, setUserDB}) => {

    const [showModal, setShowModal] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [confModal, setConfModal] = useState(true)
    const [info, setInfo] = useState([])
    const [listEmail, setListEmail] = useState(false)
    const [listPassword, setListPassword] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [formValue, setFormValue] = useState({email: "", password: ""})
    const [img, setImg] = useState(null)
    const [url, setUrl] = useState("")
    

    
    const handleWorkspace = () => {
        if(!userDB.username) {
            if(window.innerWidth > 768) {
                setShowModal(true)
            }else{
                setShowDialog(true)
            }
        }else{
            navigate('/singlePage')
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
                auth.currentUser.updateProfile({ photoURL: url })
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

    const handleLoadUserDB = () => {
        db.collection('businessUsers')
            .doc(user.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                console.log("+++++++", doc.data())
                setUserDB(doc.data())
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!")
              }
            })
    }


    const handleUpdateEmail = async(event, field) => {
        event.preventDefault()
        setFormValue({email: ""})
        
        return db.collection('businessUsers')
        .doc(user.uid)
        .update({
            email: field
          })
        .then(handleLoadUserDB())
    }

    const handleUpdatePassword = async(event, field) => {
        event.preventDefault()
        setFormValue({email: ""})
        
        return db.collection('businessUsers')
        .doc(user.uid)
        .update({
            password: field
          })
        .then(handleLoadUserDB())
    }

    const handleCloseUpdateEmail = () => setListEmail(false)
    const handleShowUpdateEmail = () => setListEmail(true)

    const handleCloseUpdatePassword = () => setListPassword(false)
    const handleShowUpdatePassword = () => setListPassword(true)

    const handleCloseUpdatePhoto = () => setConfModal(false)

    useEffect(() => {
        const iziUserOnAir2 = () => {
            return db.collection('businessUsers')
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

     const addNotification = (notification) => {
        return db.collection('notifications')
            .add({
            content: notification,
            hotelId: userDB.hotelId,
            markup: Date.now()})
            .then(doc => console.log('nouvelle notitfication'))
    }

     const handleChangeEmail = () => {
        const notif = "Le changement de votre adresse e-mail a été enregistré avec succès !" 

         auth.signInWithEmailAndPassword(user.email, userDB.password)
        .then(function(userCredential) {
            userCredential.user.updateEmail(formValue.email)
            addNotification(notif)
        })
      }

      const handleChangePassword = () => {
        const notif = "Le changement de votre mot de passe a été enregistré avec succès !" 

        auth.signInWithEmailAndPassword(user.email, userDB.password)
        .then(function(userCredential) {
            userCredential.user.updatePassword(formValue.password)
            addNotification(notif)
        })
    }

      
    console.log(user.password)

    return (
        info.map((flow, key) => (

        <div key={key} className="global-container"
        style={{ backgroundImage: user.photoURL ? `url(${user.photoURL})` : `url(${DefaultProfile})` }}>
                <div className="profile-container">
                    <h1>
                        <div style={{color: "black", fontWeight: "bold"}}>{flow.username}</div>
                        <div style={{fontSize: "15px"}}>{flow.email}</div>
                       { /*<div className="header-profile">
                            <img src={Tips} alt="tips" className="tips" /> 
                            {flow.tips} tips 
                            <img src={Arrow} alt="arrow" style={{width: "1vw", cursor: "pointer", marginLeft: "1vw", transform: "rotate(0turn)"}} id="arrowTop" onClick={handleShowDetails} /> 
                        </div>*/}
                    </h1>
                        <div className="header-toggle-container">
                            <Button variant="secondary" className="update-profile-button" onClick={handleShowUpdateEmail}>Modifier mon adresse e-mail</Button>
                            <Button variant="secondary" className="update-profile-button" onClick={handleShowUpdatePassword}>Modifier mon mot de passe</Button>
                        </div>
                       
                </div>
            <div className="space-container">
            <div className="space-box">
                <div className="softSkin space-card"
                    onClick={handleWorkspace}>
                <h2 style={{textAlign: "center"}}>Espace de travail</h2>
                <img src={Fom} alt="Fom" className="white-fom-icon" />
                </div>
            </div>
        </div>
        
            <Modal show={listEmail}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={handleCloseUpdateEmail}
            >
            <Modal.Header closeButton className="bg-light">
                <Modal.Title id="contained-modal-title-vcenter">
                Modifier mon adresse e-mail
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="update_modal_container">
            <Form.Row>
                <Form.Group controlId="description">
                <Form.Control type="text" placeholder="Entrer une nouvelle adresse e-mail" style={{width: "30vw", textAlign: "center"}} value={formValue.email} name="email" onChange={handleChange} />
                </Form.Group>
            </Form.Row>
            </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-success" onClick={(event) => {
                    handleUpdateEmail(event, formValue.email)
                    handleChangeEmail(formValue.email)
                    handleCloseUpdateEmail()
                }}>Actualiser maintenant</Button>
            </Modal.Footer>
        </Modal>

        <Modal show={listPassword}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={handleCloseUpdatePassword}
            >
            <Modal.Header closeButton className="bg-light">
                <Modal.Title id="contained-modal-title-vcenter">
                Modifier mon mot de passe
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="update_modal_container">
            <Form.Row>
                <Form.Group controlId="description">
                <Form.Control type="text" placeholder="Entrer un nouveau mot de passe" style={{width: "30vw", textAlign: "center"}} value={formValue.password} name="password" onChange={handleChange} />
                </Form.Group>
            </Form.Row>
            </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-success" onClick={(event) => {
                    handleUpdatePassword(event, formValue.password)
                    handleChangePassword()
                    handleCloseUpdatePassword()
                }}>Actualiser maintenant</Button>
            </Modal.Footer>
        </Modal>
        
       
        <Avatar alt="user-profile-photo" 
        src={user.photoURL ? user.photoURL : DefaultProfile}
        style={{
            display: typeof window && window.innerWidth > 768 ? "none" : "flex",
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
        onHide={handleCloseUpdatePhoto}
        >
        <Modal.Body>
            <p style={{textAlign: "center"}}>Etes-vous sûr.e de vouloir ajouter ou changer votre photo de profil ?</p>
        </Modal.Body>
        <Modal.Footer>
            <div>
                <Button size="sm" variant="success" style={{marginRight: "1vw"}} onClick={handleChangePhotoUrl}>Oui</Button>
                <Button size="sm" variant="danger" onClick={() => {
                    setImg(null)
                    handleCloseUpdatePhoto()
                }}>Non</Button>
            </div>
        </Modal.Footer>
    </Modal>}
    </div>
    ))
    )
}

export default Dilema