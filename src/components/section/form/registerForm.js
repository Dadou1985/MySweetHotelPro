import React, { useState } from 'react'
import { auth, db, functions } from '../../../Firebase'
import { navigate } from 'gatsby'
import { useTranslation } from "react-i18next"
import { withTrans } from '../../../../i18n/withTrans'
import { handleChange } from '../../../helper/formCommonFunctions'
import { Button } from 'react-bootstrap'
import { sha256 } from 'js-sha256'
import {
    fetchCollectionBySorting2, 
    handleSubmitData2, 
    addNotification, 
    handleDeleteData2 
} from '../../../helper/globalCommonFunctions'

const RegisterForm = () => {

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
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

  let newHotelId = "mshPro" + Date.now() + sha256(formValue.hotelName)
  let hotelNameForUrl = formValue.hotelName && formValue.hotelName.replace(/ /g,'%20')
  const isBrowser = typeof window !== 'undefined'

  const createHotel = () => {
    return db.collection("hotels")
    .doc(newHotelId)
    .set({
      hotelName: "Plaza Hotel",
      adresse: "1 rue du paradis",
      classement: `5 étoiles`,
      departement: "Paradise",
      region: "Heaven",
      city: "City of Angels",
      code_postal: "10000",
      room: "150",
      website: "https://www.plazahotel.com",
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
  }

  const mailNewSubscriber = isBrowser && functions ? functions.httpsCallable("sendNewSubscriber") : null
  const mailWelcome = isBrowser && functions ? functions.httpsCallable("sendWelcomeMail") : null

  const sendwelcomeMail = () => {
    if (!mailNewSubscriber || !mailWelcome) return null
    mailNewSubscriber({subscriber: `${firstName} ${lastName}`, hotel: formValue.hotelName, standing: formValue.standing, country: "FRANCE", city: formValue.city, capacity: formValue.room})
    return mailWelcome({firstName: formValue.firstName, email: formValue.email,fakeMail: `${formValue.firstName}.${formValue.lastName}${formValue.code_postal}@msh.com`, password: `msh-admin-${formValue.firstName}`, appLink: `https://mysweethotel.eu/?hotelId=${newHotelId}&hotelName=${hotelNameForUrl}`, mshLogo: "https://i.postimg.cc/YqRNzcSJ/msh-new-Logo-transparent.png", mshBanner: "https://i.postimg.cc/h40kFMNY/new-logo-msh.png"})
  }
  
  const handleCreateUser = async (newUrl) => {
      setIsLoading(true)
      const authUser = await auth.createUserWithEmailAndPassword(formValue.email.trim(), `msh-admin-${firstName}`)
      authUser.user.updateProfile({
          displayName: `${firstName} ${lastName}`
      })
      sendwelcomeMail(newUrl)
      return handleFirestoreNewData(newUrl)
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
      logo: url ? url : null,
      base64Url: null,
      appLink: `https://mysweethotel.eu/?hotelId=${newHotelId}&hotelName=${hotelNameForUrl}`,
      pricingModel: "Premium",
      tester: true
      }) 
  }

  const handleFirestoreNewData = (shortenUrl) => {
    console.log("SHORTENURL", shortenUrl)
    return auth.onAuthStateChanged((user) => {
        if(user) {
          adminMaker(shortenUrl, user.uid).then(() => {
            createHotel(shortenUrl)
          })
        }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    return
  }   
    
  return (
    <div className="">
        <form 
          method="post"
          className="text-center p-5"
          onSubmit={(event) => handleSubmit(event)}>  

            <input 
                data-testid="email"
                style={{zIndex: "1000"}}
                value={formValue.email}
                type="email" 
                name="email" 
                className="form-control mb-4" 
                placeholder={t('msh_connexion.c_email_maj')}
                onChange={(event) => handleChange(event, setFormValue)}
                required />

            <input 
                data-testid="password"
                value={formValue.password}
                type="password" 
                name="password" 
                className="form-control mb-4" 
                placeholder={t("msh_connexion.c_password")}
                onChange={(event) => handleChange(event, setFormValue)}
                required />

            <div data-testid="warning" id="warning"></div>

            <div style={{display: "flex", flexDirection: "column"}}>
                <Button variant="dark" onClick={(event) => {
                    return
                }}>{t("msh_general.g_button.b_send")}</Button>
            </div>
        </form>
    </div>
  )
}

export default withTrans(RegisterForm)