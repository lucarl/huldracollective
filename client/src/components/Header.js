import React from 'react';
import logo from '../huldraimg.jpg'; // Tell Webpack this JS file uses this image

function Header() {
  // Import result is the URL of your image
  return <img src={logo} alt="Logo" />;
}

export default Header;