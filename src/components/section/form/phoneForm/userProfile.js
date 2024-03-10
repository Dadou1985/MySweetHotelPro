import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Avatar from '@material-ui/core/Avatar'
import DefaultProfile from "../../../../svg/profile.png"
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { auth, db, storage } from '../../../../Firebase'
import { useTranslation } from "react-i18next"
import '../../../css/section/form/phoneForm/phoneUserProfile.css'

const UserProfile = ({user, userDB, setUserDB}) => {
    
    const [info, setInfo] = useState([])
    const [activate, setActivate] = useState(false)
    const [formValue, setFormValue] = useState({email: "", password: ""})
    const [img, setImg] = useState(null)
    const [listEmail, setListEmail] = useState(false)
    const [listPassword, setListPassword] = useState(false)
    const [confModal, setConfModal] = useState(true)
    const [url, setUrl] = useState("")
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
    }

    const handleChangeEmail = () => {
        const notif = t("msh_user_panel.u_section.s_email.e_notif")

         auth.signInWithEmailAndPassword(user.email, userDB.password)
        .then(function(userCredential) {
            userCredential.user.updateEmail(formValue.email)
            addNotification(notif)
        })
      }

      const handleChangePassword = () => {
        const notif = t("msh_user_panel.u_section.s_password.p_notif")  

        auth.signInWithEmailAndPassword(user.email, userDB.password)
        .then(function(userCredential) {
            userCredential.user.updatePassword(formValue.password)
            addNotification(notif)
        })
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
                    filter: "blur(2px) grayscale(90%)" 
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
                    <div style={{color: "#5bc0de", fontWeight: "bold", textAlign: "center", fontSize: "0.7em"}}>{flow.username}</div>
                    <div style={{fontSize: "0.7rem", textAlign: "center"}}>{flow.email}</div>
                    {/*<div className="header-profile">
                        <img src={Tips} alt="tips" className="tips" /> 
                        {flow.tips} tips 
                    </div>*/}
                </h1>
                <div className="userProfile-header-toggle-container">
                    <Button variant="secondary" className="userProfile-update-profile-button" onClick={handleShowUpdateEmail}>{t("msh_user_panel.u_section.s_email.e_label")}</Button>
                    <Button variant="secondary" className="userProfile-update-profile-button" onClick={handleShowUpdatePassword}>{t("msh_user_panel.u_section.s_password.p_label")}</Button>
                </div>
                </div>
                <Avatar alt="user-profile-photo" 
                    src={user.photoURL ? user.photoURL : DefaultProfile}
                    style={{
                        display: typeof window && window.innerWidth > 768 ? "none" : "flex",
                        position: "absolute",
                        top: "30vh",
                        left: "28vw",
                        width: "45%",
                        height: "25%",
                        filter: "drop-shadow(1px 1px 1px)",
                        zIndex: "10"
                    }} />
                <Drawer anchor="bottom" open={listEmail} onClose={handleCloseUpdateEmail}>
                    <h5 style={{textAlign: "center", marginTop: "2vh"}}><b>{t("msh_user_panel.u_section.s_email.e_label")}</b></h5>
                    <div style={{marginBottom: "5vh"}} className="drawer-container">
                        <div><input style={{textAlign: "center"}} type="text" name="email" value={formValue.email} placeholder={t("msh_user_panel.u_section.s_email.e_input_placeholder")} className="user-dialog-hotel" onChange={handleChange} required /></div>
                    </div>
                    <Button style={{position: "absolute", bottom: 0,left: 0, width: "100%", padding: "3%", borderRadius: 0}} variant="success" onClick={(event) => {
                        handleUpdateEmail(event, formValue.email)
                        handleChangeEmail(formValue.email)
                        handleCloseUpdateEmail()
                    }}>{t("msh_general.g_button.b_update")}</Button>
                </Drawer>
                <Drawer anchor="bottom" open={listPassword} onClose={handleCloseUpdatePassword}>
                    <h5 style={{textAlign: "center", marginTop: "2vh"}}><b>{t("msh_user_panel.u_section.s_password.p_label")}</b></h5>
                    <div style={{marginBottom: "5vh"}} className="drawer-container">
                        <div><input style={{textAlign: "center"}} type="text" name="password" value={formValue.password} placeholder={t("msh_user_panel.u_section.s_password.p_input_placeholder")} className="user-dialog-hotel" onChange={handleChange} required /></div>
                    </div>
                    <Button style={{position: "absolute", bottom: 0,left: 0, width: "100%", padding: "3%", borderRadius: 0}} variant="success" onClick={(event) => {
                        handleUpdatePassword(event, formValue.password)
                        handleChangePassword()
                        handleCloseUpdatePassword()
                    }}>{t("msh_general.g_button.b_update")}</Button>
                </Drawer>
                {img && 
                    <Modal show={confModal}
                    size="sm"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                    <Modal.Body>
                        <p style={{textAlign: "center"}}>{t("msh_user_panel.u_update_photo.u_modal.m_title")}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <Button size="sm" variant="success" style={{marginRight: "1vw"}} onClick={(event) => handleChangePhotoUrl(event)}>{t("msh_user_panel.u_update_photo.u_modal.m_button.b_yes")}</Button>
                            <Button size="sm" variant="danger" onClick={() => {
                                setImg(null)
                                handleCloseUpdatePhoto()
                                }}>{t("msh_user_panel.u_update_photo.u_modal.m_button.b_no")}</Button>
                        </div>
                    </Modal.Footer>
                </Modal>}
            </div>
        ))
    )
}

export default UserProfile