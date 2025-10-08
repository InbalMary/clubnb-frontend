import { AdvancedMarker, APIProvider, InfoWindow, Map, Pin, useMap } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import { amenitiesSvg, mapMarker } from './Svgs';
import { HomeMarkerIcon } from './SmallComponents';


export function StayMap() {
    return (
        <>
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <MapController />
            </APIProvider>
        </>
    )

}

function MapController() {
    const position = { lat: 53.54992, lng: 10.00678 }
    const [coords, setCoords] = useState({ lat: 32.0853, lng: 34.7818 })



    function handleClick(event) {
        const latLng = event.detail.latLng
        setCoords(latLng)
    }

    return (
        <>
            <Map defaultCenter={coords}
                defaultZoom={17}
                options={{
                    // styles: customMapStyle,
                    disableDefaultUI: true,
                    zoomControl: true,
                    streetViewControl: false,
                }}
                // onClick={handleClick}

                style={{ height: '100%', width: '100%' }}
                mapId="DEMO_MAP_ID"
            >
                <AdvancedMarker position={coords}>
                    <HomeMarkerIcon size={48} fill="#222222ff" />


                </AdvancedMarker>
            </Map>
        </>
    )
}


// const customMapStyle=[
//     {
//         "featureType": "administrative.country",
//         "elementType": "geometry.fill",
//         "stylers": [
//             {
//                 "visibility": "on"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.country",
//         "elementType": "geometry.stroke",
//         "stylers": [
//             {
//                 "saturation": "-42"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.province",
//         "elementType": "geometry.stroke",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.province",
//         "elementType": "labels.text.stroke",
//         "stylers": [
//             {
//                 "lightness": "-25"
//             },
//             {
//                 "saturation": "15"
//             },
//             {
//                 "weight": "10.00"
//             },
//             {
//                 "visibility": "off"
//             },
//             {
//                 "color": "#e8dcdc"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.province",
//         "elementType": "labels.icon",
//         "stylers": [
//             {
//                 "visibility": "off"
//             },
//             {
//                 "color": "#fafafa"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.locality",
//         "elementType": "geometry.fill",
//         "stylers": [
//             {
//                 "visibility": "simplified"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.locality",
//         "elementType": "labels",
//         "stylers": [
//             {
//                 "visibility": "off"
//             },
//             {
//                 "color": "#b9b9b9"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.locality",
//         "elementType": "labels.text",
//         "stylers": [
//             {
//                 "visibility": "on"
//             },
//             {
//                 "color": "#cccaca"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.locality",
//         "elementType": "labels.text.fill",
//         "stylers": [
//             {
//                 "color": "#868282"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.locality",
//         "elementType": "labels.text.stroke",
//         "stylers": [
//             {
//                 "color": "#ffffff"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.locality",
//         "elementType": "labels.icon",
//         "stylers": [
//             {
//                 "color": "#ededed"
//             },
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.neighborhood",
//         "elementType": "geometry",
//         "stylers": [
//             {
//                 "visibility": "off"
//             },
//             {
//                 "color": "#6e6e6e"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.neighborhood",
//         "elementType": "geometry.fill",
//         "stylers": [
//             {
//                 "visibility": "off"
//             },
//             {
//                 "color": "#fbe9e9"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.neighborhood",
//         "elementType": "geometry.stroke",
//         "stylers": [
//             {
//                 "visibility": "off"
//             },
//             {
//                 "color": "#464646"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.neighborhood",
//         "elementType": "labels",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.land_parcel",
//         "elementType": "all",
//         "stylers": [
//             {
//                 "visibility": "on"
//             },
//             {
//                 "color": "#b36b6b"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.land_parcel",
//         "elementType": "geometry",
//         "stylers": [
//             {
//                 "visibility": "on"
//             },
//             {
//                 "color": "#bdbdbd"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.land_parcel",
//         "elementType": "geometry.fill",
//         "stylers": [
//             {
//                 "visibility": "on"
//             },
//             {
//                 "color": "#fcfcfc"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.land_parcel",
//         "elementType": "geometry.stroke",
//         "stylers": [
//             {
//                 "visibility": "on"
//             },
//             {
//                 "saturation": "100"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.land_parcel",
//         "elementType": "labels",
//         "stylers": [
//             {
//                 "visibility": "off"
//             },
//             {
//                 "color": "#494949"
//             }
//         ]
//     },
//     {
//         "featureType": "administrative.land_parcel",
//         "elementType": "labels.icon",
//         "stylers": [
//             {
//                 "color": "#404040"
//             }
//         ]
//     },
//     {
//         "featureType": "poi",
//         "elementType": "all",
//         "stylers": [
//             {
//                 "visibility": "simplified"
//             }
//         ]
//     },
//     {
//         "featureType": "poi.attraction",
//         "elementType": "labels",
//         "stylers": [
//             {
//                 "visibility": "on"
//             }
//         ]
//     },
//     {
//         "featureType": "road",
//         "elementType": "all",
//         "stylers": [
//             {
//                 "saturation": -100
//             },
//             {
//                 "lightness": 45
//             }
//         ]
//     },
//     {
//         "featureType": "road.highway",
//         "elementType": "all",
//         "stylers": [
//             {
//                 "visibility": "simplified"
//             }
//         ]
//     },
//     {
//         "featureType": "road.arterial",
//         "elementType": "labels.icon",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "transit",
//         "elementType": "all",
//         "stylers": [
//             {
//                 "visibility": "off"
//             }
//         ]
//     },
//     {
//         "featureType": "water",
//         "elementType": "all",
//         "stylers": [
//             {
//                 "color": "#a0dee9"
//             },
//             {
//                 "visibility": "on"
//             }
//         ]
//     }
// ]

const customMapStyle = [
    {
        featureType: 'all',
        elementType: 'all',
        stylers: [
            { saturation: '32' },
            { lightness: '-3' },
            { visibility: 'on' },
            { weight: '1.18' }
        ]
    },
    {
        featureType: 'administrative',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'landscape',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'landscape.man_made',
        elementType: 'all',
        stylers: [{ saturation: '-70' }, { lightness: '14' }]
    },
    {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'road',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'water',
        elementType: 'all',
        stylers: [{ saturation: '100' }, { lightness: '-14' }]
    },
    {
        featureType: 'water',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }, { lightness: '12' }]
    }
]