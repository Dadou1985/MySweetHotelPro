import React from 'react'
import RegisterFormLong from '../components/auth/registerFormLong'
import { ShortenUrlProvider } from 'react-shorten-url';
import { withTrans } from '../../i18n/withTrans'

const RegisterForm = () => {
    
    return (
        <ShortenUrlProvider config={{ accessToken: process.env.GATSBY_BITLY_ACCESS_TOKEN }}>
        <div className="landscape-display"></div>
            <RegisterFormLong />
        </ShortenUrlProvider>
    )
}

export default withTrans(RegisterForm)