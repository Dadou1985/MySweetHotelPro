import React, {useContext} from 'react'
import Notifications from './notifications'
import { FirebaseContext } from '../../Firebase'
import '../css/section/footer.css'

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