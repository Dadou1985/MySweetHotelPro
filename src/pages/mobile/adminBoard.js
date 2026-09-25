import React, { useContext } from "react"
import MobileAdminBoard from '../../components/profile/admin/phoneAdmin'
import { FirebaseContext } from '../../config/Firebase'
import { withTrans } from '../../../i18n/withTrans'

function AdminBoard() {
    const { userDB, user } = useContext(FirebaseContext)

    return (
       <> 
        <div className="landscape-display"></div>   
        {!!user && !!userDB &&
        <MobileAdminBoard />}
    </>
    )
}

export default withTrans(AdminBoard)
