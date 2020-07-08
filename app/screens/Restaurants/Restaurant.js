import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
const db = firebase.firestore(firebaseApp);

export default function Restaurant(props) {

    
    const {navigation, route} = props;
    const { id, name } = route.params;
    const [retaurant, setRetaurant] = useState(null);

    navigation.setOptions({title: name});

    useEffect(() => {
        db.collection('restaurants').doc(id)
            .get()
            .then((response) => {
                const data = response.data();
                data.id = response.id;
                setRetaurant(data);
            })
    }, [])

    return (
        <View>
            <Text>Restaurante info</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
