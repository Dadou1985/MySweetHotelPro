import React from "react"
import { Puff } from "react-loader-spinner"
import { StaticImage } from 'gatsby-plugin-image'
import Mascott from '../../svg/receptionist.svg'
import '../../components/css/common/loader.css'

const ShiftLoader = ({hide}) => {
  const isBrowser = () => typeof window !== "undefined"
  const screenWidth = isBrowser() && window?.innerWidth
  const screenHeight = isBrowser() && window?.innerHeight

  return (
    <div className="Loader-container" style={{display: hide}}>
        <div className="Loader-box">
          <Puff
                color="rgb(25,23,25)"
                height={screenHeight}
                width={screenWidth}
                timeout={10000}
            />
        </div>
    </div>
  )
}

export default ShiftLoader;