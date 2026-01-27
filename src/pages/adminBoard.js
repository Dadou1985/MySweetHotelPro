import React, { useContext } from "react"
import PhoneAdmin from '../components/section/form/phoneForm/phoneAdmin'
import {FirebaseContext} from '../Firebase'
import { withTrans } from '../../i18n/withTrans'

function AdminBoard() {
    const { userDB, user } = useContext(FirebaseContext)

    return (
       <> 
        <div className="landscape-display"></div>   
        {!!user && !!userDB &&
        <PhoneAdmin user={user} userDB={userDB} />}
    </>
    )
}

export default withTrans(AdminBoard)
