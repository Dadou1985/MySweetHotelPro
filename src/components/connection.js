import React, { useState } from 'react'
import { auth } from '../Firebase'
import { navigate } from 'gatsby'
import Logo from '../svg/new-logo-msh.png'
import { useTranslation } from "react-i18next"
import { withTrans } from '../../i18n/withTrans'
import './css/section/connection.css'

const Connection = () => {

  const [formValue, setFormValue] = useState ({username: "", email: "", password: ""})
     
  const { t } = useTranslation()

      const handleChange = (event) =>{
        event.persist()
        document.getElementById('warning').innerHTML = ""
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

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
            <div id="jumbo" fluid className="bg-light">
            <img src={Logo} className="connection-logo" />
            </div>
            <form 
              method="post"
              className="text-center p-5"
              onSubmit={(event) => handleSubmit(event)}>  

            <input 
                style={{zIndex: "1000"}}
                value={formValue.email}
                type="email" 
                name="email" 
                className="form-control mb-4" 
                placeholder={t('msh_connexion.c_email_maj')}
                onChange={handleChange}
                required />

            <input 
                value={formValue.password}
                type="password" 
                name="password" 
                className="form-control mb-4" 
                placeholder={t("msh_connexion.c_password")}
                onChange={handleChange}
                required />

            <div id="warning"></div>

            <button className="btn btn-success btn-block my-4" type="submit">{t("msh_connexion.c_connexion")}</button>
            </form>
        </div>
    )
}

export default withTrans(Connection)