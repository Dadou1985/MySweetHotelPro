import React, {useContext} from 'react'
import Notifications from './notifications'
import { FirebaseContext, db, auth } from '../../Firebase'

const Footer = () =>{
    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

    return(
        <div className="footer_container">
            {!!userDB && !!setUserDB && !!user && !!setUser &&
            <Notifications userDB={userDB} setUserDB={setUserDB} />}
        </div>
    )
}

export default Footer