import React, { useContext } from 'react'
import Assistance from '../../../../../assets/svg/support-technique.svg'
import { FirebaseContext } from '../../../../../config/Firebase'
import { navigate } from 'gatsby'
import Bubble from "../../../../../assets/svg/bubble.svg"
import { StaticImage } from 'gatsby-plugin-image'
import { useFirestoreSubscription, useUpdate } from '../../../../../utils/hooks/useFirestore'

function CallCenter() {
    const { userDB } = useContext(FirebaseContext)
    const { data: chatRoomQty = [] } = useFirestoreSubscription(
        ['assistance'],
        { where: ['hotelId', '==', '06nOvemBre198524SEptEMbrE201211noVEMbre20171633323179047'] }
    )

    const { mutate: updateAssistance } = useUpdate()

    return (
        <div>
          <img src={Assistance} alt="Support" className="drawer_icons" onClick={()=>{
            updateAssistance({ path: ['assistance', userDB.hotelName], data: { adminSpeak: false } })
            navigate("/mobile/assistance")
            }} />
            {chatRoomQty.map(status => {
                  if(status.adminSpeak) {
                    return <StaticImage objectFit='contain' src="../../../../../svg/bubble.svg" style={{
                      borderRadius: "50%",
                      backgroundColor: "magenta",
                      position: "absolute",
                      width: "17%",
                      height: "6%",
                      color: "white",
                      textAlign: "center",
                      fontSize: "12px"}} />
                  } else { return <></> }
                })}
        </div>
    )
}

export default CallCenter
