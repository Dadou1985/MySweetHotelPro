import React, { useState } from 'react'
import { auth, db, functions } from '../../../Firebase'
import { useTranslation } from "react-i18next"
import { withTrans } from '../../../../i18n/withTrans'
import { handleChange } from '../../../helper/formCommonFunctions'
import { Button } from 'react-bootstrap'
import { sha256 } from 'js-sha256'

const RegisterForm = (handleClose) => {

  const [formValue, setFormValue] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    //confPassword: "",
    region: "Heaven", 
    departement: "Paradise", 
    city: "City of Angels", 
    standing: "5 étoiles", 
    phone: "", 
    room: "150", 
    code_postal: "100000", 
    adresse: "1 rue du paradis", 
    website: "https://www.plazahotel.com", 
    hotelName: "Plaza Hotel", 
})
  const { t } = useTranslation()

  const newHotelId = "mshPro" + Date.now() + sha256(formValue.hotelName)
  const hotelNameForUrl = formValue.hotelName && formValue.hotelName.replace(/ /g,'%20')
  const isBrowser = typeof window !== 'undefined'

  const mailNewSubscriber = isBrowser && functions ? functions.httpsCallable("sendNewSubscriber") : null
  const mailWelcome = isBrowser && functions ? functions.httpsCallable("sendWelcomeMail") : null

  const createHotel = async () => {
    try {
      await db.collection("hotels")
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
        phone: "0139548796",
        mail: "contact@plazahotel.com",
        markup: Date.now(),
        partnership: true,
        country: "FRANCE",
        pricingModel: "Premium",
        logo: null,
        base64Url: null,
        appLink: `https://mysweethotel.eu/?hotelId=${newHotelId}&hotelName=${hotelNameForUrl}`,
        hotelTest: true
      })
      return console.log("New test hotel creation: accomplished")
    } catch (e) {
      console.log("New test hotel creation: accomplished")
      throw new Error(e);
    }
  }

  const sendwelcomeMail = () => {
    try {
      if (!mailNewSubscriber || !mailWelcome) return null
    
      mailNewSubscriber({
        subscriber: `${formValue.firstName} ${formValue.lastName}`, 
        hotel: formValue.hotelName, 
        standing: formValue.standing, 
        country: "FRANCE", 
        city: formValue.city, capacity: formValue.room
      })
      
      mailWelcome({
        firstName: formValue.firstName, 
        email: formValue.email,
        password: `msh-pass-${formValue.firstName}`, 
        appLink: `https://mysweethotel.eu/?hotelId=${newHotelId}&hotelName=${hotelNameForUrl}`, 
        mshLogo: "https://i.postimg.cc/YqRNzcSJ/msh-new-Logo-transparent.png", 
        mshBanner: "https://i.postimg.cc/h40kFMNY/new-logo-msh.png",
        isTester: true
      })
      return console.log("Send registration emails: accomplished")
    } catch (e) {
      console.log("Send registration emails: failed")
      throw new Error(e)
    }
  }

  const adminMaker = async(userId) => {
    try {
      await db.collection('businessUsers')
      .doc(userId)
      .set({   
      username: `${formValue.firstName} ${formValue.lastName}`, 
      adminStatus: true, 
      adresse: formValue.adresse,
      email: formValue.email,
      password: sha256(`msh-pass-${formValue.firstName}`),
      website: formValue.website,
      hotelId: newHotelId,
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
      logo: null,
      base64Url: null,
      appLink: `https://mysweethotel.eu/?hotelId=${newHotelId}&hotelName=${hotelNameForUrl}`,
      pricingModel: "Premium",
      tester: true
      }) 
      return console.log("Registration in business users collection: accomplished")
    } catch (e) {
      console.log("Registration in business users collection: failed")
      throw new Error(e)
    }
  }

  const freeRegister = async (userId) => {
    try {
      await db.collection('guestUsers')
      .doc(userId)
      .set({
        username: `${formValue.firstName} ${formValue.lastName}`,
        email: formValue.email.trim(),
        password: sha256(`msh-pass-${formValue.firstName}`),
        language: "fr",
        lastTimeConnected: Date.now(),
        userId: userId,
        localLanguage: "fr",
        checkoutDate: "",
        gender: "universal",
        guestCategory: t("tourisme"),
        guestCategoryClone: t("tourisme"),
        notificationStatus: "default",
        photo: null
      })  
      return console.log("Registration in guest users collection: accomplished")
    }catch (e) {
      console.log("Registration in guest users collection: failed")
      throw new Error(e)
    }
  }

  const handleFirestoreNewData = async () => {
    try {
      auth.onAuthStateChanged((user) => {
        if(user) {
          adminMaker(user.uid).then(() => {
            freeRegister(user.uid)
            createHotel()
          })
        }
      })
      return console.log("All registration in database: accomplised")
    } catch (e) {
      console.log("All registration in database: accomplised")
      throw new Error(e);
    }
  }
  
  const handleCreateUser = async () => {
    try {
      const authUser = await auth.createUserWithEmailAndPassword(formValue.email.trim(), `msh-pass-${formValue.firstName}`)
      authUser.user.updateProfile({
        displayName: `${formValue.firstName} ${formValue.lastName}`
      })
      handleFirestoreNewData()
      return sendwelcomeMail()
    } catch (e) {
      throw new Error(e);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handleCreateUser()
    return handleClose()
  }   
    
  return (
    <div className="">
        <form 
          method="post"
          className="text-center p-5"
          onSubmit={(event) => handleSubmit(event)}>  

            <div style={{display: "flex", justifyContent: "space-between"}}>
              <input 
                  data-testid="firstName"
                  style={{zIndex: "1000", width: "49%"}}
                  value={formValue.firstName}
                  name="firstName" 
                  className="form-control mb-4" 
                  placeholder={t('msh_connexion.c_first_Name')}
                  onChange={(event) => handleChange(event, setFormValue)}
                  required />

                <input 
                  data-testid="lastName"
                  style={{zIndex: "1000", width: "49%"}}
                  value={formValue.lastName}
                  name="lastName" 
                  className="form-control mb-4" 
                  placeholder={t('msh_connexion.c_flast_Name')}
                  onChange={(event) => handleChange(event, setFormValue)}
                  required />
            </div>

            <input 
                data-testid="email"
                value={formValue.email}
                type="email" 
                name="email" 
                className="form-control mb-4" 
                placeholder={t("msh_connexion.c_email_maj")}
                onChange={(event) => handleChange(event, setFormValue)}
                required />

            <div data-testid="warning" id="warning"></div>

            <div style={{display: "flex", flexDirection: "column"}}>
                <Button className='btn btn-msh' type="submit">{t("msh_general.g_button.b_send")}</Button>
            </div>
        </form>
    </div>
  )
}

export default withTrans(RegisterForm)