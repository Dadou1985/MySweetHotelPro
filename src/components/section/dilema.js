import React, {useState, useEffect, useRef } from 'react'
import Fom from '../../svg/fom.svg'
import { navigate } from 'gatsby'
import { Form, Button, Modal, OverlayTrigger, Tooltip, Spinner, Alert } from 'react-bootstrap'
import DefaultProfile from "../../svg/profile.png"
import Email from "../../images/email.png"
import Password from "../../images/password.png"
import Visuel from "../../images/visuel.png"
import AddPhotoURL from '../../svg/camera.svg'
import Avatar from '@material-ui/core/Avatar';
import { db, auth, storage } from '../../Firebase'
import Divider from '@material-ui/core/Divider';
import Sticker from './sticker'
import Flyer from './flyer'
import Band from './band'
import LogoSticker from '../../images/qr_code.png'
import LogoFlyer from '../../images/flyer.png'
import LogoBand from '../../images/band.png'
import LogoHotel from '../../images/hotelLogo.png'
import { PDFExport, savePDF } from "@progress/kendo-react-pdf"
import { useShortenUrl } from 'react-shorten-url';

const Dilema = ({user, userDB, setUserDB}) => {

    const [showModal, setShowModal] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [confModal, setConfModal] = useState(true)
    const [info, setInfo] = useState([])
    const [listEmail, setListEmail] = useState(false)
    const [listPassword, setListPassword] = useState(false)
    const [listVisuel, setlistVisuel] = useState(false)
    const [listLogo, setListLogo] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [switchButton, setSwitchButton] = useState(false)
    const [formValue, setFormValue] = useState({email: "", password: ""})
    const [img, setImg] = useState(null)
    const [url, setUrl] = useState("")
    const [baseUrl, setBaseUrl] = useState("")
    const [newImg, setNewImg] = useState(null)
    const [alert, setAlert] = useState({success: false, danger: false, message: ""})
    const [isLoading, setIsLoading] = useState(false)
    const stickerPdfRef = useRef(null)
    const flyerPdfRef = useRef(null)
    const bandPdfRef = useRef(null)
    const { loading, error, data } = useShortenUrl(url);

    const exportPDF = (pdf) => {
        if (pdf.current) {
            pdf.current.save();
        }
      };
    
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

    const hotelNameForUrl = userDB.hotelName

    const handleUpdateAdminAccount = (url) => {
        return db.collection('businessUsers')
            .doc(user.uid)
            .update({
                logo: url,
                base64Url: baseUrl,
                appLink: `https://mysweethotel.eu/?url=${url}&hotelId=${userDB.hotelId}&hotelName=${hotelNameForUrl}`
            })
    }

    const handleUpdateHotel = (url) => {
        return db.collection('hotels')
            .doc(userDB.hotelId)
            .update({
                logo: url,
                base64Url: baseUrl,
                appLink: `https://mysweethotel.eu/?url=${url}&hotelId=${userDB.hotelId}&hotelName=${hotelNameForUrl}`
            })
    }

    const handleFirestoreNewData = (shortenUrl) => {
        console.log("SHORTENURL", shortenUrl)
        handleUpdateAdminAccount(shortenUrl)
        handleUpdateHotel(shortenUrl)   
        setTimeout(
            () => window.location.reload(),
            1000
        );
    }

    const handleUploadLogo = async() =>{
            const uploadTask = storage.ref(`msh-hotel-logo/${newImg.name}`).put(newImg)
            await uploadTask
    }


    const handleCreateUrl = async () => {
        const refImg = storage.ref("msh-hotel-logo").child(`${newImg.name.slice(0, -4)}_512x512.png`)
        const url = await refImg.getDownloadURL()
        setUrl(url)
        setIsLoading(false)
        setSwitchButton(true)
    } 

    const getBase64 = file => {
        return new Promise(resolve => {
          let fileInfo;
          let baseURL = "";
          // Make new FileReader
          let reader = new FileReader();
    
          // Convert the file to base64 text
          reader.readAsDataURL(file);
    
          // on reader load somthing...
          reader.onload = () => {
            // Make a fileInfo Object
            console.log("Called", reader);
            baseURL = reader.result;
            console.log(baseURL);
            resolve(baseURL);
          };
          console.log(fileInfo);
        });
      };

      const handleFileInputChange = e => {
        console.log(e.target.files[0]);    
        const file = e.target.files[0];
    
        getBase64(file)
          .then(result => {
            file["base64"] = result;
            console.log("File Is", file);
            setBaseUrl(result);
          })
          .catch(err => {
            console.log(err);
          });
      };

    const handleIconChange = async(event) => {
        if (event.target.files[0]){
            setAlert({success :true})
            setTimeout(() => {
                setAlert({success :false})
            }, 5000);
            setNewImg(event.target.files[0])
            handleFileInputChange(event)
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

      
    console.log("eeeeeeeeeeee", userDB)

    return (
        info.map((flow, key) => (

        <div key={key} className="global-container"
        style={{ backgroundImage: user.photoURL ? `url(${user.photoURL})` : `url(${DefaultProfile})` }}>
                <div className="profile-container">
                    <h1>
                        <div style={{color: "black", fontWeight: "bold", fontSize: "1em"}}>{flow.username}</div>
                        <div style={{fontSize: "15px"}}>{flow.email}</div>
                       { /*<div className="header-profile">
                            <img src={Tips} alt="tips" className="tips" /> 
                            {flow.tips} tips 
                            <img src={Arrow} alt="arrow" style={{width: "1vw", cursor: "pointer", marginLeft: "1vw", transform: "rotate(0turn)"}} id="arrowTop" onClick={handleShowDetails} /> 
                        </div>*/}
                    </h1>
                        {typeof window && window.innerWidth < 768 && <div className="header-toggle-container">
                            <Button variant="secondary" className="update-profile-button" onClick={handleShowUpdateEmail}>Modifier mon adresse e-mail</Button>
                            <Button variant="secondary" className="update-profile-button" onClick={handleShowUpdatePassword}>Modifier mon mot de passe</Button>
                        </div>}
                        {typeof window && window.innerWidth > 768 && <Divider style={{width: "75%", filter: "drop-shadow(1px 1px 1px)"}} />}
                </div>
            {typeof window && window.innerWidth > 768 && <>
                <div className="space-container">
                    <div className="space-box">
                        <div className="softSkin space-card"
                            onClick={handleShowUpdateEmail}>
                        <h2 style={{textAlign: "center", fontSize: "1.5em"}}>Modifier mon adresse e-mail</h2>
                        <img src={Email} alt="Fom" className="white-fom-icon" />
                        </div>
                    </div>
                    <div className="space-box">
                        <div className="softSkin space-card"
                            onClick={handleShowUpdatePassword}>
                        <h2 style={{textAlign: "center", fontSize: "1.5em"}}>Modifier mon mot de passe</h2>
                        <img src={Password} alt="Fom" className="white-fom-icon" />
                        </div>
                    </div>
                </div>
                {userDB.adminStatus && <div className="space-container">
                    <div className="space-box">
                        <div className="softSkin space-card"
                            onClick={() => setlistVisuel(true)}>
                        <h2 style={{textAlign: "center", fontSize: "1.5em"}}>Générer des visuels de communication</h2>
                        <img src={Visuel} alt="Fom" className="white-fom-icon" />
                        </div>
                    </div>
                    <div className="space-box">
                        <div className="softSkin space-card"
                            onClick={() => setListLogo(true)}>
                        <h2 style={{textAlign: "center", fontSize: "1.5em"}}>Téléverser une nouvelle icône</h2>
                        <img src={LogoHotel} alt="Fom" className="white-fom-icon" />
                        </div>
                    </div>
                </div>}
            </>}
        
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
                <Button variant="outline-dark" onClick={(event) => {
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
                <Button variant="outline-dark" onClick={(event) => {
                    handleUpdatePassword(event, formValue.password)
                    handleChangePassword()
                    handleCloseUpdatePassword()
                }}>Actualiser maintenant</Button>
            </Modal.Footer>
        </Modal>

        <Modal show={listVisuel}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => setlistVisuel(false)}
            >
            <Modal.Header closeButton className="bg-light">
                <Modal.Title id="contained-modal-title-vcenter">
                Générer des visuels de communication
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="visuel_modal_container">
                <div className="visuel">
                    <PDFExport ref={stickerPdfRef} paperSize="auto" margin={40} fileName="Sticker">
                        <Sticker url={userDB.appLink} logo={userDB.base64Url} />
                    </PDFExport>
                </div>
                <div className="space-box">
                    <div className="softSkin space-card"
                            onClick={() => exportPDF(stickerPdfRef)}>
                        <h2 style={{textAlign: "center", fontSize: "1.5em"}}>Générer un sticker</h2>
                        <img src={LogoSticker} alt="Fom" className="white-fom-icon" />
                    </div>
                </div>
                <div className="visuel">
                    <PDFExport ref={flyerPdfRef} paperSize="auto" margin={40} fileName="Flyer">
                        <Flyer url={userDB.appLink} logo={userDB.base64Url} />
                    </PDFExport>
                </div>
                <div className="space-box">
                    <div className="softSkin space-card"
                        onClick={() => exportPDF(flyerPdfRef)}>
                        <h2 style={{textAlign: "center", fontSize: "1.5em"}}>Générer un flyer</h2>
                        <img src={LogoFlyer} alt="Fom" className="white-fom-icon" />
                    </div>
                </div>
                <div className="visuel">
                    <PDFExport ref={bandPdfRef} paperSize="auto" margin={40} fileName="Band">
                        <Band url={userDB.appLink} logo={userDB.base64Url} />
                    </PDFExport>
                </div>
                <div className="space-box">
                    <div className="softSkin space-card"
                        onClick={() => exportPDF(bandPdfRef)}>
                        <h2 style={{textAlign: "center", fontSize: "1.5em"}}>Générer une banderolle</h2>
                        <img src={LogoBand} alt="Fom" className="white-fom-icon" />
                    </div>
                </div>
            </div>
            </Modal.Body>
        </Modal>

        <Modal show={listLogo}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => setListLogo(false)}
            >
            <Modal.Header closeButton className="bg-light">
                <Modal.Title id="contained-modal-title-vcenter">
                Téléverser une nouvelle icône
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{display: "flex", flexFlow: "column", alignItems: 'center'}}>
            <div className="dilema_upload_container">
                <input type="file" className="dilema-camera-icon"
                    onChange={handleIconChange} />
                <img src={LogoHotel} className="dilema_upload_logo" />
            </div>
            <div>{newImg && newImg.name}</div>
            {alert.success && <Alert variant="success" className="stepThree_alert">
                Votre logo a été téléversé avec succès !
            </Alert>}
            {alert.danger && <Alert variant="danger" className="stepThree_alert">
                Vous devez téléverser une image avant de valider le formulaire !
            </Alert>}
            </Modal.Body>
            <Modal.Footer>
                {switchButton ? <Button variant="dark" onClick={() => {
                    handleFirestoreNewData(data && data.link)
                }}>Confirmer le téléversement</Button> :
                isLoading ? <Spinner animation="grow" /> : <Button variant="outline-dark" onClick={(event) => {
                    if(newImg !== null) {
                        setIsLoading(true)
                        handleUploadLogo().then(() => {
                            return setTimeout(() => {
                                handleCreateUrl()
                            }, 5000);
                        })
                    }else{
                        setAlert({danger: true})
                        setTimeout(() => {
                            setAlert({danger : false})
                        }, 3000);
                    }
                }}>Téléverser</Button>}
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