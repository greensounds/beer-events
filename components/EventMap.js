import Image from 'next/image'
import {useEffect, useState} from 'react'
import ReactMapGl, {Marker} from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import Geocode from 'react-geocode'

export default function EventMap ({evt}) {
    const [lat, setLat] = useState(null)
    const [lng, setLng] = useState(null)
    const [loading, setLoading] = useState(true)
    const [viewport, setViewPort] = useState({
        latitude: 40.712721,
        longitude: -73.935242,
        zoom: 12,
        width: '100%',
        height: '500px'
    })

    useEffect(() => {
        // Get latitude & longitude from address.
        Geocode.fromAddress(evt.address).then(
            (response) => {
            const { lat, lng } = response.results[0].geometry.location;
                setLat(lat)
                setLng(lng)
                setViewPort({
                    ...viewport,
                    latitude: lat, longitude: lng
                })
                setLoading(false)
            },
            (error) => {
                console.error(error);
            }
        );
    }, [])

    Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY)

    if(loading) return false

    console.log(lat, lng)

    return(
       <ReactMapGl {...viewport} mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN} onViewportChange={(vp) => setViewPort(vp)} >
           <Marker key={evt.id} latitude={lat} longitude={lng} >
                <Image src='/images/pin.svg' width={30} height={30} />
           </Marker>
       </ReactMapGl>
    )
}