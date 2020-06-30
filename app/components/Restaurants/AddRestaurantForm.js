import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions } from 'react-native';
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import uuid from 'random-uuid-v4';
import Modal from '../Modal';
import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/storage';


const WidthScreen = Dimensions.get('window').width;

export default function AddRestaurantForm(props) {

    const { toastRef, setIsLoading, navigation } = props;

    const [restaurantName, setRestaurantName] = useState('');
    const [restaurantAddress, setRestaurantAddress] = useState('');
    const [restaurantDescription, setRestaurantDescription] = useState('');
    const [imagesSelected, setImageSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);    
    const [locationrestaurant, setLocationrestaurant] = useState(null);    

    const addRestaurant = () => {
        if (!restaurantName || !setRestaurantAddress || !restaurantDescription) {
            toastRef.current.show('Todos los campos del formulario son obligatorios');

        } else if ( imagesSelected.length === 0 ) {
            toastRef.current.show('El restaurante tiene que tener al menos una foto');
        } else if (!locationrestaurant) {
            toastRef.current.show('Tienes que localizar el restaurante en el mapa');
        } else {
            setIsLoading(true);
            uploadImageStorage().then(response => {
                console.log(response);
                setIsLoading(false);
            });            
        }
    }

    const uploadImageStorage = async () => {
        console.log(imagesSelected);
        let imageBlob = [];

        await Promise.all(
            imagesSelected.map( async (image) => {
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebase.storage().ref('restaurants').child(uuid());
                await ref.put(blob).then( async (result) => {
                    await firebase
                            .storage()
                            .ref(`restaurants/${result.metadata.name}`)
                            .getDownloadURL()
                            .then(photoUrl => {
                                imageBlob = [...imageBlob, photoUrl];
                            })
                });
            } )
        );        

        return imageBlob;
    };

    return(
        <ScrollView style={styles.scrollView}>
            <ImageRestaurant imageRestaurant={imagesSelected[0]} />
           <FormAdd
            setRestaurantName={setRestaurantName}
            setRestaurantAddress={setRestaurantAddress}
            setRestaurantDescription={setRestaurantDescription}
            setIsVisibleMap={setIsVisibleMap}
            locationrestaurant={locationrestaurant}
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
            <Map
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                toastRef={toastRef}
                setLocationrestaurant={setLocationrestaurant}
            />
        </ScrollView>
    )
}

function ImageRestaurant(props) {
    const { imageRestaurant } = props;

    return (
        <View style={styles.viewPhoto}>
            <Image source={imageRestaurant ? {uri: imageRestaurant} : require('../../../assets/img/no-image.png')} style={{width: WidthScreen, height: 200}}/>
        </View>
    )
}

function FormAdd(props) {

    const { setRestaurantName, setRestaurantAddress, setRestaurantDescription, setIsVisibleMap, locationrestaurant } = props;
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
                rightIcon={{
                    type: 'material-community',
                    name: 'google-maps',
                    color: locationrestaurant ? '#00a680' : '#c2c2c2',
                    onPress: () => setIsVisibleMap(true)
                }}
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

function Map(props) {

    const { isVisibleMap, setIsVisibleMap, toastRef, setLocationrestaurant } = props;
    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            const resultPermissions = await Permissions.askAsync(
                Permissions.LOCATION
            );
            const statusPermissions = resultPermissions.permissions.location.status;
            if ( statusPermissions !== 'granted' ) {
                toastRef.current.show(
                    "Tienes que aceptar los permisos de localizacion para crear un restaurante", 3000
                );
            } else {
                const loc = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                })
            }
        })()
    }, [])

    const confirmLocation = () => {
        setLocationrestaurant(location);
        toastRef.current.show('Localizacion guardada correctamente');
        setIsVisibleMap(false);
    }

    return(
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location && (
                    <MapView style={styles.mapStyle} initialRegion={location} showsUserLocation={true} onRegionChange={(region) => setLocation(region) }>
                        <MapView.Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            draggable
                        />
                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                    <Button 
                        title='Guardar Ubicacion'
                        containerStyle={styles.viewMapContainerBtnSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}

                    />
                    <Button 
                        title='Cancelar Ubicacion' 
                        containerStyle={styles.viewMapContainerBtnCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
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
    },
    viewPhoto: {
        alignItems: 'center',
        height: 200,
        marginBottom: 20
    },
    mapStyle: {
        width: '100%',
        height: 550
    },
    viewMapBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    viewMapContainerBtnCancel: {
        paddingLeft: 5
    },
    viewMapBtnCancel: {
        backgroundColor: '#a60d0d'
    },
    viewMapContainerBtnSave: {
        paddingRight: 5
    },
    viewMapBtnSave: {
        backgroundColor: '#00a680'
    }
});