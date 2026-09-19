import React from 'react'
import Support from '../../../../../assets/svg/support.svg'
import { navigate } from 'gatsby'
import { useFirestoreSubscription } from '../../../../../utils/hooks/useFirestore'

function SupportOverlay() {
  const { data: chatRoomQty = [] } = useFirestoreSubscription(
    ['assistance'],
    { where: ['status', '==', true] }
  )

  return (
      <div>
          <img src={Support} alt="Support" className="drawer_icons" onClick={()=>{navigate("/support")}} />
          {chatRoomQty.length > 0 && <span style={{
            borderRadius: "50%",
            backgroundColor: "red",
            position: "absolute",
            width: "15%",
            height: "7%",
            color: "white",
            textAlign: "center",
            fontSize: "12px",
            }}>{chatRoomQty.length}</span>}
      </div>
  )
}

export default SupportOverlay
