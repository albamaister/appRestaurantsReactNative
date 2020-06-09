import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native';
import {ListItem} from 'react-native-elements';
import Modal from '../Modal';

export default function AccountOptions(props) {

    const {userInfo, toastRef} = props;
    const [showModal, setShowModal] = useState(true)
    const [renderComponent, setRenderComponent] = useState(null)
    
    const selectComponent = (key) => {
        switch (key) {
            case 'displayName':
                setRenderComponent(
                    <Text>Cambiando nombres y apellidos</Text>
                );
                setShowModal(true);
                break;
            case 'email':
                setRenderComponent(
                    <Text>Cambiando email</Text>
                );
                setShowModal(true);
                break;
            case 'password':
                setRenderComponent(
                    <Text>Cambiando password</Text>
                );
                setShowModal(true);
                break;
            default:
                setRenderComponent(null);
                setShowModal(false);
                break;
        }
    }
    const menuOptions = generateOptions(selectComponent);

    return (
        <View>
            {
                menuOptions.map((menu, index) => (
                    <ListItem
                        key={index}
                        title={menu.title}
                        leftIcon={{
                            type: menu.iconType,
                            name: menu.iconNameLeft,
                            color: menu.iconColorLeft,
                        }}
                        rightIcon={{
                            type: menu.iconType,
                            name: menu.iconNameRight,
                            color: menu.iconColorRight
                        }}
                        containerStyle={styles.menuItem}
                        onPress={menu.onPress}
                    />                    
                ))
            }
            { renderComponent &&
                <Modal isVisible={showModal} setIsVisible={setShowModal}>
                    {renderComponent}
                </Modal>
            }
        </View>
    );
}

function generateOptions(selectComponent) {


    
    return [
        {
            title: 'Cambiar nombre y apellidos',  
            iconType: 'materia-community',
            iconNameLeft: 'account-circle',
            iconColorLeft: '#ccc',
            iconNameRight: 'chevron-right',
            iconColorRight: '#ccc',
            onPress: () => selectComponent('displayName')           
        },
        {
            title: 'Cambiar email',
            iconType: 'materia-community',
            iconNameLeft: 'email',
            iconColorLeft: '#ccc',
            iconNameRight: 'chevron-right',
            iconColorRight: '#ccc',
            onPress: () => selectComponent('email')
        },
        {
            title: 'Cambiar contrasenia',
            iconType: 'materia-community',
            iconNameLeft: 'lock',
            iconColorLeft: '#ccc',
            iconNameRight: 'chevron-right',
            iconColorRight: '#ccc',
            onPress: () => selectComponent('password')
        }
    ]
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3'
    }
});