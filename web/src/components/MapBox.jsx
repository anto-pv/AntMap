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
    
        const pointMap = new Map([[String([sLat,sLong]),0]]);
        var distMat = new Array();
        distMat[pointMap.size-1] = new Array();
        let len = results.routes[0].legs[0].steps.length;
    
        //route on west waypoint
        const wResults = await directionsService.route({
          origin: originRef.current.value,
          destination: destiantionRef.current.value,
          // eslint-disable-next-line no-undef
          waypoints: [{location:new google.maps.LatLng(sLat,sLong-0.1)}],
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        })
        console.log(wResults)
    
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
        
        let pointMapSize = pointMap.size; 
        for (let i = 0; i < len; i++) {
          let post =results.routes[0].legs[0].steps[i].end_location.lat();
          let long =results.routes[0].legs[0].steps[i].end_location.lng();
          //test
          if(!pointMap.has(String([post,long]))){
            pointMap.set(String([post,long]),pointMapSize++);
            distMat[pointMap.size-1] = new Array();
          }
          let origPost = results.routes[0].legs[0].steps[i].start_location.lat();
          let origLong = results.routes[0].legs[0].steps[i].start_location.lng();
          if(i===0){
            origPost = sLat;
            origLong = sLong;
          }
          //console.log(pointMap.get(String([post,long])))
          distMat[pointMap.get(String([origPost,origLong]))][pointMap.get(String([post,long]))] = results.routes[0].legs[0].steps[i].distance.value;
          //distPoints.push(results.routes[0].legs[0].steps[i].distance.value);
          console.log(post,long)
        };
        console.log("pointmap",pointMap)
        console.log(results);
        let wlen =0; 
        for (let i = 0; i < wResults.routes[0].legs[0].steps.length; i++) {
          let post =wResults.routes[0].legs[0].steps[i].end_location.lat();
          let long =wResults.routes[0].legs[0].steps[i].end_location.lng();
          if(!pointMap.has(String([post,long]))){
            pointMap.set(String([post,long]),pointMapSize++);
            distMat[pointMap.size-1] = new Array();
          }
          let origPost = wResults.routes[0].legs[0].steps[i].start_location.lat();
          let origLong = wResults.routes[0].legs[0].steps[i].start_location.lng();
          if(i===0){
            origPost = sLat;
            origLong = sLong;
          }
          //console.log(pointMap.get(String([origPost,origLong])),pointMap,String([origPost,origLong]),i)
          distMat[pointMap.get(String([origPost,origLong]))][pointMap.get(String([post,long]))] = wResults.routes[0].legs[0].steps[i].distance.value;
          
        };
      
        let elen =0;
        for (let i = 0; i < eResults.routes[0].legs[0].steps.length; i++) {
          let post =eResults.routes[0].legs[0].steps[i].end_location.lat();
          let long =eResults.routes[0].legs[0].steps[i].end_location.lng();
          if(!pointMap.has(String([post,long]))){
            pointMap.set(String([post,long]),pointMapSize++);
            distMat[pointMap.size-1] = new Array();
          }
          
          let origPost = eResults.routes[0].legs[0].steps[i].start_location.lat();
          let origLong = eResults.routes[0].legs[0].steps[i].start_location.lng();
          if(i===0){
            origPost = sLat;
            origLong = sLong;
          }
          //console.log(pointMap.get(String([post,long])))
          distMat[pointMap.get(String([origPost,origLong]))][pointMap.get(String([post,long]))] = eResults.routes[0].legs[0].steps[i].distance.value;
          
        };
        
        let slen =0;
        for (let i = 0; i < sResults.routes[0].legs[0].steps.length; i++) {
          let post =sResults.routes[0].legs[0].steps[i].end_location.lat();
          let long =sResults.routes[0].legs[0].steps[i].end_location.lng();
          if(!pointMap.has(String([post,long]))){
            pointMap.set(String([post,long]),pointMapSize++);
            distMat[pointMap.size-1] = new Array();
          }
          let origPost = sResults.routes[0].legs[0].steps[i].start_location.lat();
          let origLong = sResults.routes[0].legs[0].steps[i].start_location.lng();
          if(i===0){
            origPost = sLat;
            origLong = sLong;
          }
          //console.log(pointMap.get(String([post,long])))
          distMat[pointMap.get(String([origPost,origLong]))][pointMap.get(String([post,long]))] = sResults.routes[0].legs[0].steps[i].distance.value;
          
        };
    
        let nlen =0;
        for (let i = 0; i < nResults.routes[0].legs[0].steps.length; i++) {
          let post =nResults.routes[0].legs[0].steps[i].end_location.lat();
          let long =nResults.routes[0].legs[0].steps[i].end_location.lng();
          if(!pointMap.has(String([post,long]))){
            pointMap.set(String([post,long]),pointMapSize++);
            distMat[pointMap.size-1] = new Array();
          }
          let origPost = nResults.routes[0].legs[0].steps[i].start_location.lat();
          let origLong = nResults.routes[0].legs[0].steps[i].start_location.lng();
          if(i===0){
            origPost = sLat;
            origLong = sLong;
          }
          //console.log(pointMap.get(String([post,long])))
          distMat[pointMap.get(String([origPost,origLong]))][pointMap.get(String([post,long]))] = nResults.routes[0].legs[0].steps[i].distance.value;
          
        };
    
        for(let i=0; i<pointMap.size; i++){
          for(let j =0; j<pointMap.size; j++ ){
            if(!(distMat[i][j]>0)){
              if(distMat[j][i]>0){
                distMat[i][j]=distMat[j][i];
              }
              else{
                distMat[i][j]="np.inf";
              }
            }
            //console.log(distMat[i][j]);
          }
        }
        console.log(distMat);
        for(let i=0; i<pointMap.size; i++){
          var art = "";
          for(let j =0; j<pointMap.size; j++ ){
            art+=String(distMat[i][j])
          }
          console.log(art);
        }
        // console.log({resultDistMat});
        //console.log("dgd",randomFunc(distMat));
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