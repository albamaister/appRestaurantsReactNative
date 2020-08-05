import React, {useState, useRef, useCallback} from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Image, Icon, Botton } from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import Loading from '../components/Loading';

import {firebaseApp} from '../utils/firebase';
import firebase from 'firebase';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);

export default function Favorites() {
    const [restaurants, setRestaurants] = useState(null);
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

    if (!restaurants) {
        return <Loading isVisible={true} text='Cargando Restaurantes'/>
    } else if ( restaurants.length === 0 ) {
        return <NotFoundRestaurants/>
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