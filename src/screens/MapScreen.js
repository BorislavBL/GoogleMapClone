import React, {useRef, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from "expo-constants"
import MapViewDirections from 'react-native-maps-directions';



const GOOGLE_API_KEY = "KEY"
const {width, height} = Dimensions.get('window')

const ASPEC_RATIO = width/height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPEC_RATIO;
const INITIAL_POSITION = {
    latitude: 3.767110,
    longitude: -3.979704,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta:LONGITUDE_DELTA,
}


export default function App() {
    const [origin, setOrigin] = useState("")
    const [destination, setDestination] = useState("")
    const [distance, setDistance] = useState(0)
    const [duration, setDuration] = useState(0)
    const [showDirections, setShowDirections] = useState(false)
    const mapRef = useRef(null)

    const InputAutocomplete = ({label, placeholder, onPlaceSelected}) =>{
        return(
                <>
                <Text>{label}</Text>
                <GooglePlacesAutocomplete
                    styles={{textInput: styles.input}}
                    placeholder={placeholder || ""}
                    fetchDetails = {true}
                    onPress={(data, details) => {
                        // 'details' is provided when fetchDetails = true
                        console.log("details",details);
                        onPlaceSelected(data, details)
                    }}
                    query={{
                        key: GOOGLE_API_KEY,
                        language: 'en',
                    }}
                />
            </>)
    }

    const moveTo = async (position) =>{
        const camera = await mapRef.current.getCamera()
        if (camera) {
            camera.center = position;
            mapRef.current?.animateCamera(camera, {duration: 500})
        }
    }

    const onPlaceSelected = (details, flag) =>{
        const set = flag === "origin" ? setOrigin : setDestination
        const position = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng 
        }
        set(position)
        moveTo(position)
    }

    const distanceEdge = 50

    const edgePadding = {
        top:distanceEdge,
        right:distanceEdge,
        bottom:distanceEdge,
        left:distanceEdge,
    }

    const traceRoute = () =>{
        if(origin && destination) {
            setShowDirections(!showDirections)
            mapRef.current.fitToCoordinates([origin,destination], {edgePadding})
        }
    }

    const traceRouteOnReady = (args) =>{
        if(args){
            setDistance(args.distance)
            setDuration(args.duration)
        }
    }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={INITIAL_POSITION} ref={mapRef}>
        {origin && <Marker coordinate={origin}/>}
        {destination && <Marker coordinate={destination}/>}
        {showDirections && origin && destination&& <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeColor="#6644ff"
            strokeWidth={5}
            onReady={traceRouteOnReady}
        />}
      </MapView>
        <View style={styles.searchContainer}>
            <InputAutocomplete label={"Origin"} onPlaceSelected={(data,details)=>{onPlaceSelected(details, "origin")}}/>
            <InputAutocomplete label={"Destination"} onPlaceSelected={(data, details)=>{onPlaceSelected(details, "destination")}}/>
            <TouchableOpacity style={styles.button} onPress={traceRoute}>
                <Text style={styles.buttonText}>Trace route</Text>
            </TouchableOpacity>
            {distance && duration ? (<View>
                <Text>Distance: {distance.toFixed(2)}</Text>
                <Text>Duration: {Math.ceil(duration)} mins</Text>
            </View>):null}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchContainer:{
    position:"absolute",
    width: "90%",
    backgroundColor:'white',
    shadowColor:'black',
    shadowOffset:{width:2, height:2},
    shadowOpacity:0.5,
    shadowRadius:4,
    elevation:4,
    padding:8,
    borderRadius:8,
    top:Constants.statusBarHeight
  },
  input:{
    borderColor:'#888',
    borderWidth:1
  },
  button:{
    backgroundColor:"#bbb",
    marginTop:12,
    borderRadius:50,
    paddingVertical:12,
  },
  buttonText:{
    textAlign:'center'
  }
});