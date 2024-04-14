const About = () => {
    return (
        <>
            {/* Hero Image with Text Overlay */}
            <div id="aboutHero" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img className="d-block w-100" src="https://assets-global.website-files.com/63ffe7a74ae3957641bb4e46/641330a35720b27a54a94f7f_64067211c0a34954ba79a150_solar-panels-on-green-grass-with-a-bright-sun-in-the-background.jpg.webp" alt="Solar Panels" style={{ height: "500px" }} />
                        <div className="carousel-caption d-none d-md-block">
                            <h1 className="display-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>About SolarMap</h1>
                            <p className="lead" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Driving the future of solar energy in Bahrain.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Jumbotron */}
            <div className="container-fluid">
                <div className="row jumbotron">
                    <h2 className="display-4">Who We Are</h2>
                    <p className="lead" style={{ fontSize: "32px" }}>SolarMap is a pioneering startup focused on leveraging technology and AI to enhance the energy sector. Our innovative solutions address the challenges associated with solar panel installations, focusing on cost-effectiveness and sustainable returns.</p>
                </div>
            </div>

            {/* Mission and Vision Section */}
            <div className="container-fluid bg-light p-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <h2>Our Mission</h2>
                            <p style={{ fontSize: "24px" }}>To empower homeowners and businesses with the knowledge and tools to transition to solar energy, fostering a sustainable lifestyle.</p>
                        </div>
                        <div className="col-md-6">
                            <h2>Our Vision</h2>
                            <p style={{ fontSize: "24px" }}>To make solar energy the economic fuel of choice, reducing Bahrain's dependency on non-renewable resources.</p>
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

export default About;
