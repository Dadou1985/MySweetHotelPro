import React, { useContext } from "react"
import PhoneAdmin from '../components/section/form/phoneForm/phoneAdmin'
import {FirebaseContext} from '../Firebase'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'

function AdminBoard() {
    const { userDB, user } = useContext(FirebaseContext)

    return (
       <> 
        <div className="landscape-display"></div>
        {!!user && !!userDB &&
        <Navigation user={user} userDB={userDB} />}    
        {!!user && !!userDB &&
        <PhoneAdmin user={user} userDB={userDB} />}
    </>
    )
}

export default withTrans(AdminBoard)
