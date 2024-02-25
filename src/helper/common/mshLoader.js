import React from "react"
import { Puff } from "react-loader-spinner"
import { StaticImage } from 'gatsby-plugin-image'
import Mascott from '../../svg/receptionist.svg'
import '../../components/css/common/loader.css'

const ShiftLoader = ({hide}) => {

  return (
    <div className="Loader-container" style={{display: hide}}>
        <div className="Loader-box">
        {typeof window !== `undefined` && window.innerWidth > 768 ?
          <Puff
                color="rgb(25,23,25)"
                height={1000}
                width={1000}
                timeout={10000}
            />
        :
          <Puff
                color="rgb(25,23,25)"
                height={700}
                width={400}
                timeout={10000}
              />}
        </div>
        <StaticImage placeholder="blurred" src='../../svg/receptionist.svg' className="Loader-img" alt="Receptionnist Logo" />
    </div>
  )
}

export default ShiftLoader;