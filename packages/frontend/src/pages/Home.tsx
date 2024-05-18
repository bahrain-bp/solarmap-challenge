import SolarPanelBackground from "../assets/SolarPanelBackground.jpg";
import SolarGif from "../assets/SolarGif.gif";
import SolarGif2 from "../assets/SolarGif2.gif";
import SolarGif3 from "../assets/SolarGif3.gif";
import SolarGif4 from "../assets/SolarGif4.gif";

import { SetStateAction, useState, useEffect } from "react";
import exportString from "../api_url";
const API_BASE_URL = exportString();

// import Team1 from "../assets/Team1.jpg";
// import Team2 from "../assets/Team2.jpg";
// import Team3 from "../assets/Team3.jpg";
// import Team4 from "../assets/Team4.jpg";
// import Team5 from "../assets/Team5.jpg";

export default function Home() {



  const [message, setMessage] = useState("");

  //////// Web Socket Connection //////////

  useEffect(() => {
  // const url = "wss://zrzuvslvoj.execute-api.us-east-1.amazonaws.com/husain" // WebSocket URL
  const webSocketUrl = import.meta.env.VITE_WEB_SOCKET_API_KEY; 
   console.log(webSocketUrl);
    // Connect to the WebSocket
   // Connect to the WebSocket
   const newSocket = new WebSocket(webSocketUrl);

   // Connection opened
   newSocket.addEventListener("open", (event) => {
     console.log("WebSocket connection opened:", event);
   });

   // Listen for messages
   newSocket.addEventListener("message", (event) => {
     console.log("WebSocket received a message:", event.data);
     setMessage(event.data);
   });


   // Connection closed
   newSocket.addEventListener("close", (event) => {
     console.log("WebSocket connection closed:", event);
   });

   // Connection error
   newSocket.addEventListener("error", (event) => {
     console.error("WebSocket connection error:", event);
   });

    console.log(message);
   
   return () => {
     newSocket.close();
   };

   }, []);
   

  const [feedback, setFeedback] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false); // New state for submit success message

  const handleFeedbackChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setFeedback(e.target.value);
  };


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      await fetch(`${API_BASE_URL}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback_content: feedback }),
      });

      // Show success message
      setSubmitSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setFeedback("");
    }
  };



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
              <h1 className="display-2" style={{ fontSize: "86px", textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>Solar Map</h1>
              <h3 style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Welcome to Your Solar Journey</h3>
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
            <a href="#"><button type="button" className="btn btn-outline-secondary btn-lg" style={{ fontSize: "32px" }}>Calculator</button></a>
          </div>
        </div>
      </div>
      {/* Welcome */}
      <div className="container-fluid padding">
        <div className="row welcome text-center">
          <div className="col-12">
            <h1 className="display-4">A Guide to Solar Map Installation across the Kingdom of Bahrain.</h1>
            <hr />
            <div className="col-12">
              <p className="lead" style={{ fontSize: "24px" }}>Solar Map is a smart solar panel calculator tool that helps estimate the potential cost and savings of installing solar panels on a property. By inputting factors such as location, energy usage, and roof space, users can quickly assess the feasibility and financial benefits of transitioning to solar energy.
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

      {/* Two Column Section */}
      <div className="container-fluid padding">
        <div className="row padding">
          <div className="col-lg-6">
            <h2 style={{ textAlign: "center" }}>Guiding the Path to a Sustainable Future</h2>
            <p style={{ fontSize: "22px" }}>Empowering homeowners with precision, our solar map harnesses sunlight's potential, guiding towards sustainable energy solutions, one roof at a time.</p>
            <p style={{ fontSize: "22px" }}>"Our solar map: illuminating paths to renewable futures, calculating the sun's bounty for eco-conscious endeavors."</p>
            <br />
          </div>
          <div className="col-lg-6">
            <img src={SolarPanelBackground} className="img-fluid" alt="Solar Map" />
          </div>
        </div>
        <a href="#" className="btn btn-primary">Explore Initiative</a>
      </div>

      <hr className="my-4" />

      {/* Fixed Background */}
      <figure>
        <div className="fixed-wrap">
          <div id="fixed">

          </div>
        </div>
      </figure>

      {/* Hidden Section */}
      <br />
      <div className="row text-center">
        <button className="btn btn-outline-secondary" data-toggle="collapse" data-target="#gifs">
          <h1 className="display-4">Discover More</h1>
        </button>
      </div>
      <br />

      <div id="gifs" className="collapse">
        <div className="container-fluid padding">
          <div className="row text-center">
            <div className="col-sm-6 col-md-3">
              <img className="gif" src={SolarGif} />
            </div>
            <div className="col-sm-6 col-md-3">
              <img className="gif" src={SolarGif2} />
            </div>
            <div className="col-sm-6 col-md-3">
              <img className="gif" src={SolarGif3} />
            </div>
            <div className="col-sm-6 col-md-3">
              <img className="gif" src={SolarGif4} />
            </div>
          </div>
        </div>
      </div>
      <hr className="my-4" />
      {/* Meet the Team
      <div className="container-fluid padding">
        <div className="row welcome text-center">
          <div className="col-12">
            <h1 className="display-4">Meet the Team</h1>
            <hr />
          </div>
        </div>
      </div>
      <br /> */}

      {/* Team Section with Cards
<div className="container">
                <h2 className="display-4 text-center">Meet Our Team</h2>
                <div className="row">
                    <div className="col-md-4">
                        <div className="card">
                            <img src={Team1} className="card-img-top" alt="Husain Basem" />
                            <div className="card-body">
                                <h5 className="card-title">Husain Basem</h5>
                                <p className="card-text">System Architect</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <img src={Team2} className="card-img-top" alt="Suhaib Rajab" />
                            <div className="card-body">
                                <h5 className="card-title">Suhaib Rajab</h5>
                                <p className="card-text">Business Analyst</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <img src={Team3} className="card-img-top" alt="Mahdi Alebrahim" />
                            <div className="card-body">
                                <h5 className="card-title">Mahdi Alebrahim</h5>
                                <p className="card-text">Tech Lead</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <img src={Team4} className="card-img-top" alt="Sayed Qassim" />
                            <div className="card-body">
                                <h5 className="card-title">Sayed Qassim</h5>
                                <p className="card-text">Developer</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <img src={Team5} className="card-img-top" alt="Amira Alawadhi" />
                            <div className="card-body">
                                <h5 className="card-title">Amira Alawadhi</h5>
                                <p className="card-text">Project Manager</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
      <br />
      <br />
      {/* Feedback Section */}
      <div className="container-fluid padding">
        <div className="row text-center">
          <div className="col-12">
            <h2>We Value Your Feedback</h2>
            <p className="lead" style={{ fontSize: "24px" }}>
              Click the button below to give us your feedback on the application. Your feedback is anonymous unless you choose to provide your email address or phone number for us to reach out to you.
            </p>
            <button type="button" className="btn btn-outline-secondary btn-lg" data-toggle="modal" data-target="#feedbackModal">
              Give Feedback
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
<div className="modal fade" id="feedbackModal" role="dialog" aria-labelledby="feedbackModalLabel" aria-hidden="true">
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="feedbackModalLabel">Feedback</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="feedback">Your Feedback</label>
            <textarea
              className="form-control"
              id="feedback"
              value={feedback}
              onChange={handleFeedbackChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
          {/* Success Message */}
          {submitSuccess && (
            <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
              Feedback submitted successfully!
              <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => setSubmitSuccess(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  </div>
</div>

      <br></br>

      {/* Connect Socials */}
      <div className="container-fluid padding">
        <div className="row text-center padding">
          <div className="col-12">
            <h2>Connect</h2>
          </div>
          <div className="col-12 social padding">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-google-plus-g"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
      <br />
    </>
  );
}
