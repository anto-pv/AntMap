import {Routes, Route} from 'react-router-dom';
import Header from "./components/header";
import MapBox from "./components/MapBox"
import MRoute from './components/Route';
import './style/App.scss';

function App() {

  return (
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/" element={<MapBox/>}/>
          <Route path="/route" element={<MRoute/>}/>
        </Routes>
      </div>
  )
}

export default App


// const myList = [1,4,5,1,2,4,5,6,7];
// const unique = [...new Set(myList)];
    
// console.log(unique);
