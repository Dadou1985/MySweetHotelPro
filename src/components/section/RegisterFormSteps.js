import React, {useState, useEffect, useRef } from 'react'
import { Form, Button, Alert, DropdownButton, Dropdown, Spinner, Modal, ProgressBar } from 'react-bootstrap'
import { Input } from 'reactstrap'
import { auth, db, storage } from '../../Firebase'
import HotelLogo from '../../svg/hotel.svg'
import Sticker from './sticker'
import Flyer from './flyer'
import Band from './band'
import { PDFExport, savePDF } from "@progress/kendo-react-pdf"
import { useShortenUrl } from 'react-shorten-url';
import { sha256, sha224 } from 'js-sha256';
import Divider from '@material-ui/core/Divider';
import MshLogo from '../../svg/msh-newLogo-transparent.png'
import MshLogoPro from '../../svg/mshPro-newLogo-transparent.png'
import Fom from '../../svg/fom.svg'
import Drawer from '@material-ui/core/Drawer'
import '../css/registerFormSteps.css'

export default function RegisterFormSteps() {
    const [stepOne, setStepOne] = useState(true)
    const [stepTwo, setStepTwo] = useState(false)
    const [stepThree, setStepThree] = useState(false)
    const [stepFour, setStepFour] = useState(false)
    const [finalStep, setFinalStep] = useState(false)
    const [alert, setAlert] = useState({success: false, danger: false})
    const [filter, setFilter] = useState("")
    const [initialFilter, setInitialFilter] = useState("")
    const [info, setInfo] = useState([])
    const [url, setUrl] = useState("")
    const [img, setImg] = useState("")
    const [now, setNow] = useState(0)
    const [baseUrl, setBaseUrl] = useState("")
    const [newImg, setNewImg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showFindHotelDrawer, setShowFindHotelDrawer] = useState(false)
    const [findHotelForm, setfindHotelForm] = useState(false)
    const [showCreateHotelDrawer, setShowCreateHotelDrawer] = useState(false)
    const { loading, error, data } = useShortenUrl(url);
    const [formValue, setFormValue] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confPassword: "",
        region: "", 
        departement: "", 
        city: "", 
        standing: "", 
        phone: "", 
        room: null, 
        code_postal: "", 
        adress: "", 
        website: "", 
        mail: "", 
        hotelId: "",
        hotelName: "", 
        appLink: "",
        pricing: "",
    })

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

    const handleImgChange = (event) => {
        if (event.target.files[0]){
            setAlert({success :true})
            setTimeout(() => {
                setAlert({success :false})
            }, 5000);
            setNewImg(event.target.files[0])
            handleFileInputChange(event)
        }
    }

    const handleChangeInitialfilter = event =>{
        setInitialFilter(event.currentTarget.value)
    }

    

    let newHotelId = "mshPro" + Date.now() + sha256(formValue.hotelName)
    let hotelNameForUrl = formValue.hotelName.replace(/ /g,'%20')

    const stickerPdfRef = useRef(null)
    const flyerPdfRef = useRef(null)
    const bandPdfRef = useRef(null)

    const exportPDF = (pdf) => {
        if (pdf.current) {
            pdf.current.save();
        }
      };

    const getPartner = (url) => {
            return db.collection("hotels")
                .doc(formValue.hotelId)
                .update({
                    partnership: true,
                    logo: url,
                    base64Url: baseUrl,
                    appLink: `https://mysweethotel.eu/?url=${url}&hotelId=${newHotelId}&hotelName=${hotelNameForUrl}`
                }) 
        }

    const createHotel = (url) => {
        return db.collection("hotels")
            .doc(newHotelId)
            .set({
                hotelName: formValue.hotelName,
                adresse: formValue.adress,
                classement: `${formValue.standing} étoiles`,
                departement: formValue.departement,
                region: formValue.region,
                city: formValue.city,
                code_postal: formValue.code_postal,
                room: formValue.room,
                website: formValue.website,
                phone: formValue.phone,
                mail: formValue.email,
                markup: Date.now(),
                partnership: true,
                country: "FRANCE",
                pricingModel: "Premium",
                logo: url,
                base64Url: baseUrl,
                appLink: `https://mysweethotel.eu/?url=${url}&hotelId=${newHotelId}&hotelName=${hotelNameForUrl}`
            })
        }
    
    const handleCreateUser = (newUrl) => {
        setIsLoading(true)
        return auth.createUserWithEmailAndPassword(formValue.email.trim(), formValue.password.trim())
          .then((authUser) => {
              authUser.user.updateProfile({
                  displayName: `${formValue.firstName} ${formValue.lastName}`
              })
              handleFirestoreNewData(newUrl)
              return setStepThree(false)

          })
      }
    
    const adminMaker = async(url, userId) => {
        return db.collection('businessUsers')
        .doc(userId)
        .set({   
        username: `${formValue.firstName} ${formValue.lastName}`, 
        adminStatus: true, 
        email: formValue.email,
        password: formValue.password,
        hotelId: formValue.hotelId !== "" ? formValue.hotelId : newHotelId,
        hotelName: formValue.hotelName,
        hotelRegion: formValue.region,
        hotelDept: formValue.departement,
        createdAt: Date.now(),
        userId: userId,
        classement: `${formValue.standing} étoiles`,
        code_postal: formValue.code_postal,
        country: "FRANCE",
        city: formValue.city,
        room: formValue.room,
        language: "fr",
        logo: url,
        appLink: `https://mysweethotel.eu/?url=${url}&hotelId=${newHotelId}&hotelName=${hotelNameForUrl}`,
        pricingModel: "Premium",
        }) 
    }

    useEffect(() => {
        const getHotel = () => {
            return db.collection("hotels")
            .where("code_postal", "==", filter)
            }

        let unsubscribe = getHotel().onSnapshot(function(snapshot) {
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
    }, [filter])

    const handleFirestoreNewData = (shortenUrl) => {
        console.log("SHORTENURL", shortenUrl)
        return auth.onAuthStateChanged((user) => {
            if(user) {
                adminMaker(shortenUrl, user.uid).then(() => {
                    if(formValue.hotelId !== "") {
                        getPartner(shortenUrl)
                    }else{
                        createHotel(shortenUrl)
                    }
                })
            }
        })
    }

    const handleUploadLogo = () =>{
        if(newImg !== null) {
            const uploadTask = storage.ref(`msh-hotel-logo/${newImg.name}`).put(newImg)
            const newLogoName = newImg.name.slice(0, -4)
            const imgType = newImg.name.slice(-3)
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {console.log(error)},
          () => {
            storage
              .ref("msh-hotel-logo")
              .child(newImg.name)
              .getDownloadURL()
              .then(url => {
                  setUrl(url)
                }
              )}
            )
        }
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

    console.log('SHORTENURL', hotelNameForUrl.replace(/ /g,'%20'))

    return (<div className="register_form_container">
            <div style={{textAlign: "center"}}>
                <div>
                <div className="register_logo_container">
                    <img src={MshLogo} className="register_form_logo" />
                    <img src={MshLogoPro} className="register_form_logo" />
                </div>
                {finalStep ? <h1 className="form_title"><b>Welcome to the Smart Hospitality</b></h1> : <h1 className="form_title"><b>Formulaire d'inscription</b></h1>}
                </div>
                {stepOne && <h3 className="step_title">Première étape</h3>}
                {stepTwo && <h3 className="step_title">Deuxième étape</h3>}
                {stepThree && <h3 className="step_title">Troisième étape</h3>}
                {stepFour && <h3 className="step_title">Récapitulatif</h3>}
                {finalStep && <h3 className="step_title">Félicitations !<br/> Vous venez de prendre 2 ans d'avance sur la concurrence !</h3>}
                {finalStep ? <div className="progress_container"><ProgressBar className="progress_bar" now={now} label={`${now}%`} /></div> : <ProgressBar now={now} label={`${now}%`} />}
                
                {stepOne && <form className="stepOne_container">
                <h5 className="stepOne_title"><b>Créer un compte administrateur</b></h5>
                <Form.Row className="stepOne_form_name_input">
                    <Form.Group controlId="description1">
                    {typeof window && window.innerWidth > 768 && <Form.Label>Prénom</Form.Label>}
                    <Form.Control type="text" placeholder={typeof window && window.innerWidth > 768 ? "ex: Jane" : "Prénom"} className="stepOne_name_input" value={formValue.firstName} name="firstName" onChange={handleChange} required />
                    </Form.Group>
                
                    <Form.Group controlId="description2">
                    {typeof window && window.innerWidth > 768 && <Form.Label>Nom</Form.Label>}
                    <Form.Control type="text" placeholder={typeof window && window.innerWidth > 768 ? "ex: Doe" : "Nom"} className="stepOne_name_input" value={formValue.lastName} name="lastName" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
                    <Form.Group controlId="description3">
                    {typeof window && window.innerWidth > 768 && <Form.Label>E-mail</Form.Label>}
                    <Form.Control type="email" placeholder={typeof window && window.innerWidth > 768 ? "ex: jane.doe@msh.com" : "E-mail"} className="stepOne_input" value={formValue.email} name="email" onChange={handleChange} required />
                    </Form.Group>
                <Form.Row style={{
                    display: "flex",
                    flexFlow: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                    width: "70%",
                }}>
                    <Form.Group controlId="description4">
                    {typeof window && window.innerWidth > 768 && <Form.Label>Mot de passe</Form.Label>}
                    <Form.Control type="password" placeholder={typeof window && window.innerWidth > 768 ? "ex: jAnedOe2021!" : "Mot de passe"} className="stepOne_input" value={formValue.password} name="password" onChange={handleChange} required />
                    </Form.Group>
            
                    <Form.Group controlId="description5">
                    {typeof window && window.innerWidth > 768 && <Form.Label>Confirmer le mot de passe</Form.Label>}
                    <Form.Control type="password" placeholder={typeof window && window.innerWidth > 768 ? "ex: jAnedOe2021" : "Confirmer le mot de passe"} className="stepOne_input" value={formValue.confPassword} name="confPassword" onChange={handleChange} required />
                    </Form.Group>
                </Form.Row>
                <Button variant="success" className="stepOne_validation_button" onClick={() => {
                    if(formValue.password !== formValue.confPassword){
                        setAlert({danger: true})
                        setTimeout(() => {
                            setAlert({danger : false})
                        }, 3000);
                    }else{
                        setStepOne(false)
                        setStepTwo(true)
                        setNow(25)
                    }
                }}>Passer à l'étape suivante</Button>
                {alert.danger && <Alert variant="danger" className="stepOne_alert">
                    Attention ! Veuillez confirmer à nouveau votre mot de passe s'il vous plaît !
                </Alert>}
                </form>}
                {stepTwo && <div className="stepTwo_container">
                        {findHotelForm ? <Button variant="outline-info" className="stepTwo_find_button" onClick={() => setfindHotelForm(false)}>Trouver mon hôtel avec le code postal</Button> : <div className="stepTwo_find_container">
                        <h5 className="stepTwo_title"><b>Entrez le code postal de votre établissement</b></h5>
                        <Form.Row>
                            <Form.Group className="stepTwo_find_input_container">
                            <Input 
                                type="text" 
                                placeholder="Code postal" 
                                value={initialFilter} 
                                onChange={handleChangeInitialfilter}
                                className="text-center stepTwo_find_input"
                                pattern=".{5,}" />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group className="stepTwo_find_dropdown_container">
                            {typeof window && window.innerWidth > 768 ? <DropdownButton id="dropdown-basic-button" title="Valider" drop="down" variant="dark" onClick={() => setFilter(initialFilter)}>
                            {info.map(details => {
                                return <Dropdown.Item  onClick={()=>{
                                    setFormValue({
                                        hotelId: details.id,
                                        departement: details.departement,
                                        region: details.region,
                                        classement: details.classement,
                                        city: details.city,
                                        code_postal: details.code_postal,
                                        country: details.country,
                                        room: details.room,
                                        hotelName: details.hotelName
                                    })
                                    }}>{details.hotelName}</Dropdown.Item>
                                })}
                            </DropdownButton> : <Button variant="dark" className="stepTwo_find_dropdown_container" onClick={() => {
                                setFilter(initialFilter)
                                return setShowFindHotelDrawer(true)
                                }}>Valider</Button>}
                            </Form.Group>
                        </Form.Row>
                        <div className="stepTwo_hotel_name_container"><b>{formValue.hotelName && formValue.hotelName}</b></div>
                        </div>}
                        <div className="stepTwo_separation">ou</div>
                    {findHotelForm ? <div className="stepTwo_create_hotel_container">
                        <h5 style={{marginBottom: "3vh"}}><b>Enregistrer mon établissement</b></h5>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.hotelName} name="hotelName" type="text" placeholder="Nom de l'hôtel" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.region} name="region" type="text" placeholder="Région" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.departement} name="departement" type="text" placeholder="Département" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.city} name="city" type="text" placeholder="Ville" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.code_postal} name="code_postal" type="text" placeholder="Code postal" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.standing} name="standing" type="number" placeholder="Classement" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.room} name="room" type="number" placeholder="Nombre de chambre" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.adress} name="adress" type="text" placeholder="Adresse de l'hôtel" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.phone} name="phone" type="text" placeholder="Numéro de téléphone" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.website} name="website" type="text" placeholder="Site web" onChange={handleChange} required />
                        </Form.Group>
                    </div> : <Button variant="outline-dark" style={{marginTop: "3vh"}} onClick={() => {
                        if(typeof window && window.innerWidth > 768) {
                            setfindHotelForm(true)
                        }else{
                            setShowCreateHotelDrawer(true)
                        }
                        
                        }}>Je ne trouve pas mon établissement</Button>}
                    <div className="stepTwo_button_container">
                            <Button variant="outline-info" onClick={() => {
                                setStepTwo(false)
                                setStepOne(true)
                                setNow(0)
                            }} className="stepTwo_button">Etape précédente</Button>
                            <Button variant="success" onClick={() => {
                                setStepTwo(false)
                                setStepThree(true)
                                setNow(50)
                            }} className="stepTwo_button">Etape suivante</Button>
                        </div>
                </div>}
                {stepThree && <div>
                    <h5 className="stepThree_title"><b>Téléverser le logo de votre hôtel ici</b></h5>
                    <div className="stepThree_upload_container">
                        <input type="file" className="steps-camera-icon"
                            onChange={handleImgChange} />
                        <img src={HotelLogo} className="stepThree_upload_logo" />
                    </div>
                    <div>{newImg && newImg.name}</div>
                    <div className="stepThree_button_container">
                            <Button variant="outline-info" onClick={() => {
                                setStepThree(false)
                                setStepTwo(true)
                                setNow(25)
                            }} className="stepThree_button">Etape précédente</Button>
                            <Button variant="success" className="stepThree_button" onClick={() => {
                                if(newImg !== null) {
                                    handleUploadLogo()
                                    setStepThree(false) 
                                    setNow(75)                                   
                                    return setStepFour(true)
                                }else{
                                    setAlert({danger: true})
                                    setTimeout(() => {
                                        setAlert({danger : false})
                                    }, 3000);
                                }
                            }}>Etape suivante</Button>
                        </div>
                        {alert.success && <Alert variant="success" className="stepThree_alert">
                            Votre logo a été téléversé avec succès !
                        </Alert>}
                        {alert.danger && <Alert variant="danger" className="stepThree_alert">
                            Vous devez téléverser une image avant de valider le formulaire !
                        </Alert>}
                </div>}
                {stepFour && 
                <div>
                    <div className="stepFour_logo_contaner">
                        <img src={MshLogo} className="stepFour_logo_img" />
                        <Button variant="outline-info" size="sm" onClick={() => {
                            setStepFour(false)
                            setStepThree(true)
                            setNow(50)
                        }}>Revenir à cette étape</Button>
                    </div>
                    <Divider className="stepFour_divider" />
                    <div className="stepFour_hotel_data_container">
                        <h4 className="stepFour_hotel_data_title"><b>Etablissement hôtelier</b></h4>
                        <div>
                            <p><b>Nom:</b> {formValue.hotelName}</p>
                            <p><b>Adresse:</b> {formValue.adress}</p>
                            <p><b>Ville:</b> {formValue.city}</p>
                            <p><b>Département:</b> {formValue.departement}</p>
                            <p><b>Région:</b> {formValue.region}</p>
                            <p><b>Code postal:</b> {formValue.code_postal}</p>
                            <p><b>Classement:</b> {formValue.standing} étoiles</p>
                            <p><b>Capacité:</b> {formValue.room} chambres</p>
                            {formValue.website && <p><b>Site web:</b> {formValue.website}</p>}
                        </div>
                        <Button variant="outline-info" size="sm" onClick={() => {
                            setStepFour(false)
                            setStepTwo(true)
                            setNow(25)
                        }}>Revenir à cette étape</Button>
                    </div>
                    <Divider className="stepFour_divider" />
                    <div className="stepFour_manager_data_container">
                        <h4 className="stepFour_manager_data_title"><b>Responsable des opérations</b></h4>
                        <p><b>Nom:</b> {formValue.firstName} {formValue.lastName}</p>
                        <p><b>E-mail:</b> {formValue.email}</p>
                        <Button variant="outline-info" size="sm" onClick={() => {
                            setStepFour(false)
                            setStepOne(true)
                            setNow(0)
                        }}>Revenir à cette étape</Button>
                    </div>
                    {isLoading ? <Spinner animation="grow" /> : <Button variant="success" size="lg" className="stepFour_button" onClick={() => {
                            handleCreateUser(data.link)
                            setStepFour(false)
                            setNow(100)
                            return setFinalStep(true)
                        }}>Valider mon formulaire</Button>}
                </div>
                }
                {finalStep && 
                <div className="finalStep_container">
                    <div className="finalStep_greeting_message_container">
                        <p>Vous pouvez désormais jouir de nos services gratuitement et ce, durant toute la phase de pré-lancement qui s'étendra jusqu'en mai 2022.</p>
                        <p>Vous pouvez dès maintenant accéder à notre solution développée pour le personnel en cliquant sur le lien suivant : <a href="https://mysweethotelpro.com/" target="_blank">mysweethotelpro.com</a></p>
                        {typeof window && window.innerWidth > 1080 ? <p>Les visuels ci-dessous ont été élaborés afin de faciliter la communication autour de la solution à destination de la clientèle.</p> : 
                        <p><b>Des visuels ont été élaborés afin de faciliter la communication autour de la solution à destination de la clientèle.<br/>
                        Vous pouvez les télécharger depuis l'application web en allant dans la section "Profil".</b></p>}
                        <p>Toute l'équipe de <i>My Sweet Hotel</i> vous remercie pour la confiance que vous nous avez accordée !</p>
                    </div>
                    <a href="https://mysweethotel.com/" style={{fontSize: "1.5em", color: "black"}}><b>Revenir sur le site web</b></a>
                    {typeof window && window.innerWidth > 1080 && <div>
                        <div className="finalStep_visual_container">
                            <PDFExport ref={stickerPdfRef} paperSize="auto" margin={40} fileName="Sticker">
                                <Sticker url={`https://mysweethotel.eu/?url=${data && data.link}&hotelId=${newHotelId}&hotelName=${formValue.hotelName}`} logo={baseUrl} />
                            </PDFExport>
                        </div>
                        <Button variant="dark" size="lg" onClick={() => exportPDF(stickerPdfRef)}>Télécharger le sticker</Button>
                    </div>}
                    {typeof window && window.innerWidth > 1080 && <Divider className="finalStep_divider" />}
                    {typeof window && window.innerWidth > 1080 && <div> 
                        <div className="finalStep_visual_container">
                            <PDFExport ref={flyerPdfRef} paperSize="auto" margin={40} fileName="Flyer">
                                <Flyer url={`https://mysweethotel.eu/?url=${data && data.link}&hotelId=${newHotelId}&hotelName=${formValue.hotelName}`} logo={baseUrl} />
                            </PDFExport>
                        </div>
                        <Button variant="dark" size="lg" onClick={() => exportPDF(flyerPdfRef)}>Télécharger l'affiche</Button>
                    </div>}
                    {typeof window && window.innerWidth > 1080 && <Divider className="finalStep_divider" />}
                    {typeof window && window.innerWidth > 1080 && <div>
                        <div className="finalStep_visual_container">
                            <PDFExport ref={bandPdfRef} paperSize="auto" margin={40} fileName="Band">
                                <Band url={`https://mysweethotel.eu/?url=${data && data.link}&hotelId=${newHotelId}&hotelName=${formValue.hotelName}`} logo={baseUrl} />
                            </PDFExport>
                        </div>
                        <Button variant="dark" size="lg" onClick={() => exportPDF(bandPdfRef)}>Télécharger la banderolle</Button>
                    </div>}
               </div> }
               <Modal show={showModal} centered size="lg" onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                    <Modal.Title>Etes-vous sûr.e de vouloir sélectionner cette image ?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="finalStep_modal">{newImg && newImg.name}</Modal.Body>
                    <Modal.Footer>
                    <Button variant="outline-dark" onClick={() => {
                        setNewImg(null)
                        setShowModal(false)}}>
                        non
                    </Button>
                    <Button variant="dark" onClick={handleUploadLogo}>
                        oui
                    </Button>
                    </Modal.Footer>
                </Modal>

                <Drawer anchor="bottom" open={showFindHotelDrawer} onClose={() => setShowFindHotelDrawer(false)}>
                    <div style={{
                        position: "fixed", 
                        backgroundColor: "white", 
                        width: "100vw",
                        display: "flex",
                        flexFlow: "column",
                        alignItems: "center"
                        }}>
                        <h5 style={{textAlign: "center", paddingTop: "2vh"}}><b>Liste des hôtels trouvés</b></h5>
                        <Divider style={{width: "90vw", marginBottom: "2vh", filter: "drop-shadow(1px 1px 1px)"}} />
                    </div>
                    <div id="drawer-container" style={{
                        display: "flex",
                        flexFlow: "column", 
                        justifyContent: "space-between",
                        padding: "5%", 
                        maxHeight: "70vh",
                        marginBottom: "10vh", 
                        marginTop: "8vh"}}>
                            {info.map(details => {
                                return <div style={{
                                    padding: "2vw", 
                                    fontSize: "1.3em", 
                                    width: "100%", 
                                    border: "1px solid lightgray", 
                                    borderRadius: "5px", 
                                    marginBottom: "1vh",
                                }}  
                                    onClick={()=>{
                                    setFormValue({
                                        hotelId: details.id,
                                        departement: details.departement,
                                        region: details.region,
                                        classement: details.classement,
                                        city: details.city,
                                        code_postal: details.code_postal,
                                        country: details.country,
                                        room: details.room,
                                        hotelName: details.hotelName
                                    })
                                    setShowFindHotelDrawer(false)
                                }}>{details.hotelName}</div>
                            })}
                    </div>
                </Drawer>

                <Drawer anchor="bottom" open={showCreateHotelDrawer} onClose={() => setShowCreateHotelDrawer(false)}  className="phone_container_drawer">
                <div style={{
                        position: "fixed", 
                        backgroundColor: "white", 
                        width: "100vw",
                        display: "flex",
                        flexFlow: "column",
                        alignItems: "center"
                        }}>
                        <h5 style={{textAlign: "center", paddingTop: "2vh", fontSize: "1.5em"}}><b>Enregistrer mon établissement</b></h5>
                        <Divider style={{width: "90vw", marginBottom: "2vh", filter: "drop-shadow(1px 1px 1px)"}} />
                    </div>
                <div id="drawer-container" style={{
                        display: "flex",
                        flexFlow: "column", 
                        justifyContent: "space-between",
                        padding: "5%", 
                        maxHeight: "100vh",
                        marginBottom: "15vh", 
                        marginTop: "8vh"
                    }}>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.hotelName} name="hotelName" type="text" placeholder="Nom de l'hôtel" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.region} name="region" type="text" placeholder="Région" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.departement} name="departement" type="text" placeholder="Département" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.city} name="city" type="text" placeholder="Ville" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.code_postal} name="code_postal" type="text" placeholder="Code postal" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.standing} name="standing" type="number" placeholder="Classement" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.room} name="room" type="number" placeholder="Nombre de chambre" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.adress} name="adress" type="text" placeholder="Adresse de l'hôtel" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.phone} name="phone" type="text" placeholder="Numéro de téléphone" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.website} name="website" type="text" placeholder="Site web" onChange={handleChange} required />
                        </Form.Group>
                </div>
                <Button variant="success" style={{position: "fixed", bottom: "0", width: "100%", borderRadius: "0"}} onClick={() => setShowCreateHotelDrawer(false)}>Valider </Button>            
            </Drawer>
            </div>
        </div>
    )
}
