import React, { useContext } from "react"
import {FirebaseContext} from '../config/Firebase'
import LostNFound from '../components/lostAndFound/lostNFound'
import { withTrans } from '../../i18n/withTrans'
import Sidebar from "../components/section/sidebar/sidebar"

const Lost = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>   
         <div style={{
            display: "flex"
          }}>
          <Sidebar />
          {!!user && !!userDB &&
          <LostNFound />}
        </div>
    </>
  )
}

export default withTrans(Lost)