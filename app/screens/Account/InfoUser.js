import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default function InfoUser(props) {

    const { userInfo: {photoURL, displayName, email}, toastRef } = props;
    
    const changeAvatar = async () => {
        const resultPermissions = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const resultPermissionsCamera = resultPermissions.permissions.cameraRoll.status;
        if ( resultPermissionsCamera === 'denied' ) {
            toastRef.current.show('Es necesario aceptar los permisos de la galeria');
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            });

            console.log(result);
        }
    }
    
    return (
        <View style={styles.viewUserInfo}>
            <Avatar 
                rounded 
                size='large' 
                showEditButton 
                onEditPress={changeAvatar}
                containerStyle={styles.userInfoAvatar}  
                source={photoURL ? { uri: photoURL } : require('../../../assets/img/avatar.jpg')}              
            />
            <View>
                <Text style={styles.displayName}>{ displayName ? displayName : 'Anonimo' }</Text>
                <Text>{email ? email : 'Social login'}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    userInfoAvatar: {
        marginRight: 20
    },
    viewUserInfo: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        paddingTop: 30,
        paddingBottom: 30
    },
    displayName: {
        fontWeight: 'bold',
        paddingBottom: 5
    }
});
