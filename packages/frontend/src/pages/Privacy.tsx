import solarprovider from "../assets/solarprovider.jpg";

const Privacy = () => {
    return (
        <>
            {/* Hero Image with Text Overlay */}
            <div id="aboutHero" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                    <img className="d-block w-100" alt="Solar Panels" style={{ height: "500px"}} src={solarprovider}/>
                        <div className="carousel-caption d-none d-md-block">
                            <h1 className="display-2" style={{ textShadow: '2px 4px 5px rgba(0,0,0,0.6)' }}>Privacy Policy</h1>
                        </div>
                    </div>
                </div>
            </div>


            {/* Mission and Vision Section */}
            <div className="container-fluid bg-light p-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <h2>Data Collection and Usage</h2>
                            <p style={{ fontSize: "24px" }}>We value your privacy at SolarMap. Our Privacy Policy governs how we collect, use, and share your personal information. This includes data you provide directly to us and information collected automatically through cookies and similar technologies. By using our services, you agree to our practices outlined in this Privacy Policy.

</p>
                        </div>
                        <div className="col-md-6">
                            <h2>Data Sharing and Protection</h2>
                            <p style={{ fontSize: "24px" }}>At SolarMap, we prioritize the security of your personal information. We only share your data with trusted third-party service providers as necessary to deliver our services. While we take reasonable measures to protect your data, please be aware that no method of transmission over the internet is completely secure. By using our platform, you acknowledge and accept these risks associated with data transmission.</p>
                        </div>
                    </div>
                </div>
            </div>
            <hr />

            {/* Values Section */}
            <div className="container my-5">
                <h2 className="display-4 text-center">Our Core Values</h2>
                <br />
                <div className="row text-center">
                    <div className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm rounded">
                            <div className="card-body">
                                <i className="fas fa-handshake fa-3x mb-3"></i>
                                <h4 className="card-title">Integrity</h4>
                                <p className="card-text">Commitment to honesty and fairness.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm rounded">
                            <div className="card-body">
                                <i className="fas fa-leaf fa-3x mb-3"></i>
                                <h4 className="card-title">Sustainability</h4>
                                <p className="card-text">Advocating for environmental conservation.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm rounded">
                            <div className="card-body">
                                <i className="fas fa-bullhorn fa-3x mb-3"></i>
                                <h4 className="card-title">Transparency</h4>
                                <p className="card-text">Open and clear communication in all our dealings.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-4">
                        <div className="card h-100 shadow-sm rounded">
                            <div className="card-body">
                                <i className="fas fa-users fa-3x mb-3"></i>
                                <h4 className="card-title">Customer-Centric</h4>
                                <p className="card-text">Placing customer needs at the heart of our operations.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-4">
                        <div className="card h-100 shadow-sm rounded">
                            <div className="card-body">
                                <i className="fas fa-star fa-3x mb-3"></i>  {/* Updated icon */}
                                <h4 className="card-title">Excellence</h4>
                                <p className="card-text">Striving for superior performance and innovation.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Privacy;
