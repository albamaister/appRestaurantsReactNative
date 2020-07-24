import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AirbnbRating, Button, Input } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';
import {firebaseApp} from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);

export default function AddReviewRestaurant(props) {

    const {navigation, route} = props;
    const {idRestaurant} = route.params;
    const [rating, setRating] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [review, setReview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toastRef = useRef();

    const addReview = () => {
        if(!rating) {
            toastRef.current.show('No as dado ninguna puntuacion');
        } else if (!titulo) {
            toastRef.current.show('El titulo es obligatorio');
        } else if (!review) {
            toastRef.current.show('El comentario es obligatorio');
        } else {
            setIsLoading(true);
            const user = firebase.auth().currentUser;
            const payload = {
                idUser: user.uid,
                avatarUser: user.photoURL,
                isRestaurant: idRestaurant,
                title: titulo,
                review: review,
                rating: rating,
                createAt: new Date()
            }
            db.collection('reviews')
                .add(payload)
                .then(() => {
                    setIsLoading(false)
                })
                .catch(() => {
                    toastRef.current.show('Error al enviar la informacion');
                    setIsLoading(false)
                });
        }
    }

    return (
        <View style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating
                    count={5}
                    reviews={['Pésimo', 'Deficiente', 'Normal', 'Muy bueno', 'Excelente']}
                    defaultRating={0}
                    size={35}    
                    onFinishRating={(value) => {setRating(value)}}                
                />
            </View>
            <View style={styles.formReview}>
                <Input
                    placeholder='Titulo'
                    containerStyle={styles.input}
                    onChange={(e) => setTitulo(e.nativeEvent.text)}
                />
                <Input
                    placeholder='Comentario..'
                    multiline={true}
                    inputContainerStyle={styles.textArea}
                    onChange={(e) => setReview(e.nativeEvent.text)}
                />
                <Button
                    title='Enviar comentario'
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={addReview}
                />
            </View> 
            <Toast
                ref={toastRef}
                position='center'
                opacity={0.9}
            /> 
            <Loading
                isVisible={isLoading}
                text='Enviando comentario'
            />          
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    viewRating: {
        height: 110,
        backgroundColor:'#f2f2f2'
    },
    formReview: {
        flex: 1,
        alignItems: 'center',
        margin: 10,
        marginTop: 40
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 150,
        width: '100%',
        padding: 0,
        margin: 0
    },
    btnContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginTop: 20,
        marginBottom: 10,
        width: '95%'
    },
    btn: {
        backgroundColor: '#00a680'
    }
})
