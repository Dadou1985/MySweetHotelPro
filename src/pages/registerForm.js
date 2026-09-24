import React from 'react'
import RegisterFormSteps from '../components/section/RegisterFormSteps'
import { ShortenUrlProvider } from 'react-shorten-url';
import { withTrans } from '../../i18n/withTrans'

const RegisterForm = () => {
    
    return (
        <ShortenUrlProvider config={{ accessToken: process.env.GATSBY_BITLY_ACCESS_TOKEN }}>
        <div className="landscape-display"></div>
            <RegisterFormSteps />
        </ShortenUrlProvider>
    )
}

export default withTrans(RegisterForm)