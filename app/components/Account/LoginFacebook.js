import React, { Component } from 'react';
import { SocialIcon } from 'react-native-elements';

export default function LoginFacebook() {

    const login = () => {
        console.log('Login..');
    }
    
    return (
        <SocialIcon
            title='Iniciar sesion con Facebook'
            button
            type='facebook'
            onPress={login}
        />
    )
}
