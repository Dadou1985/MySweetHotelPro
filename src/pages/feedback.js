import React, { useContext } from "react"
import {FirebaseContext} from '../Firebase'
import PhoneFeedback from '../components/section/form/phoneForm/phoneFeedback'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'

const Feedback = () => {
    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

    return (
        <> 
        <div className="landscape-display"></div>
            {!!user && !!userDB &&
            <Navigation user={user} userDB={userDB} />}     
        {!!user && !!userDB &&
        <PhoneFeedback user={user} userDB={userDB} />}
    </>
    )
}

export default withTrans(Feedback)
