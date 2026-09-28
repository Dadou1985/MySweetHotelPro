import React, { useContext } from 'react'
import Cab from '../../../../../assets/svg/taxi.svg'
import Clock from '../../../../../assets/svg/timer.svg'
import Maintenance from '../../../../../assets/svg/repair.svg'
import Chat from '../../../../../assets/svg/chat.png'
import RoomChange from '../../../../../assets/svg/logout.svg'

import { FirebaseContext } from '../../../../../config/Firebase'
import { navigate } from 'gatsby'
import { useFirestoreSubscription } from '../../../../../utils/hooks/useFirestore'

function Generic({category, index}) {
    const { userDB } = useContext(FirebaseContext)
    const imgSrc = [Cab, Clock, Maintenance, Chat, RoomChange]

    const { data: quantity = [] } = useFirestoreSubscription(
        ['hotels', userDB.hotelId, category],
        { where: ['status', '==', true] }
    )

    return (
        <div>
            <img src={imgSrc[index]} alt={category} className="drawer_icons" onClick={()=>{navigate(`/mobile/${category}`)}} />
            {quantity.length > 0 && <span style={{
              borderRadius: "100%", 
              backgroundColor: "red", 
              position: "absolute", 
              width: "1rem",
              marginLeft: "1vw", 
              color: "white", 
              textAlign: "center", 
              fontSize: "12px"}}>{quantity.length}</span>}
        </div>
    )
}

export default Generic
