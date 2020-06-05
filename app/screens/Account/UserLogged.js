import React, { useState, useRef, useEffect} from 'react';
import {StyleSheet ,View, Text} from 'react-native';
import {Button} from 'react-native-elements';
import * as firebase from 'firebase';
import Toast from 'react-native-easy-toast';
 import Loading from '../../components/Loading';
import InfoUser from './InfoUser';

export default function UserLogged() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const toastRef = useRef();
    useEffect(() => {
        (async () => {
            const user = await firebase.auth().currentUser;
            setUserInfo(user);
        })();
    }, [])
    return (
        <View style={styles.viewUserInfo}>
            { userInfo &&
            <InfoUser 
                userInfo={userInfo} 
                toastRef={toastRef}
                setLoading={setLoading}
                setLoadingText={setLoadingText}
            />        
            }
            <Text>AccountOptions</Text>
            <Button 
                title='Cerrar sesion' 
                buttonStyle={styles.btnCloseSesion}
                titleStyle={styles.btnCloseSesionText}
                onPress={() => firebase.auth().signOut()}
            />
            <Toast ref={toastRef} position='center' opacity={0.9}/>
            <Loading text={loadingText} isVisible={loading}/>
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        minHeight: '100%',
        backgroundColor: '#f2f2f2'
    },
    btnCloseSesion: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e3e3e3',
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3',
        paddingTop: 10,
        paddingBottom: 10,
    },
    btnCloseSesionText: {
        color: '#00a680'
    }
});