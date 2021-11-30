import React, {useState, useEffect, useRef } from 'react'
import { Form, Button, Alert, DropdownButton, Dropdown, Spinner } from 'react-bootstrap'
import { Input } from 'reactstrap'
import { auth, db, functions, storage } from '../Firebase'
import HotelLogo from '../svg/hotel.svg'
import Sticker from '../components/section/sticker'
import Flyer from '../components/section/flyer'
import Band from '../components/section/band'
import { PDFExport, savePDF } from "@progress/kendo-react-pdf"

export default function RegisterForm() {
    const [stepOne, setStepOne] = useState(true)
    const [stepTwo, setStepTwo] = useState(false)
    const [stepThree, setStepThree] = useState(false)
    const [finalStep, setFinalStep] = useState(false)
    const [alert, setAlert] = useState(false)
    const [filter, setFilter] = useState("")
    const [initialFilter, setInitialFilter] = useState("")
    const [info, setInfo] = useState([])
    const [url, setUrl] = useState("")
    const [img, setImg] = useState("")
    const [newImg, setNewImg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
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
            setNewImg(event.target.files[0])
        }
    }

    const handleChangeInitialfilter = event =>{
        setInitialFilter(event.currentTarget.value)
    }

    let newHotelId = "mshPro" + formValue.hotelName + Date.now()

    const pdfExportRef = useRef(null)

    const exportPDF = () => {
        if (pdfExportRef.current) {
            pdfExportRef.current.save();
        }
      };

    const getPartner = () => {
            return db.collection("hotels")
                .doc(formValue.hotelId)
                .update({
                    partnership: true,
                }) 
        }

    const createHotel = () => {
        return db.collection("hotels")
            .doc(newHotelId.trim())
            .set({
                hotelName: formValue.hotelName,
                adresse: formValue.adress,
                classement: formValue.standing,
                departement: formValue.departement,
                region: formValue.region,
                city: formValue.city,
                code_postal: formValue.code_postal,
                room: `${formValue.room} étoiles`,
                website: formValue.website,
                phone: formValue.phone,
                mail: formValue.email,
                markup: Date.now(),
                partnership: true,
                country: "FRANCE",
                pricingModel: "Premium",
                logo: url,
                appLink: `https://mysweethotel.eu/?url=${url}&hotelId=${newHotelId}&hotelName=${formValue.hotelName}`
            })
            .then(()=>{
                setFormValue("" || 0)
            }) 
        }
    

    let newUid = "mshPro" + formValue.firstName + formValue.lastName + formValue.hotelName + Date.now()

    const handleCreateUser = () => {
        auth.createUserWithEmailAndPassword(formValue.email.trim(), formValue.password.trim())
          .then((authUser) => {
              authUser.user.updateProfile({
                  displayName: `${formValue.firstName} ${formValue.lastName}`
              })
          })
      }
    
    const adminMaker = async() => {
        return db.collection('businessUsers')
        .doc(newUid.trim())
        .set({   
        username: `${formValue.firstName} ${formValue.lastName}`, 
        adminStatus: true, 
        email: formValue.email,
        password: "password",
        hotelId: formValue.hotelId !== "" ? formValue.hotelId : newHotelId,
        hotelName: formValue.hotelName,
        hotelRegion: formValue.region,
        hotelDept: formValue.departement,
        createdAt: Date.now(),
        userId: newUid.trim(),
        classement: formValue.standing,
        code_postal: formValue.code_postal,
        country: "FRANCE",
        city: formValue.city,
        room: formValue.room,
        language: "fr",
        logo: url,
        appLink: `https://mysweethotel.eu/?url=${url}&hotelId=${newHotelId}&hotelName=${formValue.hotelName}`,
        pricingModel: "Premium",
        }) 
        .then(()=>{
            setFormValue("" || 0)
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
                  setAlert(true)
                  setTimeout(() => {
                      setAlert(false)
                  }, 5000);
                  return setUrl(url)})
                }
            )
        }
    }


    return (
        <div style={{
            display: "flex",
            flexFlow: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "5%"
        }}>
            <div style={{
                textAlign: "center"
            }}>
                <h1>Formulaire d'inscription</h1>
                {stepOne && <h3>Première étape</h3>}
                {stepTwo && <h3>Deuxième étape</h3>}
                {stepThree && <h3>Troisième étape</h3>}
                {stepOne && <form style={{
                    display: "flex",
                    flexFlow: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "50vw",
                    marginTop: "10vh"
                }}>
                <Form.Row style={{
                    display: "flex",
                    flexFlow: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                    width: "70%",
                }}>
                    <Form.Group controlId="description">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control type="text" placeholder="ex: Jane" style={{width: "10vw"}} value={formValue.firstName} name="firstName" onChange={handleChange} required />
                    </Form.Group>
                
                    <Form.Group controlId="description2">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control type="text" placeholder="ex: Doe" style={{width: "10vw"}} value={formValue.lastName} name="lastName" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
                    <Form.Group controlId="description">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control type="text" placeholder="ex: jane.doe@msh.com" style={{width: "20vw"}} value={formValue.email} name="email" onChange={handleChange} required />
                    </Form.Group>
                    <Form.Row style={{
                    display: "flex",
                    flexFlow: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                    width: "70%",
                }}>
                    <Form.Group controlId="description">
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control type="text" placeholder="ex: jAnedOe2021!" style={{width: "20vw"}} value={formValue.password} name="password" onChange={handleChange} required />
                    </Form.Group>
            
                    <Form.Group controlId="description2">
                    <Form.Label>Confirmer le mot de passe</Form.Label>
                    <Form.Control type="text" placeholder="ex: jAnedOe2021" style={{width: "20vw"}} value={formValue.confPassword} name="confPassword" onChange={handleChange} required />
                    </Form.Group>
                </Form.Row>
                <Button variant="outline-success" style={{marginTop: "3vh"}}onClick={() => {
                    if(formValue.password !== formValue.confPassword){
                        setAlert(true)
                        setTimeout(() => {
                            setAlert(false)
                        }, 3000);
                    }else{
                        setStepOne(false)
                        setStepTwo(true)
                    }
                }}>Passer à l'étape suivante</Button>
                {alert && <Alert variant="danger" style={{marginTop: "3vh"}}>
                    Attention ! Veuillez confirmer à nouveau votre mot de passe s'il vous plaît !
                </Alert>}
                </form>}
                {stepTwo && <div>
                    <div style={{
                        display: "flex",
                        flexFlow: 'row',
                        justifyContent: "center",
                        marginTop: "5vh"
                    }}>
                    <Form.Row>
                        <Form.Group style={{
                            display: "flex",
                            flexFlow: "column",
                            alignItems: "center",
                            
                        }}>
                        <Input 
                            style={{width: "25vw"}}
                            type="text" 
                            placeholder="Enter le code postal de votre hôtel" 
                            value={initialFilter} 
                            onChange={handleChangeInitialfilter}
                            className="text-center"
                            pattern=".{5,}" />
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group style={{
                            display: "flex",
                            flexFlow: "column",
                            alignItems: "center"
                        }}>
                        <DropdownButton id="dropdown-basic-button" title="Valider" drop="bottom" variant="dark" onClick={() => setFilter(initialFilter)}>
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
                                    logo: details.logo,
                                    appLink: details.appLink,
                                    pricing: details.pricingModel,
                                    hotelName: details.hotelName
                                })
                                }}>{details}</Dropdown.Item>
                            })}
                        </DropdownButton>
                        </Form.Group>
                    </Form.Row>
                    </div>
                    <div style={{
                        display: "flex",
                        flexFlow: "column wrap",
                        justifyContent: "space-around",
                        alignItems: "center",
                        padding: "5%",
                        textAlign: "center"
                    }}>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "30vw"}} value={formValue.hotelName} name="hotelName" type="text" placeholder="Nom de l'hôtel" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "30vw"}} value={formValue.region} name="region" type="text" placeholder="Région" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "30vw"}} value={formValue.departement} name="departement" type="text" placeholder="Département" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "30vw"}} value={formValue.city} name="city" type="text" placeholder="Ville" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "30vw"}} value={formValue.code_postal} name="code_postal" type="text" placeholder="Code postal" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "30vw"}} value={formValue.standing} name="standing" type="number" placeholder="Classement" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "30vw"}} value={formValue.room} name="room" type="number" placeholder="Nombre de chambre" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "30vw"}} value={formValue.adress} name="adress" type="text" placeholder="Adresse de l'hôtel" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "30vw"}} value={formValue.phone} name="phone" type="text" placeholder="Numéro de téléphone" onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control style={{width: "30vw"}} value={formValue.website} name="website" type="text" placeholder="Site web" onChange={handleChange} required />
                        </Form.Group>
                        <div style={{
                            display: "flex",
                            flexFlow: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%"
                        }}>
                            <Button variant="outline-info" onClick={() => {
                                setStepTwo(false)
                                setStepOne(true)
                            }} style={{marginTop: "3vh"}}>Etape précédente</Button>
                            <Button variant="outline-success" onClick={() => {
                                setStepTwo(false)
                                setStepThree(true)
                            }} style={{marginTop: "3vh"}}>Etape suivante</Button>
                        </div>
                    </div>    
                </div>}
                {stepThree && <div>
                    <div style={{
                        display: "flex",
                        flexFlow: "column", 
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "5vh",
                        marginBottom: "5vh",
                        cursor: "pointer",
                        border: "3px dashed black", 
                        padding: "5%",
                        borderRadius: "5%",
                        width: "30vw"
                    }}>
                        <h4>Téléverser le logo de votre hôtel ici</h4>
                        <input type="file" className="phone-camera-icon"
                            onChange={handleImgChange} />
                        <img src={HotelLogo} style={{width: "50%"}} />
                    </div>
                    <div style={{
                            display: "flex",
                            flexFlow: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%"
                        }}>
                            <Button variant="outline-info" onClick={() => {
                                setStepThree(false)
                                setStepTwo(true)
                            }} style={{marginTop: "3vh"}}>Etape précédente</Button>
                            {isLoading ? <Spinner animation="grow" /> : <Button variant="success" onClick={() => {
                                setStepTwo(false)
                                setStepThree(true)
                            }} style={{marginTop: "3vh"}} onClick={async() => {
                                await setIsLoading(true)
                                await handleCreateUser()
                                await handleUploadLogo()
                                await auth.onAuthStateChanged((user) => {
                                    if(user) {
                                        adminMaker().then(() => {
                                            if(formValue.hotelId !== "") {
                                                getPartner()
                                            }else{
                                                createHotel()
                                            }
                                        })
                                    }
                                })
                                await setStepThree(false)
                                return setFinalStep(true)
                            }}>Valider mon formulaire</Button>}
                        </div>
                        {alert && <Alert variant="success" style={{marginTop: "3vh"}}>
                            Votre logo a été téléversé avec succès !
                        </Alert>}
                </div>}
                {finalStep && <div>
                <PDFExport ref={pdfExportRef} paperSize="auto" margin={40} fileName="Sticker">
                    <Sticker url={`https://mysweethotel.eu/?url=${url}&hotelId=${newHotelId}&hotelName=${formValue.hotelName}`} logo={url} />
                </PDFExport>
                <PDFExport ref={pdfExportRef} paperSize="auto" margin={40} fileName="Flyer">
                    <Flyer url={`https://mysweethotel.eu/?url=${url}&hotelId=${newHotelId}&hotelName=${formValue.hotelName}`} logo={url} />
                </PDFExport>
                <PDFExport ref={pdfExportRef} paperSize="auto" margin={40} fileName="Band">
                    <Band url={`https://mysweethotel.eu/?url=${url}&hotelId=${newHotelId}&hotelName=${formValue.hotelName}`} logo={url} />
                </PDFExport>
                <Button variant="outline-success" onClick={exportPDF}>Télécharger les visuels de l'application</Button>
               </div> }
            </div>
        </div>
    )
}
