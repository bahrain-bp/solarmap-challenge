export default function Home() {
  return (
    <>
    {/* Image Slider */}
      <div id="slides" className="carousel slide" data-ride="carousel">
        <ul className="carousel-indicators">
          <li data-target="#slides" data-slide-to="0" className="active"></li>
          <li data-target="#slides" data-slide-to="1"></li>
          <li data-target="#slides" data-slide-to="2"></li>
        </ul>
        <div className="carousel-inner">
          <div className="carousel-item">
            <img className="d-block w-100" src="https://static.vecteezy.com/system/resources/previews/001/235/998/non_2x/solar-panel-cell-on-dramatic-sunset-sky-background-free-photo.jpg" style={{ height: "1200px" }} alt="First slide" />
            <div className="carousel-caption">
              <h1 className="display-2" style={{ fontSize: "86px" }}>Solar Map</h1>
              <h3>Welcome to Your Solar Journey</h3>
              <button type="button" className="btn btn-outline-light btn-lg">Learn More</button>
              <button type="button" className="btn btn-outline-primary btn-lg">Get Started</button>
            </div>
          </div>
          <div className="carousel-item">
            <img className="d-block w-100" src="https://t4.ftcdn.net/jpg/03/36/30/11/360_F_336301102_17vyr7sr47lPiL4AhcUJtlepUwnISErJ.jpg" style={{ height: "1200px" }} alt="Second slide" />
          </div>
          <div className="carousel-item active">
            <img className="d-block w-100" src="https://www.innovationnewsnetwork.com/wp-content/uploads/2024/02/shutterstock_foxbat_175274429.jpg" style={{ height: "1200px" }} alt="Third slide" />
          </div>
        </div>
      </div>
{/* Jumbotron */}
      <div className="container-fluid">
        <div className="row jumbotron">
          <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-10">
            <p className="lead" style={{ fontSize: "32px" }}>
Solar Map is a smart solar panel calculator tool that helps estimate the potential cost and savings of installing solar panels on a property. 
By inputting factors such as location, energy usage, and roof space, users can quickly assess the feasibility and financial benefits of transitioning to solar energy.</p>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-2">
            <a href="#"><button type="button" className="btn btn-outline-secondary btn-lg" style={{ fontSize: "32px"}}>Calculator</button></a>
          </div>"
        </div>
      </div>
{/* Welcome */}
<div className="container-fluid padding">
  <div className="row welcome text-center">
    <div className="col-12">
      <h1 className="display-4">A Guide to Solar Map Installation across the Kingdom of Bahrain.</h1>
      <hr />
      <div className="col-12">
        <p className="lead" style={{ fontSize: "24px"}}>Solar Map is a smart solar panel calculator tool that helps estimate the potential cost and savings of installing solar panels on a property. By inputting factors such as location, energy usage, and roof space, users can quickly assess the feasibility and financial benefits of transitioning to solar energy.
Our solar map calculator is designed to help you identify the best installation options for your solar property. With a wide range of features, including location, energy usage, and roof space, our solar map calculator can provide you with a comprehensive analysis of your solar property's potential.
Whether you're a homeowner looking to install solar panels, a business owner looking to expand their business, or a general investor looking to invest in solar energy, our solar map calculator is here to help you make informed decisions.
With our solar map calculator, you can easily input your property's location, energy usage, and roof space, and our solar map calculator will provide you with a comprehensive analysis of your property's potential solar energy savings.</p>
      </div>
    </div>
  </div>
</div>
{/* Three Column Section */}
<div className="container-fluid padding">
  <div className="row text-center padding">
    <div className="col-xs-12 col-sm-6 col-md-4">
      <i className="fas fa-code"></i>
      <h3>Easy to Use</h3>
      <p>A seamless solution for users.</p>
      </div>

      <div className="col-xs-12 col-sm-6 col-md-4">
      <i className="fas fa-bold"></i>
      <h3>Automated</h3>
      <p>A quick and on-the-go experience.</p>
      </div>

      <div className="col-xs-12 col-md-4">
      <i className="fab fa-css3"></i>
      <h3>Customized</h3>
      <p>Tailored results for your needs.</p>
      </div>
    </div>
  </div>
  <hr className="my-4" />
      </>
  );
}
