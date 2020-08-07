import React, {useState, useRef, useCallback} from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import {Icon, Button} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import Loading from '../components/Loading';

import {firebaseApp} from '../utils/firebase';
import firebase from 'firebase';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {
    const { navigation } = props;
    const [restaurants, setRestaurants] = useState([]);
    const [userLoged, setUserLoged] = useState(false);

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLoged(true) : setUserLoged(false);
    })

    useFocusEffect(
        useCallback(() => {
            if (userLoged) {
                const idUser = firebase.auth().currentUser.uid;
                db.collection('favorites')
                .where('idUser', '==', idUser)
                .get()
                .then((response) => {
                    let idRestaurantsArray = [];
                    response.forEach((doc) => {
                        idRestaurantsArray = [...idRestaurantsArray, doc.data().idRestaurant];                        
                    })
                    getDataRestaurant(idRestaurantsArray).then((response) => {
                        const restaurants = [];
                        response.forEach((doc) => {
                            const restaurant = doc.data();
                            restaurant.id = doc.id;
                            restaurants.push(restaurant);
                        });
                        setRestaurants(restaurants);
                    });
                })
            }
        }, [userLoged])
    );

    const getDataRestaurant = (idRestaurantsArray) => {
        const arrayRestaurants = [];
        idRestaurantsArray.forEach((idRestaurant) => {
            const result = db.collection('restaurants').doc(idRestaurant).get();
            arrayRestaurants.push(result);
        });        
        return Promise.all(arrayRestaurants);
    }

    if ( !userLoged ) {
        return <UserNoLogged navigation={navigation}/>
    }

    return (
        <View>
            <Text>Favorites.lll..</Text>
        </View>
    )
}

function NotFoundRestaurants() {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Icon type='material-community' name='alert-outline' size={50}/>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>No tienes restaurantes en tus listas</Text>
        </View>
    )
}

function UserNoLogged(props) {
    const {navigation} = props;
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Icon type='material-community' name='alert-outline' size={50}/>
            <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
                Necesitas estar logeado para ver esta seccion
            </Text>
            <Button
                title= 'Ir al login'
                containerStyle={{marginTop: 20, width: '80%'}}
                buttonStyle={{backgroundColor: '#00a680'}}
                onPress={() => navigation.navigate('account',{screen: 'login'})}

            />
        </View>
    ) 
}