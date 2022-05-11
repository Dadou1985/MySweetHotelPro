import React, {useState, useEffect } from 'react'
import { Form, Button, Alert, DropdownButton, Dropdown, Spinner, Modal, ProgressBar } from 'react-bootstrap'
import { Input } from 'reactstrap'
import { auth, db, storage, functions } from '../../Firebase'
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
import '../css/section/registerFormSteps.css'
import { useTranslation } from "react-i18next"

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
    const { data } = useShortenUrl(url);
    const [formValue, setFormValue] = useState({
        firstName: "",
        lastName: "",
        email: "",
        //password: "",
        //confPassword: "",
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
    const { t } = useTranslation()

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
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
                    appLink: url ? `https://mysweethotel.eu/?url=${url}&hotelId=${newHotelId}&hotelName=${hotelNameForUrl}` : `https://mysweethotel.eu/?hotelId=${newHotelId}&hotelName=${hotelNameForUrl}`,
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
                appLink: url ? `https://mysweethotel.eu/?url=${url}&hotelId=${newHotelId}&hotelName=${hotelNameForUrl}` : `https://mysweethotel.eu/?hotelId=${newHotelId}&hotelName=${hotelNameForUrl}`,
            })
        }

    const mailNewSubscriber = functions.httpsCallable("sendNewSubscriber")
    const mailWelcome = functions.httpsCallable("sendWelcomeMail")

    const sendwelcomeMail = (url) => {
        mailNewSubscriber({subscriber: `${formValue.firstName} ${formValue.lastName}`, hotel: formValue.hotelName, standing: formValue.standing, country: "FRANCE", city: formValue.city, capacity: formValue.room})
        if(url){
            return mailWelcome({firstName: formValue.firstName, email: formValue.email, fakeMail: `${formValue.firstName}.${formValue.lastName}${formValue.code_postal}@msh.com`, password: `msh-admin-${formValue.firstName}`, appLink: `https://mysweethotel.eu/?url=${url}&hotelId=${newHotelId}&hotelName=${hotelNameForUrl}`, mshLogo: "https://i.postimg.cc/YqRNzcSJ/msh-new-Logo-transparent.png", mshBanner: "https://i.postimg.cc/h40kFMNY/new-logo-msh.png"})
        }else{
            return mailWelcome({firstName: formValue.firstName, email: formValue.email,fakeMail: `${formValue.firstName}.${formValue.lastName}${formValue.code_postal}@msh.com`, password: `msh-admin-${formValue.firstName}`, appLink: `https://mysweethotel.eu/?hotelId=${newHotelId}&hotelName=${hotelNameForUrl}`, mshLogo: "https://i.postimg.cc/YqRNzcSJ/msh-new-Logo-transparent.png", mshBanner: "https://i.postimg.cc/h40kFMNY/new-logo-msh.png"})
        }
    }
    
    const handleCreateUser = async (newUrl) => {
        setIsLoading(true)
        const authUser = await auth.createUserWithEmailAndPassword(formValue.email.trim(), `msh-admin-${formValue.firstName}`)
        authUser.user.updateProfile({
            displayName: `${formValue.firstName} ${formValue.lastName}`
        })
        sendwelcomeMail(newUrl)
        handleFirestoreNewData(newUrl)
        return setStepThree(false)
      }
    
    const adminMaker = async(url, userId) => {
        return db.collection('businessUsers')
        .doc(userId)
        .set({   
        username: `${formValue.firstName} ${formValue.lastName}`, 
        adminStatus: true, 
        adresse: formValue.adresse,
        email: formValue.email,
        password: `msh-admin-${formValue.firstName}`,
        website: formValue.website,
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
        appLink: url ? `https://mysweethotel.eu/?url=${url}&hotelId=${newHotelId}&hotelName=${hotelNameForUrl}` : `https://mysweethotel.eu/?hotelId=${newHotelId}&hotelName=${hotelNameForUrl}`,
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
            baseURL = reader.result;
            resolve(baseURL);
          };
        });
      };

      const handleFileInputChange = e => {
        const file = e.target.files[0];
    
        getBase64(file)
          .then(result => {
            file["base64"] = result;
            setBaseUrl(result);
          })
          .catch(err => {
            console.log(err);
          });
      };

    return (<div className="register_form_container">
            <div style={{textAlign: "center"}}>
                <div>
                <div className="register_logo_container">
                    <img src="https://i.postimg.cc/h40kFMNY/new-logo-msh.png" className="register_form_logo" />
                </div>
                {finalStep ? <h1 className="form_title"><b>{t("msh_register_form.r_step.s_final.f_title")}</b></h1> : <h1 className="form_title"><b>{t("msh_register_form.r_title")}</b></h1>}
                </div>
                {stepOne && <h3 className="step_title">{t("msh_register_form.r_step.s_first.f_title")}</h3>}
                {stepTwo && <h3 className="step_title">{t("msh_register_form.r_step.s_second.s_title")}</h3>}
                {stepThree && <h3 className="step_title">{t("msh_register_form.r_step.s_third.t_title")}</h3>}
                {stepFour && <h3 className="step_title">{t("msh_register_form.r_step.s_fourth.f_title")}</h3>}
                {finalStep && <h3 className="step_title">{t("msh_register_form.r_step.s_final.f_subtitle.part_one")}<br/>{t("msh_register_form.r_step.s_final.f_subtitle.part_two")}</h3>}
                {finalStep ? <div className="progress_container"><ProgressBar className="progress_bar" now={now} label={`${now}%`} /></div> : <ProgressBar now={now} label={`${now}%`} />}
                
                {stepOne && <form className="stepOne_container" onSubmit={() => {
                        setStepOne(false)
                        setStepTwo(true)
                        setNow(25)
                }}>
                <h5 className="stepOne_title"><b>{t("msh_register_form.r_step.s_first.f_subtitle")}</b></h5>
                <div className="stepOne_form_name_input">
                    <Form.Group controlId="description1">
                    <Form.Control type="text" placeholder={t("msh_register_form.r_step.s_first.f_first_name")} className="stepOne_name_input" value={formValue.firstName} name="firstName" onChange={handleChange} required />
                    </Form.Group>
                
                    <Form.Group controlId="description2">
                    <Form.Control type="text" placeholder={t("msh_register_form.r_step.s_first.f_last_name")} className="stepOne_name_input" value={formValue.lastName} name="lastName" onChange={handleChange} />
                    </Form.Group>
                </div>
                    <Form.Group controlId="description3">
                    <Form.Control type="email" placeholder={t("msh_register_form.r_step.s_first.f_email")} className="stepOne_input" value={formValue.email} name="email" onChange={handleChange} required />
                    </Form.Group>
                <Button variant="success" className="stepOne_validation_button" type="submit">{t("msh_register_form.r_button.b_next")}</Button>
                {alert.danger && <Alert variant="danger" className="stepOne_alert">
                    {t("msh_register_form.r_step.s_first.f_alert")}
                </Alert>}
                </form>}
                {stepTwo && <div className="stepTwo_container">
                        {findHotelForm ? <Button variant="outline-info" className="stepTwo_find_button" onClick={() => setfindHotelForm(false)}>{t("msh_register_form.r_button.b_search")}</Button> : <div className="stepTwo_find_container">
                        <h5 className="stepTwo_title"><b>{t("msh_register_form.r_step.s_second.s_subtitle.s_find")}</b></h5>
                        <div>
                            <Form.Group className="stepTwo_find_input_container">
                            <Input 
                                type="text" 
                                placeholder={t("msh_register_form.r_step.s_second.s_input.i_find_placeholder")} 
                                value={initialFilter} 
                                onChange={handleChangeInitialfilter}
                                className="text-center stepTwo_find_input"
                                pattern=".{5,}" />
                            </Form.Group>
                        </div>

                        <div>
                            <Form.Group className="stepTwo_find_dropdown_container">
                            <DropdownButton style={{display: typeof window && window.innerWidth < 768 ? "none" : "flex"}} id="dropdown-basic-button" title={t("msh_register_form.r_button.b_find")} drop="down" variant="dark" onClick={() => setFilter(initialFilter)}>
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
                            </DropdownButton>  
                            <Button variant="dark" style={{display: typeof window && window.innerWidth > 768 ? "none" : "flex"}} className="stepTwo_find_dropdown_container" onClick={() => {
                                setFilter(initialFilter)
                                return setShowFindHotelDrawer(true)
                                }}>{t("msh_register_form.r_button.b_find")}</Button>
                            </Form.Group>
                        </div>
                        <div className="stepTwo_hotel_name_container"><b>{formValue.hotelName && formValue.hotelName}</b></div>
                        </div>}
                        <div className="stepTwo_separation">{t("msh_register_form.r_or")}</div>
                    {findHotelForm ? <div className="stepTwo_create_hotel_container">
                        <h5 style={{marginBottom: "3vh"}}><b>{t("msh_register_form.r_step.s_second.s_subtitle.s_create")}</b></h5>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" style={{ marginBottom: "1vh"}} value={formValue.hotelName} name="hotelName" type="text" placeholder={t("msh_register_form.r_step.s_second.s_input.i_hote_name")} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" style={{ marginBottom: "1vh"}} value={formValue.region} name="region" type="text" placeholder={t("msh_register_form.r_step.s_second.s_input.i_region")} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" style={{ marginBottom: "1vh"}} value={formValue.departement} name="departement" type="text" placeholder={t("msh_register_form.r_step.s_second.s_input.i_district")} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" style={{ marginBottom: "1vh"}} value={formValue.city} name="city" type="text" placeholder={t("msh_register_form.r_step.s_second.s_input.i_city")} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" style={{ marginBottom: "1vh"}} value={formValue.code_postal} name="code_postal" type="text" placeholder={t("msh_register_form.r_step.s_second.s_input.i_code_postal")} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" style={{ marginBottom: "1vh"}} value={formValue.standing} name="standing" type="number" placeholder={t("msh_register_form.r_step.s_second.s_input.i_standing")} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" style={{ marginBottom: "1vh"}} value={formValue.room} name="room" type="number" placeholder={t("msh_register_form.r_step.s_second.s_input.i_capacity")} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" style={{ marginBottom: "1vh"}} value={formValue.adresse} name="adresse" type="text" placeholder={t("msh_register_form.r_step.s_second.s_input.i_address")} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" style={{ marginBottom: "1vh"}} value={formValue.phone} name="phone" type="text" placeholder={t("msh_register_form.r_step.s_second.s_input.i_phone")} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.website} name="website" type="text" placeholder={t("msh_register_form.r_step.s_second.s_input.i_web")} onChange={handleChange} required />
                        </Form.Group>
                    </div> : <Button variant="outline-dark" style={{marginTop: "3vh"}} onClick={() => {
                        if(typeof window && window.innerWidth > 768) {
                            setfindHotelForm(true)
                        }else{
                            setShowCreateHotelDrawer(true)
                        }
                        
                        }}>{t("msh_register_form.r_button.b_create")}</Button>}
                    <div className="stepTwo_button_container">
                            <Button variant="outline-info" onClick={() => {
                                setStepTwo(false)
                                setStepOne(true)
                                setNow(0)
                            }} className="stepTwo_button">{t("msh_register_form.r_button.b_back")}</Button>
                            <Button variant="success" onClick={() => {
                                if(isRegistrated) {
                                    setAlert({
                                        danger: true,
                                        message: t("msh_register_form.r_step.s_second.s_alert.a_isRegitrated")
                                    })
                                }else{
                                    if(formValue.region === "" || formValue.hotelName === "" || formValue.departement === "" || formValue.city === "" || formValue.code_postal === "" || formValue.standing === "" || formValue.room === null || formValue.adresse === "" || formValue.phone === "" || formValue.website === ""){
                                        setAlert({
                                            danger: true,
                                            message: t("msh_register_form.r_step.s_second.s_alert.a_action_required")
                                        })  
                                    }else{
                                        setStepTwo(false)
                                        setStepThree(true)
                                        setNow(50)
                                    }
                                }
                            }} className="stepTwo_button">{t("msh_register_form.r_button.b_next")}</Button>
                        </div>
                        {alert.danger && <div>
                            <Alert variant="danger" className="stepThree_alert">
                                {alert.message}
                            </Alert>
                            {isRegistrated && <a href="https://mysweethotel.com/" style={{fontSize: "1.5em", color: "black"}}><b>{t("msh_register_form.r_step.s_final.f_message.hidden_paragraph")}</b></a>}
                        </div>}
                </div>}
                {stepThree && <div>
                    <h5 className="stepThree_title"><b>{t("msh_register_form.r_step.s_third.t_subtitle")}</b></h5>
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
                        setIsLoading(false)
                        }}>{t("msh_register_form.r_step.s_third.t_skip_button")}</Button>
                    <div className="stepThree_button_container">
                            <Button variant="outline-info" onClick={() => {
                                setStepThree(false)
                                setStepTwo(true)
                                setNow(25)
                            }} className="stepThree_button">{t("msh_register_form.r_button.b_back")}</Button>
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
                            }}>{t("msh_register_form.r_button.b_next")}</Button>
                        </div>
                        {alert.success && <Alert variant="success" className="stepThree_alert">
                            {t("msh_register_form.r_step.s_third.t_alert.a_success")}
                        </Alert>}
                        {alert.danger && <Alert variant="danger" className="stepThree_alert">
                        {t("msh_register_form.r_step.s_third.t_alert.a_danger")}
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
                        }}>{t("msh_register_form.r_step.s_fourth.f_step_back_button")}</Button>
                    </div>
                    <Divider className="stepFour_divider" />
                    <div className="stepFour_hotel_data_container">
                        <h4 className="stepFour_hotel_data_title"><b>{t("msh_register_form.r_step.s_fourth.f_section.s_first.f_title")}</b></h4>
                        <div>
                            <p><b>{t("msh_register_form.r_step.s_fourth.f_section.s_first.f_name")}:</b> {formValue.hotelName}</p>
                            <p><b>{t("msh_register_form.r_step.s_fourth.f_section.s_first.f_address")}:</b> {formValue.adresse}</p>
                            <p><b>{t("msh_register_form.r_step.s_fourth.f_section.s_first.f_city")}:</b> {formValue.city}</p>
                            <p><b>{t("msh_register_form.r_step.s_fourth.f_section.s_first.f_district")}:</b> {formValue.departement}</p>
                            <p><b>{t("msh_register_form.r_step.s_fourth.f_section.s_first.f_region")}:</b> {formValue.region}</p>
                            <p><b>{t("msh_register_form.r_step.s_fourth.f_section.s_first.f_code_postal")}:</b> {formValue.code_postal}</p>
                            <p><b>{t("msh_register_form.r_step.s_fourth.f_section.s_first.f_standing.s_label")}:</b> {formValue.standing} {t("msh_register_form.r_step.s_fourth.f_section.s_first.f_standing.s_suffix")}</p>
                            <p><b>{t("msh_register_form.r_step.s_fourth.f_section.s_first.f_capacity.c_label")}:</b> {formValue.room} {t("msh_register_form.r_step.s_fourth.f_section.s_first.f_capacity.c_suffix")}</p>
                            {formValue.website && <p><b>{t("msh_register_form.r_step.s_second.s_input.i_web")}:</b> {formValue.website}</p>}
                        </div>
                        <Button variant="outline-info" size="sm" onClick={() => {
                            setStepFour(false)
                            setStepTwo(true)
                            setNow(25)
                        }}>{t("msh_register_form.r_step.s_fourth.f_step_back_button")}</Button>
                    </div>
                    <Divider className="stepFour_divider" />
                    <div className="stepFour_manager_data_container">
                        <h4 className="stepFour_manager_data_title"><b>{t("msh_register_form.r_step.s_fourth.f_section.s_second.s_title")}</b></h4>
                        <p><b>{t("msh_register_form.r_step.s_fourth.f_section.s_second.s_name")}: </b>{formValue.firstName} {formValue.lastName}</p>
                        <p><b>{t("msh_register_form.r_step.s_fourth.f_section.s_second.s_email")}:</b> {formValue.email}</p>
                        <Button variant="outline-info" size="sm" onClick={() => {
                            setStepFour(false)
                            setStepOne(true)
                            setNow(0)
                        }}>{t("msh_register_form.r_step.s_fourth.f_step_back_button")}</Button>
                    </div>
                    {isLoading ? <Spinner animation="grow" /> : <Button variant="success" className="stepFour_button" onClick={() => {
                            if(formValue.region !== "" || formValue.hotelName !== "" || formValue.departement !== "" || formValue.city !== "" || formValue.code_postal !== "" || formValue.standing !== "" || formValue.room === null || formValue.adresse !== "" || formValue.phone !== "" || formValue.website !== ""){
                                handleCreateUser(data && data.link)
                                setStepFour(false)
                                setNow(100)
                                return setFinalStep(true)
                            }else{
                                setAlert({danger: true, message: t("msh_register_form.r_step.s_fourth.f_alert")})
                                setTimeout(() => {
                                    setAlert({danger: false, message: ""})
                                }, 5000);
                            }
                        }}>{t("msh_register_form.r_button.b_validation_form")}</Button>}
                        {alert.danger && <Alert variant="danger" className="stepThree_alert">
                            {alert.message}
                        </Alert>}
                </div>
                }
                {finalStep && 
                <div className="finalStep_container">
                    <div className="finalStep_greeting_message_container" style={{marginTop: "5vh"}}>
                        <p><b>{t("msh_register_form.r_step.s_final.f_message.first_paragraph")}</b></p>
                        <p>{t("msh_register_form.r_step.s_final.f_message.second_paragraph")}</p>
                        <p>{t("msh_register_form.r_step.s_final.f_message.third_paragraph.part_one")}<br/>
                        {t("msh_register_form.r_step.s_final.f_message.third_paragraph.part_two")} <img src={Fom} alt="Fom" style={{width: "5%", marginLeft: "1vw", marginRight: "1vw", filter: "drop-shadow(1px 1px 1px)"}} /> {t("msh_register_form.r_step.s_final.f_message.third_paragraph.part_three")}<br/></p>
                        {/*!url && <p><b>{t("msh_register_form.r_step.s_final.f_message.fourth_paragraph")}</b></p>*/}
                        <p>{t("msh_register_form.r_step.s_final.f_message.fourth_paragraph")}</p>
                    </div>
                    <a href="https://mysweethotel.com/" target="_blank" style={{
                        display: 'flex',
                        flexFlow: "column",
                        alignItems: "center",
                        cursor: "pointer", 
                        color: "black"
                    }}>
                        <img src={Home} style={{width: "10%", marginTop: "5vh", marginBottom: "1vh"}} />
                        <b>{t("msh_register_form.r_step.s_final.f_message.hidden_paragraph")}</b>
                    </a >
               </div> }
               <Modal show={showModal} centered size="lg" onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                    <Modal.Title>{t("msh_register_form.r_step.s_third.t_modal.m_title")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="finalStep_modal">{newImg && newImg.name}</Modal.Body>
                    <Modal.Footer>
                    <Button variant="outline-dark" onClick={() => {
                        setNewImg(null)
                        setShowModal(false)}}>
                        {t("msh_register_form.r_step.s_third.t_modal.m_button.b_no")}
                    </Button>
                    <Button variant="dark" onClick={handleUploadLogo}>
                        {t("msh_register_form.r_step.s_third.t_modal.m_button.b_yes")}
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
                        <h5 style={{textAlign: "center", paddingTop: "2vh"}}><b>{t("msh_register_form.r_step.s_second.s_drawer_list_hotel")}</b></h5>
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
                            <b>{t("msh_register_form.r_step.s_second.s_subtitle.s_create")}</b>
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
                            <Form.Control className="stepTwo_create_form_input" value={formValue.hotelName} name="hotelName" type="text" placeholder={t("msh_register_form.r_step.s_second.s_input.i_hote_name")} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.region} name="region" type="text" placeholder={t("msh_register_form.r_step.s_second.s_input.i_region")} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.departement} name="departement" type="text" placeholder={t("msh_register_form.r_step.s_second.s_input.i_district")} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.city} name="city" type="text" placeholder={t("msh_register_form.r_step.s_second.s_input.i_city")} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.code_postal} name="code_postal" type="text" placeholder={t("msh_register_form.r_step.s_second.s_input.i_code_postal")} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.standing} name="standing" type="number" placeholder={t("msh_register_form.r_step.s_second.s_input.i_standing")} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.room} name="room" type="number" placeholder={t("msh_register_form.r_step.s_second.s_input.i_capacity")} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.adresse} name="adresse" type="text" placeholder={t("msh_register_form.r_step.s_second.s_input.i_address")} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.phone} name="phone" type="text" placeholder={t("msh_register_form.r_step.s_second.s_input.i_phone")} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="formGroupName">
                            <Form.Control className="stepTwo_create_form_input" value={formValue.website} name="website" type="text" placeholder={t("msh_register_form.r_step.s_second.s_input.i_web")} onChange={handleChange} required />
                        </Form.Group>
                        <Button variant="success" style={{position: "fixed", bottom: "0", left: "0", width: "100%", borderRadius: "0"}} onClick={() => {
                            setShowCreateHotelDrawer(false)
                        }}>{t("msh_register_form.r_button.b_phone_validation")}</Button>            
                </form>
            </Drawer>
            </div>
        </div>
    )
}
