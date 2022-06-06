import React from 'react';
import car from '../images/car.svg';
import fan from '../images/fan.svg';
import map from '../images/map.svg';
import music from '../images/music.svg';
import smartphone from '../images/smartphone.svg';
import sound from '../images/sound.svg';
import vent from '../images/vent.svg';

const Header = () =>(
    <nav>
        <div className="optionsBar">
            <div className="options">
                <img src={car} alt="car" className='optionIocn'/>
            </div>
            <div className="options">
                <img src={fan} alt="car" className='optionIocn'/>
            </div>
            <div className="options">
                <img src={map} alt="car" className='optionIocn'/>
            </div>
            <div className="options">
                <img src={music} alt="car" className='optionIocn'/>
            </div>
            <div className="options">
                <img src={smartphone} alt="car" className='optionIocn'/>
            </div>
            <div className="options">
                <img src={sound} alt="car" className='optionIocn'/>
            </div>
            <div className="options">
                <img src={vent} alt="car" className='optionIocn'/>
            </div>
        </div>
    </nav>
);
export default Header;