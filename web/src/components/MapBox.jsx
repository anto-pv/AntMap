import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
  } from '@react-google-maps/api'
  import { useRef, useState } from 'react'
  const center = { lat: 10.0603, lng: 76.6352 }
  
const MapBox = () => {
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
        if (originRef.current.value === '' || destiantionRef.current.value === '') {
          return
        }

        //These are api fetches no need to consider go to line 100
        
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService()
        const results = await directionsService.route({
          origin: originRef.current.value,
          destination: destiantionRef.current.value,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        })
        //setting lattitude and longititude for matrix entry
    
        const sLat = results.routes[0].legs[0].start_location.lat();
        const sLong =  results.routes[0].legs[0].start_location.lng();
        const eLat = results.routes[0].legs[0].end_location.lat();
        const eLong =  results.routes[0].legs[0].end_location.lng();
    
        const pointMap = new Map([[String([sLat,sLong]),0]]);
        // var distMat = new Array();
        // distMat[pointMap.size-1] = new Array();
    
        //route on west waypoint
        const wResults = await directionsService.route({
          origin: originRef.current.value,
          destination: destiantionRef.current.value,
          // eslint-disable-next-line no-undef
          waypoints: [{location:new google.maps.LatLng(sLat,sLong-0.1)}],
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        })
    
        //route on east waypoint    
        const eResults = await directionsService.route({
          origin: originRef.current.value,
          destination: destiantionRef.current.value,
          // eslint-disable-next-line no-undef
          waypoints: [{location:new google.maps.LatLng(sLat,sLong+0.1)}],
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        })  
    
        //route on south waypoint
        const sResults = await directionsService.route({
          origin: originRef.current.value,
          destination: destiantionRef.current.value,
          // eslint-disable-next-line no-undef
          waypoints: [{location:new google.maps.LatLng(sLat-0.1,sLong)}],
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        })  
    
        //route on north waypoint
        const nResults = await directionsService.route({
          origin: originRef.current.value,
          destination: destiantionRef.current.value,
          // eslint-disable-next-line no-undef
          waypoints: [{location:new google.maps.LatLng(sLat+0.1,sLong)}],
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        })  
        
        var distMatJson ={};
        let pointMapSize = pointMap.size; 

        // since matrix cannot passed directly to backend it is converted to json  in form "1-2" : 455 km

        function JsonConver(fResults){
          for(let j=0; j<fResults.routes[0].legs.length; j++){
            for (let i = 0; i < fResults.routes[0].legs[j].steps.length; i++) {
              let post =fResults.routes[0].legs[j].steps[i].end_location.lat();
              let long =fResults.routes[0].legs[j].steps[i].end_location.lng();
              if(!pointMap.has(String([post,long]))){
                pointMap.set(String([post,long]),pointMapSize++);
                //distMat[pointMap.size-1] = new Array();
              }
              let origPost = fResults.routes[0].legs[j].steps[i].start_location.lat();
              let origLong = fResults.routes[0].legs[j].steps[i].start_location.lng();
              if(i===0 && j===0){
                origPost = sLat;
                origLong = sLong;
              }
              if(i===fResults.routes[0].legs[j].steps.length-1 && j===fResults.routes[0].legs.length-1){
                post = eLat;
                long = eLong;
              }
              //console.log(pointMap.get(String([origPost,origLong])),pointMap,String([origPost,origLong]),i)
              //distMat[pointMap.get(String([origPost,origLong]))][pointMap.get(String([post,long]))] = wResults.routes[0].legs[0].steps[i].distance.value;
              let tempStr = String(pointMap.get(String([origPost,origLong]))) + "-"+ pointMap.get(String([post,long]));
              distMatJson[tempStr] = fResults.routes[0].legs[j].steps[i].distance.value;
            };
          }
        }
        JsonConver(wResults);
        JsonConver(eResults);
        //console.log(eResults,distMatJson);
        JsonConver(sResults);
        JsonConver(nResults);
        JsonConver(results);
        
        // this is for backend needs 

        distMatJson['waypoints'] = pointMap.size;
        distMatJson['origin'] = pointMap.get(String([sLat,sLong]));
        distMatJson['destination']  = pointMap.get(String([eLat,eLong]))
        console.log(distMatJson,pointMap.get(String([sLat,sLong])),pointMap.get(String([eLat,eLong])));
        //why post method is not working, need to install axios ?
        const response = await fetch('http://localhost:5000/distance',{
          mode: 'no-cors',
          method: 'POST',
          body: distMatJson,
          json: true,
          headers:{
            "Content-Type":"application/json"
          },
        });

        if(response.ok){
          console.log(response)
        }

        

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

 export default MapBox