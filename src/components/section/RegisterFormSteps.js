import React, {useState, useEffect } from 'react'
import { Form, Button, Alert, DropdownButton, Dropdown, Spinner, Modal, ProgressBar } from 'react-bootstrap'
import { Input } from 'reactstrap'
import { auth, db, storage } from '../../Firebase'
import HotelLogo from '../../svg/hotel.svg'
import { useShortenUrl } from 'react-shorten-url';
import { sha256 } from 'js-sha256';
import Divider from '@material-ui/core/Divider';
import MshLogo from '../../svg/msh-newLogo-transparent.png'
import MshLogoPro from '../../svg/mshPro-newLogo-transparent.png'
import Fom from '../../svg/fom.svg'
import Home from '../../svg/home.svg'
import Close from '../../svg/close.svg'
import Drawer from '@material-ui/core/Drawer'
import '../css/registerFormSteps.css'
import { navigate } from 'gatsby-link'

export default function RegisterFormSteps() {
    const [stepOne, setStepOne] = useState(true)
    const [stepTwo, setStepTwo] = useState(false)
    const [stepThree, setStepThree] = useState(false)
    const [stepFour, setStepFour] = useState(false)
    const [finalStep, setFinalStep] = useState(false)
    const [alert, setAlert] = useState({success: false, danger: false, message: ""})
    const [filter, setFilter] = useState("")
    const [initialFilter, setInitialFilter] = useState("")
    const [info, setInfo] = useState([])
    const [url, setUrl] = useState("")
    const [imgType, setImgType] = useState("")
    const [now, setNow] = useState(0)
    const [isRegistrated, setIsRegistrated] = useState(false)
    const [baseUrl, setBaseUrl] = useState("")
    const [newImg, setNewImg] = useState(null)
    const [hotelId, setHotelId] = useState("")
    const [isLoading, setIsLoading] = useState(true)
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
        adresse: "", 
        website: "", 
        hotelName: "", 
    })

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

    const handleDeleteImg = (imgId) => {
        const storageRef = storage.refFromURL(imgId)
        const imageRef = storage.ref(storageRef.fullPath)

        imageRef.delete()
        .then(() => {
            console.log(`${imgId} has been deleted succesfully`)
        })
        .catch((e) => {
            console.log('Error while deleting the image ', e)
        })
    }

    const handleImgChange = async(event) => {
        if (event.target.files[0]){
                setAlert({success :true})
                setTimeout(() => {
                    setAlert({success :false})
                }, 5000);
                setNewImg(event.target.files[0])
                handleFileInputChange(event)
            }
    }

    const handleChangeInitialfilter = event => {
        setInitialFilter(event.currentTarget.value)
        setIsRegistrated(false)
        setAlert({danger: false})
        setFormValue({...formValue,
            region: "", 
            departement: "", 
            city: "", 
            standing: "", 
            phone: "", 
            room: null, 
            code_postal: "", 
            adresse: "", 
            website: "", 
            hotelName: "", 
        })
    }

    

    let newHotelId = "mshPro" + Date.now() + sha256(formValue.hotelName)
    let hotelNameForUrl = formValue.hotelName.replace(/ /g,'%20')

    const getPartner = (url) => {
            return db.collection("hotels")
                .doc(hotelId)
                .update({
                    pricingModel: "Premium",
                    partnership: true,
                    logo: url ? url : null,
                    base64Url: baseUrl ? baseUrl : null,
                    appLink: `https://mysweethotel.eu/?url=${url ? url : null}&hotelId=${newHotelId}&hotelName=${hotelNameForUrl}`
                }) 
        }

    const createHotel = (url) => {
        return db.collection("hotels")
            .doc(newHotelId)
            .set({
                hotelName: formValue.hotelName,
                adresse: formValue.adresse,
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
                logo: url ? url : null,
                base64Url: baseUrl ? baseUrl : null,
                appLink: `https://mysweethotel.eu/?url=${url ? url : null}&hotelId=${newHotelId}&hotelName=${hotelNameForUrl}`
            })
        }
    
    const handleCreateUser = async (newUrl) => {
        setIsLoading(true)
        const authUser = await auth.createUserWithEmailAndPassword(formValue.email.trim(), formValue.password.trim())
        authUser.user.updateProfile({
            displayName: `${formValue.firstName} ${formValue.lastName}`
        })
        handleFirestoreNewData(newUrl)
        return setStepThree(false)
      }
    
    const adminMaker = async(url, userId) => {
        return db.collection('businessUsers')
        .doc(userId)
        .set({   
        username: `${formValue.firstName} ${formValue.lastName}`, 
        adminStatus: true, 
        email: formValue.email,
        password: formValue.password,
        hotelId: hotelId !== "" ? hotelId : newHotelId,
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
        logo: url ? url : null,
        base64Url: baseUrl ? baseUrl : null,
        appLink: `https://mysweethotel.eu/?url=${url ? url : null}&hotelId=${newHotelId}&hotelName=${hotelNameForUrl}`,
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
                    if(hotelId !== "") {
                        getPartner(shortenUrl)
                    }else{
                        createHotel(shortenUrl)
                    }
                })
            }
        })
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


    console.log('SHORTENURL', url)

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
                
                {stepOne && <form className="stepOne_container" onSubmit={() => {
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
                }}>
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
                <Button variant="success" className="stepOne_validation_button" type="submit">Passer à l'étape suivante</Button>
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
                                    setFormValue({...formValue,
                                        departement: details.departement,
                                        region: details.region,
                                        standing: details.classement,
                                        city: details.city,
                                        code_postal: details.code_postal,
                                        room: details.room,
                                        hotelName: details.hotelName,
                                        adresse: details.adresse,
                                        phone: details.phone,
                                        website: details.website
                                    })
                                    setHotelId(details.id)
                                    if(details.pricingModel === "Premium") {
                                        setIsRegistrated(true)
                                    }
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
                            <Form.Control className="stepTwo_create_form_input" value={formValue.adresse} name="adresse" type="text" placeholder="Adresse de l'hôtel" onChange={handleChange} required />
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
                                if(isRegistrated) {
                                    setAlert({
                                        danger: true,
                                        message: "Cet établissement bénéficie déjà de nos services ! Pour plus de renseignement, veuillez vous adresser au responsable des opérations de votre équipe."
                                    })
                                }else{
                                    if(formValue.region === "" || formValue.hotelName === "" || formValue.departement === "" || formValue.city === "" || formValue.code_postal === "" || formValue.standing === "" || formValue.room === null || formValue.adresse === "" || formValue.phone === "" || formValue.website === ""){
                                        setAlert({
                                            danger: true,
                                            message: "Vous devez choisir ou enregistrer un établissement !"
                                        })  
                                    }else{
                                        setStepTwo(false)
                                        setStepThree(true)
                                        setNow(50)
                                    }
                                }
                            }} className="stepTwo_button">Etape suivante</Button>
                        </div>
                        {alert.danger && <div>
                            <Alert variant="danger" className="stepThree_alert">
                                {alert.message}
                            </Alert>
                            {isRegistrated && <a href="https://mysweethotel.com/" style={{fontSize: "1.5em", color: "black"}}><b>Revenir sur le site web</b></a>}
                        </div>}
                </div>}
                {stepThree && <div>
                    <h5 className="stepThree_title"><b>Téléverser le logo de votre hôtel ici</b></h5>
                    <div className="stepThree_upload_container">
                        <input type="file" className="steps-camera-icon"
                            onChange={handleImgChange} />
                        <img src={HotelLogo} className="stepThree_upload_logo" />
                    </div>
                    <div>{newImg && newImg.name}</div>
                    <Button variant="outline-dark" style={{marginTop: "1vh"}} onClick={() => {
                        setStepThree(false) 
                        setNow(75)                                   
                        setStepFour(true)
                        }}>Je le ferai plus tard</Button>
                    <div className="stepThree_button_container">
                            <Button variant="outline-info" onClick={() => {
                                setStepThree(false)
                                setStepTwo(true)
                                setNow(25)
                                setIsLoading(false)
                            }} className="stepThree_button">Etape précédente</Button>
                            <Button variant="success" className="stepThree_button" onClick={() => {
                                if(newImg !== null) {
                                    handleUploadLogo().then(() => {
                                        setStepThree(false) 
                                        setNow(75)                                   
                                        setStepFour(true)
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
                        <img src={baseUrl ? baseUrl : HotelLogo} className="stepFour_logo_img" />
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
                            <p><b>Adresse:</b> {formValue.adresse}</p>
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
                        <p><b>Nom: </b>{formValue.firstName} {formValue.lastName}</p>
                        <p><b>E-mail:</b> {formValue.email}</p>
                        <Button variant="outline-info" size="sm" onClick={() => {
                            setStepFour(false)
                            setStepOne(true)
                            setNow(0)
                        }}>Revenir à cette étape</Button>
                    </div>
                    {isLoading ? <Spinner animation="grow" /> : <Button variant="success" style={{width: "90vw"}} className="stepFour_button" onClick={() => {
                            if(formValue.region !== "" || formValue.hotelName !== "" || formValue.departement !== "" || formValue.city !== "" || formValue.code_postal !== "" || formValue.standing !== "" || formValue.room === null || formValue.adresse !== "" || formValue.phone !== "" || formValue.website !== ""){
                                    handleCreateUser(data && data.link)
                                    setStepFour(false)
                                    setNow(100)
                                    return setFinalStep(true)
                            }else{
                                setAlert({danger: true, message: "Vous n'avez pas rempli tous les champs du formulaire !"})
                                setTimeout(() => {
                                    setAlert({danger: false, message: ""})
                                }, 5000);
                            }
                        }}>Valider mon formulaire</Button>}
                        {alert.danger && <Alert variant="danger" className="stepThree_alert">
                            {alert.message}
                        </Alert>}
                </div>
                }
                {finalStep && 
                <div className="finalStep_container">
                    <div className="finalStep_greeting_message_container" style={{marginTop: "5vh"}}>
                        <p>Vous pouvez désormais jouir de nos services gratuitement et ce, durant toute la phase de pré-lancement qui s'étendra jusqu'en mai 2022.</p>
                        <p>Vous pouvez dès maintenant accéder à notre solution en cliquant sur le lien suivant : <a href="https://mysweethotelpro.com/" target="_blank">mysweethotelpro.com</a></p>
                        {typeof window && window.innerWidth > 1080 ? <p>Les visuels ci-dessous ont été élaborés afin de faciliter la communication autour de la solution à destination de la clientèle.</p> : 
                        <p><b>Des visuels ont été élaborés afin de faciliter la communication autour de la solution à destination de la clientèle.<br/>
                        Téléchargeable uniquement depuis un ordinateur (portable ou fixe), vous les trouverez dans la section "Profil" de l'application web en cliquant sur l'icône suivante <img src={Fom} alt="Fom" style={{width: "5%", marginLeft: "1vw", marginRight: "1vw", filter: "drop-shadow(1px 1px 1px)"}} /> situé dans la barre de navigation.<br/></b></p>}
                        {!url && <p><b>Vous pourrez également y téléverser le logo de votre établissement afin que votre marque soit identifiable par vos clients et votre personnel.</b></p>}
                        <p>Toute l'équipe de <i><b>My Sweet Hotel</b></i> vous remercie pour la confiance que vous lui avez accordée !</p>
                    </div>
                    <a href="https://mysweethotel.com/" target="_blank" style={{
                        display: 'flex',
                        flexFlow: "column",
                        alignItems: "center",
                        cursor: "pointer", 
                        color: "black"
                    }}>
                        <img src={Home} style={{width: "15vw", marginTop: "5vh", marginBottom: "1vh"}} />
                        <b>Revenir sur le site</b>
                    </a >
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
                                    setFormValue({...formValue,
                                        departement: details.departement,
                                        region: details.region,
                                        standing: details.classement,
                                        city: details.city,
                                        code_postal: details.code_postal,
                                        room: details.room,
                                        hotelName: details.hotelName,
                                        adresse: details.adresse,
                                        phone: details.phone,
                                        website: details.website
                                    })
                                    setHotelId(details.id)
                                    if(details.pricingModel === "Premium") {
                                        setIsRegistrated(true)
                                    }
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
                        <h5 style={{textAlign: "center", paddingTop: "2vh", fontSize: "1.5em"}}>
                            <b>Enregistrer mon établissement</b>
                            <img src={Close} style={{width: "5vw", cursor: "pointer", position: "absolute", right: "5%"}} onClick={() => {
                                setFormValue({...formValue,
                                    region: "", 
                                    departement: "", 
                                    city: "", 
                                    standing: "", 
                                    phone: "", 
                                    room: null, 
                                    code_postal: "", 
                                    adresse: "", 
                                    website: "", 
                                    hotelName: "",
                                    phone: "",
                                    website: ""
                                })
                                setShowCreateHotelDrawer(false)}} />
                        </h5>
                        <Divider style={{width: "90vw", marginBottom: "2vh", filter: "drop-shadow(1px 1px 1px)"}} />
                    </div>
                <form id="drawer-container" style={{
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
                            <Form.Control className="stepTwo_create_form_input" value={formValue.adresse} name="adresse" type="text" placeholder="Adresse de l'hôtel" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.phone} name="phone" type="text" placeholder="Numéro de téléphone" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.website} name="website" type="text" placeholder="Site web" onChange={handleChange} required />
                        </Form.Group>
                        <Button variant="success" style={{position: "fixed", bottom: "0", left: "0", width: "100%", borderRadius: "0"}} onClick={() => {
                            setShowCreateHotelDrawer(false)
                        }}>Valider </Button>            
                </form>
            </Drawer>
            </div>
        </div>
    )
}
