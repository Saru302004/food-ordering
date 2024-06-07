import React from "react";
import "./header.css";
function Header() {
  return (
    <>
      <div className="header">
        <div className="header-content">
          <h2>Order your favourite food here.</h2>
          <p>
          Satisfy your cravings with Délice, where every meal is a masterpiece. From gourmet feasts to quick bites, our diverse menu has something for everyone. Enjoy the convenience of ordering from home and let us deliver restaurant-quality food to your doorstep. At Délice, every bite is a delightful experience!
          </p>
          <a href="#explore-menu"><button>View Menu &nbsp; &rarr;</button></a>
        </div>
      </div>
    </>
  );
}

export default Header;
