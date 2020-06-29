import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions, Text } from 'react-native';
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import Modal from '../Modal';

const WidthScreen = Dimensions.get('window').width;

export default function AddRestaurantForm(props) {

    const { toastRef, setIsLoading, navigation } = props;

    const [restaurantName, setRestaurantName] = useState('');
    const [restaurantAddress, setRestaurantAddress] = useState('');
    const [restaurantDescription, setRestaurantDescription] = useState('');
    const [imagesSelected, setImageSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);    

    console.log(imagesSelected);

    const addRestaurant = () => {
        console.log('ok!!');
        console.log(restaurantName);
        console.log(restaurantAddress);
        console.log(restaurantDescription);
    }

    return(
        <ScrollView style={styles.scrollView}>
            <ImageRestaurant imageRestaurant={imagesSelected[0]} />
           <FormAdd
            setRestaurantName={setRestaurantName}
            setRestaurantAddress={setRestaurantAddress}
            setRestaurantDescription={setRestaurantDescription}
            setIsVisibleMap={setIsVisibleMap}
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

    const { setRestaurantName, setRestaurantAddress, setRestaurantDescription, setIsVisibleMap } = props;
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
                    color: '#c2c2c2',
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

    const { isVisibleMap, setIsVisibleMap, toastRef } = props;
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
                console.log(result.uri);
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
    }
});