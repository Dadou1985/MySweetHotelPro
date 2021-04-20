import React, { useState, useContext, useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Avatar from '@material-ui/core/Avatar'
import DefaultProfile from "../../../../svg/profile.png"
import Home from '../../../../svg/home.svg'
import { navigate } from 'gatsby'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { FirebaseContext, auth, db, storage } from '../../../../Firebase'

const UserProfile = ({user, userDB}) => {
    
    const [info, setInfo] = useState([])
    const [activate, setActivate] = useState(false)
    const [formValue, setFormValue] = useState({email: "", password: ""})
    const [img, setImg] = useState(null)
    const [listEmail, setListEmail] = useState(false)
    const [listPassword, setListPassword] = useState(false)
    const [confModal, setConfModal] = useState(true)
    const [url, setUrl] = useState("")

    const handleHideDrawer = () => {
        setActivate(false)
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

    const handleShow = () => {
            setActivate(true)
    }

    const handleUpdateEmail = async(event, field) => {
        event.preventDefault()
        setFormValue({email: ""})
        
        return db.collection("mySweetHotel")
        .doc("country")
        .collection("France")
        .doc('collection')
        .collection('business')
        .doc('collection')
        .collection('users')
        .doc(user.displayName)
        .update({
            email: field
          })
    }

    const handleUpdatePassword = async(event, field) => {
        event.preventDefault()
        setFormValue({email: ""})
        
        return db.collection("mySweetHotel")
        .doc("country")
        .collection("France")
        .doc('collection')
        .collection('business')
        .doc('collection')
        .collection('users')
        .doc(user.displayName)
        .update({
            password: field
          })
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

    const handleCloseUpdateEmail = () => setListEmail(false)
    const handleShowUpdateEmail = () => setListEmail(true)

    const handleCloseUpdatePassword = () => setListPassword(false)
    const handleShowUpdatePassword = () => setListPassword(true)

    const handleCloseUpdatePhoto = () => setConfModal(false)
    const handleShowUpdatePhoto = () => setConfModal(true)

      console.log("$$$$$$", img)


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

     const addNotification = (notification) => {
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
            .collection('notifications')
            .add({
            content: notification,
            markup: Date.now()})
            .then(doc => console.log('nouvelle notitfication'))
    }
    
    return (
        info.map(flow => (
            <div>
                <div style={{
                    display: "flex",
                    flexFlow: 'row',
                    justifyContent: 'center',
                    alignItems: "flex-end",
                    height: "50vh",
                    backgroundImage: user.photoURL ? `url(${user.photoURL})` : `url(${DefaultProfile})`,
                    backgroundSize: "cover",
                    filter: "blur(3px) grayscale(90%)" 
                }}>
                    
                </div>
                <input accept="image/*" style={{display: "none"}} id="icon-button-file" type="file" onChange={handleImgChange} />
                    <label htmlFor="icon-button-file" style={{zIndex: "15", position: "absolute", right: "1%", top: "50vh"}}>
                        <IconButton color="disabled" style={{filter: "invert()"}} aria-label="upload picture" component="span">
                        <PhotoCamera />
                        </IconButton>
                    </label>
                <div style={{
                    borderTop: "1px solid lightgray",
                    padding: "5%",
                    }}>
                <h1>
                    <div style={{color: "#5bc0de", fontWeight: "bold", textAlign: "center"}}>{flow.id}</div>
                    <div style={{fontSize: "15px", textAlign: "center"}}>{flow.email}</div>
                    {/*<div className="header-profile">
                        <img src={Tips} alt="tips" className="tips" /> 
                        {flow.tips} tips 
                    </div>*/}
                </h1>
                <div className="userProfile-header-toggle-container">
                            <Button variant="secondary" className="userProfile-update-profile-button" onClick={handleShowUpdateEmail}>Modifier mon adresse e-mail</Button>
                            <Button variant="secondary" className="userProfile-update-profile-button" onClick={handleShowUpdatePassword}>Modifier mon mot de passe</Button>
                        </div>
                </div>
                <Avatar alt="user-profile-photo" 
                    src={user.photoURL ? user.photoURL : DefaultProfile}
                    style={{
                        display: typeof window && window.innerWidth > 480 ? "none" : "flex",
                        position: "absolute",
                        top: "30vh",
                        left: "28vw",
                        width: "45%",
                        height: "25%",
                        filter: "drop-shadow(1px 1px 1px)",
                        zIndex: "10"
                    }} />
                <Drawer anchor="bottom" open={listEmail} onClose={handleCloseUpdateEmail}>
                    <h5 style={{textAlign: "center", marginTop: "2vh"}}><b>Actualisation de votre adresse e-mail</b></h5>
                    <div className="drawer-container">
                        <div><input style={{textAlign: "center"}} type="text" name="email" value={formValue.email} placeholder="Entrer une nouvelle adresse e-mail" className="user-dialog-hotel" onChange={handleChange} required /></div>
                    </div>
                    <Button variant="success" size="lg" onClick={handleSubmit}>Actualiser</Button>
                </Drawer>
                <Drawer anchor="bottom" open={listPassword} onClose={handleCloseUpdatePassword}>
                    <h5 style={{textAlign: "center", marginTop: "2vh"}}><b>Actualisation de votre mot de passe</b></h5>
                    <div className="drawer-container">
                        <div><input style={{textAlign: "center"}} type="text" name="password" value={formValue.password} placeholder="Entrer un nouveau mot de passe" className="user-dialog-hotel" onChange={handleChange} required /></div>
                    </div>
                    <Button variant="success" size="lg" onClick={handleSubmit}>Actualiser</Button>
                </Drawer>
                {img && 
                    <Modal show={confModal}
                    size="sm"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                    <Modal.Body>
                        <p style={{textAlign: "center"}}>Etes-vous sûr.e de vouloir ajouter ou changer votre photo de profil ?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <Button size="sm" variant="success" style={{marginRight: "1vw"}} onClick={(event) => handleChangePhotoUrl(event)}>Oui</Button>
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

export default UserProfile