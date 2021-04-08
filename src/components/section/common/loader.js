import React, {useEffect} from "react"
import Loader from "react-loader-spinner"
import Mascott from '../../../svg/receptionist.svg'
import '../../css/loader.css'

const ShiftLoader = ({hide}) => {

  return (
    <div className="Loader-container" style={{display: hide}}>
        <div className="Loader-box">
        {typeof window !== `undefined` && window.innerWidth > 480 ?
          <Loader
                type="Puff"
                color="rgb(25,23,25)"
                height={1000}
                width={1000}
                timeout={10000}
            />
        :
          <Loader
                type="Puff"
                color="rgb(25,23,25)"
                height={700}
                width={400}
                timeout={10000}
              />}
        </div>
        <img src={Mascott} className="Loader-img" />
    </div>
  )
}

export default ShiftLoader;