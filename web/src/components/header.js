import React from 'react';
import avatar from '../images/avatar.svg';

const Header = () =>(
    <nav>
        <a target='_blank' rel="noreferrer" href="https://anto-pv.github.io/"><img className="avatar" src={avatar} alt="avatar"></img></a>
        <div className='currLoc'>
            <button > Current location</button>
        </div>
    </nav>
);
export default Header;