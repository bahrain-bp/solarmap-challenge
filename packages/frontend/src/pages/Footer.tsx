import logo from "../assets/logo.png";
export const Footer = () => {
    return (    
<footer style={{backgroundColor:"grey"}}>
        <div className="container-fluid padding">
          <div className="row text-center">
            <div className="col-md-4">
              <img src= {logo} style={{height: "100px"}}/>
              <hr className="light" />
              <p>555-555-555</p>
              <p>email@email.com</p>
              <p>Manama, Bahrain</p>
          </div>
          <div className="col-md-4">
            <hr className="light" />
            <h5>Our Hours</h5>
            <hr className="light" />
            <p>Monday-Friday: 9am-5pm</p>
            <p>Saturday: 10am-2pm</p>
            <p>Sunday: Closed</p>
          </div>
          <div className="col-md-4">
          <hr className="light" />
            <h5>Service Governates</h5>
            <hr className="light" />
            <p>Central Municpal</p>
            <p>Muharraq Municpal</p>
            <p>Northern Municpal</p>
            <p>Southern Municpal</p>
          </div>
          <div className="col-12">
            <hr className="light" />
            <h5>&copy; 2024 Solar Map</h5>
            <h5>solarmap.org.bh</h5>
            </div>
          </div>
        </div>
      </footer>
    );
};

export default Footer;