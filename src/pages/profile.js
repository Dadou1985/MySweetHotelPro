import React, { useContext } from "react"
import Profile from '../components/profile/profile'
import {FirebaseContext} from '../config/Firebase'
import { ShortenUrlProvider } from 'react-shorten-url';
import { withTrans } from '../../i18n/withTrans'

const Profile = () => {
    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)
  
    return (
        <>
            <div className="landscape-display"></div>
            {!!user && userDB && !!setUserDB &&
              <ShortenUrlProvider config={{ accessToken: '4414aed1636f8815449ff0a59d1b67a513dfc0d1' }}>
                <Profile />
              </ShortenUrlProvider>}
        </>
    )
}

export default withTrans(Profile)