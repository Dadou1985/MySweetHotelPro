import React from 'react'
import RegisterFormSteps from '../components/section/RegisterFormSteps'
import { ShortenUrlProvider } from 'react-shorten-url';
import { withTrans } from '../../i18n/withTrans'

const RegisterForm = () => {
    
    return (
        <ShortenUrlProvider config={{ accessToken: '4414aed1636f8815449ff0a59d1b67a513dfc0d1' }}>
            <RegisterFormSteps />
        </ShortenUrlProvider>
    )
}

export default withTrans(RegisterForm)