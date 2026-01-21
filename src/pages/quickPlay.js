import React, { useContext } from "react"
import PhoneMagic from '../components/section/form/phoneForm/phoneMagic'
import {FirebaseContext, db, auth} from '../Firebase'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'

function MagicBox() {
    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

    return (
       <> 
        <div className="landscape-display"></div>
        {!!user && !!userDB &&
        <Navigation user={user} userDB={userDB} />}    
        {!!user && !!userDB &&
        <PhoneMagic user={user} userDB={userDB} />}
    </>
    )
}

export default withTrans(MagicBox)
