import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions } from 'react-native';
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default function AddRestaurantForm(props) {

    const { toastRef, setIsLoading, navigation } = props;

    const [restaurantName, setRestaurantName] = useState('');
    const [restaurantAddress, setRestaurantAddress] = useState('');
    const [restaurantDescription, setRestaurantDescription] = useState('');
    const [imagesSelected, setImageSelected] = useState([]);

    console.log(imagesSelected);

    const addRestaurant = () => {
        console.log('ok!!');
        console.log(restaurantName);
        console.log(restaurantAddress);
        console.log(restaurantDescription);
    }

    return(
        <ScrollView style={styles.scrollView}>
           <FormAdd
            setRestaurantName={setRestaurantName}
            setRestaurantAddress={setRestaurantAddress}
            setRestaurantDescription={setRestaurantDescription}
           />
           <UploadImage
                toastRef={toastRef}
                imagesSelected={imagesSelected}
                setImageSelected={setImageSelected}
           />
           <Button 
                title='Crear restaurante'
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
        </ScrollView>
    )
}

function FormAdd(props) {

    const { setRestaurantName, setRestaurantAddress, setRestaurantDescription } = props;
    return (
        <View styles={styles.viewForm}>
            <Input
                placeholder='Nombre del restaurante'
                containerStyle={styles.input}
                onChange={e => setRestaurantName(e.nativeEvent.text)}
            />
            <Input
                placeholder='Direccion'
                containerStyle={styles.input}
                onChange={e => setRestaurantAddress(e.nativeEvent.text)}
            />
            <Input
                placeholder='Descripcion del restaurante'
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={e => setRestaurantDescription(e.nativeEvent.text)}
            />
        </View>
    )
}

function UploadImage(props) {

    const { toastRef, setImageSelected, imagesSelected } = props;

    const imageSelect = async () => {
        const resultPermissons = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        );
        if ( resultPermissons === 'denied' ) {
            toastRef.current.show(
                'Es necesario aceptar los permisos de galeria, si los has rechazado tienes que ir a los ajustes y activarlos', 3000
            );
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            });

            if ( result.cancelled ) {
                toastRef.current.show(
                    'Has cerrado la galeria sin seleccionar ninguna imagen', 2000
                )
            } else {
                console.log(result.uri);
                // setImageSelected(result.uri);
                setImageSelected([...imagesSelected, result.uri]);
            }
        }
    }

    const removeImage = (image) => {        

        Alert.alert(
            'Eliminar Imagen',
            'Estas seguro que quieres eliminar la imagen?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Eliminar', onPress: () => {
                    setImageSelected(imagesSelected.filter( imageUrl => imageUrl !== image ));
                }}
            ],
            { cancelable: false }
        )
    }


    console.log(imagesSelected.length);

    return(
        <View style={styles.viewImages}>
            { imagesSelected.length < 5 &&            
                <Icon
                    type='material-community'
                    name='camera'
                    color='#7a7a7a'
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            }
            { imagesSelected.map( (imageRestaurant, index)=> (
                <Avatar
                    key={index}
                    style={styles.miniatureAvatar}
                    source={{uri: imageRestaurant}}
                    onPress={() => removeImage(imageRestaurant)}
                />
            ) ) }
        </View>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        height: '100%'
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        width: '100%',
        padding: 0,
        margin: 0
    },
    btnAddRestaurant: {
        backgroundColor: '#00a680',
        margin: 20
    },
    viewImages: {
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: '#e3e3e3'
    },
    miniatureAvatar: {
        width: 70,
        height: 70,
        marginRight: 10
    }
});