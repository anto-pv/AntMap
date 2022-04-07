import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  Geocode,
} from '@react-google-maps/api'
import { useRef, useState } from 'react'

const center = { lat: 10.0603, lng: 76.6352 }
const matrixpoints = [];

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyD-R-iimUeUMWoUApy66q_MqFfQioQhz9A',
    libraries: ['places'],
  })

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()

  if (!isLoaded) {
    return 'loading....';
  }

  async function calculateRoute() {
    matrixpoints.push(originRef.current.value);
    matrixpoints.push(destiantionRef.current.value);
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    console.log(originRef);
    for (let i = 0; i < results.routes[0].legs[0].steps.length; i++) {
      let post =results.routes[0].legs[0].steps[i].end_location.lat;
      let long =results.routes[0].legs[0].steps[i].end_location.lng;
      matrixpoints.push({post,long});
    };
    console.log(matrixpoints);
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.p)
    setDuration(results.routes[0].legs[0].duration.p)
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }

  return (
    <div
    >
      <div>
        {/* Google Map div */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '60%', height: '60vh' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
      <div
      >
        <div>
          <div flexGrow={1}>
            <Autocomplete>
              <input type='p' placeholder='Origin' ref={originRef} />
            </Autocomplete>
          </div>
          <div flexGrow={1}>
            <Autocomplete>
              <input
                type='p'
                placeholder='Destination'
                ref={destiantionRef}
              />
            </Autocomplete>
          </div>

          <div>
            <button type='submit' onClick={calculateRoute}>
              Calculate Route
            </button>
            <button
              aria-label='center back'
              onClick={clearRoute}
            />
          </div>
        </div>
        <div spacing={4} mt={4} justifyContent='space-between'>
          <p>Distance: {distance} </p>
          <p>Duration: {duration} </p>
          <button
            aria-label='center back'
            isRound
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default App


// const myList = [1,4,5,1,2,4,5,6,7];
// const unique = [...new Set(myList)];
    
// console.log(unique);