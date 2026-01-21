import React, { useContext } from "react"
import {FirebaseContext} from '../Firebase'
import GuestDatabase from '../components/section/guestDatabase'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'
import ToolBar from "../components/section/toolbar"

const UserDatabase = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>
        {!!user && !!userDB &&
        <Navigation user={user} userDB={userDB} />}    
        <div style={{
            display: "flex"
          }}>
          <ToolBar />
          {!!user && !!userDB &&
          <GuestDatabase user={user} userDB={userDB} />}
        </div>
    </>
  )
}

export default withTrans(UserDatabase)