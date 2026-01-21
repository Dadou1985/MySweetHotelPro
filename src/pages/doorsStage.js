import React, { useContext } from "react"
import Dilema from '../components/section/dilema'
import {FirebaseContext} from '../Firebase'
import Navigation from '../components/section/navigation'
import { ShortenUrlProvider } from 'react-shorten-url';
import { withTrans } from '../../i18n/withTrans'

const DoorsStage = () => {
    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)
  
    return (
        <>
            <div className="landscape-display"></div>
            {!!user && !!userDB &&
            <Navigation user={user} userDB={userDB} />}
            {!!user && userDB && !!setUserDB &&
              <ShortenUrlProvider config={{ accessToken: '4414aed1636f8815449ff0a59d1b67a513dfc0d1' }}>
                <Dilema user={user} userDB={userDB} setUserDB={setUserDB} />
              </ShortenUrlProvider>}
        </>
    )
}

export default withTrans(DoorsStage)