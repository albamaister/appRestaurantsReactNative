import React from 'react';
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { Button } from 'react-native-elements';

export default function UserGuest() {
    
    return (
        <ScrollView centerContent={true} style={styles.viewBody}>
            <Image 
            source={require('../../../assets/img/user-guest.jpg')}
            resizeMode='contain'
            style={styles.image}
            />
            <Text style={styles.title}>Consulta tu perfil de Tenedores</Text>
            <Text style={styles.description}>
            En esta app encontrarás un sinfín de restaurantes saludables, vegetarianos. Si eres un restaurante que cumple alguna de las anteriores categorías pide que te incluyan en el directorio de la app.
            </Text>
            <View style={styles.viewBtn}>
                <Button buttonStyle={styles.btnStyle} containerStyle={styles.btnContainer} title='Ver tu perfil' onPress={() => console.log('Click!!!')}/>
            </View>
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30
    },
    image: {
        height: 300,
        width: '100%',
        marginBottom: 40
    },
    title: {
        fontWeight: 'bold',
        fontSize: 19,
        marginBottom: 10,
        textAlign: 'center'
    },
    description: {
        textAlign: 'center',
        marginBottom: 20
    },
    btnStyle : {
        backgroundColor: '#00a680'
    },
    viewBtn: {
        flex: 1,
        alignItems: 'center'
    },
    btnContainer: {
        width: '70%'        
    }
});