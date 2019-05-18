import React from 'react';
import logo from '../huldraimg.jpg'; // Tell Webpack this JS file uses this image

function Header() {
  // Import result is the URL of your image
  return <img   resizeMode={'cover'}
  style={{ width: '60%'}} src={logo} alt="Logo" />;
}

export default Header;