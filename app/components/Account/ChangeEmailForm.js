import React, { useState } from 'react';
import {StyleSheet, View} from 'react-native';
import {Input, Button} from 'react-native-elements';

export default function ChangeEmailForm(props) {
    const { email,  setShowModal, toastRef, setReloadUserInfo} = props;

    const onSubmit = () => {
        console.log('Formulario enviado..');
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder='Correo electronico'
                containerStyle={styles.input}
                defaultValue={email || ''}
                rightIcon={{
                    type: 'material-community',
                    name: 'email',
                    color: '#c2c2c2'

                }}
            />
            <Input
                placeholder= 'Password'
                containerStyle={styles.input}
                password={true}
                secureTextEntry={true}
                rightIcon={{
                    type: 'material-community',
                    name: 'eye-outline',
                    color: '#c2c2c2'
                }}
            />
            <Button
                title='Cambiar Email'
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    input: {
        marginBottom: 10
    },
    btnContainer: {
        marginTop: 20,
        width: '95%'
    },
    btn: {
        backgroundColor: '#00a680'
    }
});