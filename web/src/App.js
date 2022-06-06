import {Routes, Route} from 'react-router-dom';
import Header from "./components/header";
import MapBox from "./components/MapBox"
import MRoute from './components/Route';
import './style/App.scss';
import car from "./images/car.png";
import left from "./images/left.svg";
import top from "./images/top.svg";
import right from "./images/right.svg";

function App() {

  return (
      <div className="App">
        <div className='screen'>
        <div className='carRoute'>
          <div className="directions">
            <div className='icons'>
              <img src={left} alt='left'/>
            </div>
            <div className='icons'>
              <img src={top} alt='top'/>
            </div>
            <div className='icons'>
              <img src={right} alt='right'/>
            </div>
          </div>
          <div className='car'>
            <img src={car} alt="car"/>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<MapBox/>}/>
          <Route path="/route" element={<MRoute/>}/>
        </Routes>
        </div>
        <Header/>
      </div>
  )
}

export default App


// const myList = [1,4,5,1,2,4,5,6,7];
// const unique = [...new Set(myList)];
    
// console.log(unique);
