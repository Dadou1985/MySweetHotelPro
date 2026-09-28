import React, { useContext } from "react"
import MobileMagic from '../../components/section/sidebar/mobile/magic.mobile'
import {FirebaseContext, db, auth} from '../../config/Firebase'
import { withTrans } from '../../../i18n/withTrans'

function SuperAdminBoard() {
    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

    return (
       <> 
        <div className="landscape-display"></div>   
        {!!user && !!userDB &&
        <MobileMagic user={user} userDB={userDB} />}
    </>
    )
}

export default withTrans(SuperAdminBoard)
