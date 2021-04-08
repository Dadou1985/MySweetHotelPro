import React, { useState, useContext, useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import Avatar from '@material-ui/core/Avatar'
import DefaultProfile from "../../../../svg/profile.png"
import Tips from '../../../../svg/coin.svg'
import Home from '../../../../svg/home.svg'
import { navigate } from 'gatsby'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

const UserProfile = ({user, firebase}) => {
    
    const [info, setInfo] = useState([])
    const [activate, setActivate] = useState(false)
    const [formValue, setFormValue] = useState({hotelName: "", job: "", level: ""})
    const [img, setImg] = useState(null)
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

    const handleSubmit = event => {
        event.preventDefault()
        setFormValue({hotelName: "", job: "", level: ""})
        firebase.updateIziProfile({username: user.username, hotelName: formValue.hotelName, job: formValue.job, level: formValue.level}).then(handleHideDrawer)
        .then(setActivate(false))
    }

    const handleChangePhotoUrl = (event) => {
        event.preventDefault()
        const uploadTask = firebase.storage.ref(`photo-user/${img.name}`).put(img)
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {console.log(error)},
          () => {
            firebase.storage
              .ref("photo-user")
              .child(img.name)
              .getDownloadURL()
              .then(url => {
                const uploadTask = () => {
                    firebase.addPhotoProfileUser({ img: url })
                    setTimeout(
                        () => window.location.reload(),
                        1000
                    );
                }
                  return setUrl(url, uploadTask())})
          }
        )
      } 

      console.log("$$$$$$", img)


    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        firebase.iziUserOnAir2({userId: user.uid, signal : signal}).onSnapshot(function(snapshot) {
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
                return () => {
                    abortController.abort()
                }
     },[firebase, user.email])
    
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
                    <label htmlFor="icon-button-file" style={{zIndex: "15", position: "absolute", right: "1%", top: "45vh"}}>
                        <IconButton color="disabled" style={{filter: "invert()"}} aria-label="upload picture" component="span">
                        <PhotoCamera />
                        </IconButton>
                    </label>
                <div style={{
                    borderTop: "1px solid lightgray",
                    padding: "5%",
                    borderBottom: "1px solid lightgray"
                    }}>
                <h1>
                    <div style={{color: "#5bc0de", fontWeight: "bold", textAlign: "center"}}>{flow.id}</div>
                    {/*<div className="header-profile">
                        <img src={Tips} alt="tips" className="tips" /> 
                        {flow.tips} tips 
                    </div>*/}
                </h1>
                <div>
                    <div className="header-toggle-container">
                        <div>
                            <b>hotel</b><p className="user-profile-details">{flow.hotelName}</p>
                        </div>
                        <div>
                            <b>poste</b><p className="user-profile-details">{flow.job}</p>
                        </div>
                        <div>
                            <b>level</b><p className="user-profile-details">{flow.category}</p>
                        </div>
                    </div>
                    <div style={{textAlign: "center"}}> 
                        <b>Code Workspace</b><p className="user-profile-details">{user.displayName}</p>

                    </div>
                    <Button variant="secondary" className="update-profile-button" onClick={handleShow}>Actualiser votre profil</Button>
                </div>
                </div>
                <div style={{
                    display: "flex",
                    flexFlow: "row",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    width: "100%"
                }}>
                    <img src={Home} alt="Home" style={{width: "10%", filter: "drop-shadow(1px 1px 1px)", marginTop: "3vh"}} onClick={() => navigate('/doorsStage')} />
                </div>
                <Avatar alt="user-profile-photo" 
                    src={user.photoURL ? user.photoURL : DefaultProfile}
                    style={{
                        display: typeof window && window.innerWidth > 480 ? "none" : "flex",
                        position: "absolute",
                        top: "25vh",
                        left: "28vw",
                        width: "45%",
                        height: "25%",
                        filter: "drop-shadow(1px 1px 1px)",
                        zIndex: "10"
                    }} />
                <Drawer anchor="bottom" open={activate} onClose={handleHideDrawer}>
                    <h5 style={{textAlign: "center", marginTop: "2vh"}}><b>Actualisation de votre profil</b></h5>
                    <div className="drawer-container">
                        <div><input type="text" name="hotelName" value={formValue.hotelName} placeholder={flow.hotelName} className="user-dialog-hotel" onChange={handleChange} required /></div>
                        <div><input type="text" name="job" value={formValue.job} placeholder={flow.job} className="user-dialog-job" onChange={handleChange} required /></div>
                        <div><input type="text" name="level" value={formValue.level} placeholder={flow.category} className="user-dialog-level" onChange={handleChange} required /></div>
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
                            <Button size="sm" variant="success" style={{marginRight: "1vw"}} onClick={handleChangePhotoUrl}>Oui</Button>
                            <Button size="sm" variant="danger" onClick={() => setConfModal(false)}>Non</Button>
                        </div>
                    </Modal.Footer>
                </Modal>}
            </div>
        ))
    )
}

export default UserProfile