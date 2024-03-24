import React, { useState } from 'react'
import { auth } from '../Firebase'
import { navigate } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import { useTranslation } from "react-i18next"
import { withTrans } from '../../i18n/withTrans'
import { handleChange } from '../helper/formCommonFunctions'
import './css/section/connection.css'

const Connection = () => {

  const [formValue, setFormValue] = useState ({username: "", email: "", password: ""})
  const { t } = useTranslation()

  const handleSubmit = (event) => {
    event.preventDefault()
    auth.signInWithEmailAndPassword(formValue.email, formValue.password)
    .then(async(authUser) => {
      await authUser.user.updateProfile({ displayName: formValue.username})
      return navigate('singlePage')})
    .catch(error=>{
      if (error.message !== ""){
        return document.getElementById('warning').innerHTML = t("msh_connexion.c_warning")
      }else{}
    })
  }   
    
  return (
    <div className="connection_container">
        <div id="jumbo" className="bg-light">
        <StaticImage objectFit='contain' src="../svg/new-logo-msh.png" placeholder="blurred" className="connection-logo" alt="Logo" />
        </div>
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

        <button data-testid="connexion" style={{borderRadius: "100px",
    padding: "10px 30px"}} className="btn btn-success btn-block my-4" type="submit">{t("msh_connexion.c_connexion")}</button>
        </form>
    </div>
  )
}

export default withTrans(Connection)