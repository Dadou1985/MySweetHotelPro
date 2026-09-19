import React, { useContext } from 'react'
import Maid from '../../../../../assets/svg/maid.svg'
import { navigate } from 'gatsby'
import { FirebaseContext } from '../../../../../config/Firebase'
import { useFirestoreSubscription } from '../../../../../utils/hooks/useFirestore'

function HousekeepingOverlay() {
    const { userDB } = useContext(FirebaseContext)

    const { data: towel = [] }       = useFirestoreSubscription(['hotels', userDB.hotelId, 'housekeeping', 'item', 'towel'],       { orderBy: ['markup', 'asc'] })
    const { data: soap = [] }        = useFirestoreSubscription(['hotels', userDB.hotelId, 'housekeeping', 'item', 'soap'],        { orderBy: ['markup', 'asc'] })
    const { data: toiletPaper = [] } = useFirestoreSubscription(['hotels', userDB.hotelId, 'housekeeping', 'item', 'toiletPaper'], { orderBy: ['markup', 'asc'] })
    const { data: hairDryer = [] }   = useFirestoreSubscription(['hotels', userDB.hotelId, 'housekeeping', 'item', 'hairDryer'],   { orderBy: ['markup', 'asc'] })
    const { data: pillow = [] }      = useFirestoreSubscription(['hotels', userDB.hotelId, 'housekeeping', 'item', 'pillow'],      { orderBy: ['markup', 'asc'] })
    const { data: blanket = [] }     = useFirestoreSubscription(['hotels', userDB.hotelId, 'housekeeping', 'item', 'blanket'],     { orderBy: ['markup', 'asc'] })
    const { data: iron = [] }        = useFirestoreSubscription(['hotels', userDB.hotelId, 'housekeeping', 'item', 'iron'],        { orderBy: ['markup', 'asc'] })
    const { data: babyBed = [] }     = useFirestoreSubscription(['hotels', userDB.hotelId, 'housekeeping', 'item', 'babyBed'],     { orderBy: ['markup', 'asc'] })

    let itemQty = [towel.length, soap.length, toiletPaper.length, hairDryer.length, pillow.length, blanket.length, iron.length, babyBed.length]
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let itemBadgeQty = itemQty.reduce(reducer)
    return (
        <div>
            <img src={Maid} alt="Maid" className="drawer_icons" onClick={()=>{navigate("/houseKeeping")}} />
            {itemBadgeQty > 0 && <span style={{
              borderRadius: "50%",
              backgroundColor: "red",
              position: "absolute",
              width: "1rem",
              color: "white",
              textAlign: "center",
              fontSize: "12px"}}>{itemBadgeQty}</span>}
        </div>
    )
}

export default HousekeepingOverlay
