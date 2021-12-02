import React from 'react'
import RegisterFormSteps from '../components/section/RegisterFormSteps'
import { ShortenUrlProvider } from 'react-shorten-url';

export default function RegisterForm() {
    
    return (
        <ShortenUrlProvider config={{ accessToken: '4414aed1636f8815449ff0a59d1b67a513dfc0d1' }}>
            <RegisterFormSteps />
        </ShortenUrlProvider>
    )
}
