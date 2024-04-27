import EduRes from "../assets/Educationalresources.jpg";

const Terms = () => {
    return (
        <>
            {/* Hero Image with Text Overlay */}
            <div id="aboutHero" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                    <img className="d-block w-100" alt="Educational Resources" style={{ height: "500px" }} src={EduRes}/>
                        <div className="carousel-caption d-none d-md-block">
                            <h1 className="display-2" style={{ textShadow: '2px 4px 5px rgba(0,0,0,0.6)' }}>Terms of Service</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Jumbotron */}
            <div className="container-fluid">
                <div className="row jumbotron">
                    <h2 className="display-4">Our Terms</h2>
                    <p className="lead" style={{ fontSize: "32px" }}>Welcome to our platform! By accessing or using our services, you agree to abide by the following Terms of Service. These terms govern your use of our website, applications, and any related services provided by us. Please read these terms carefully before accessing or using our services. If you do not agree with any part of these terms, you may not access or use our services. Your use of our services indicates your acceptance of these terms and any updates or modifications that may be made to them from time to time. Thank you for choosing us!</p>
                </div>
            </div>

            {/* Mission and Vision Section */}
            <div className="container-fluid bg-light p-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <h2>Privacy Policy</h2>
                            <p style={{ fontSize: "24px" }}>Your privacy is important to us. Our Privacy Policy outlines how we collect, use, and disclose your personal information when you use our services. By accessing or using our platform, you agree to the terms outlined in our Privacy Policy. 
In addition, we reserve the right to update or modify our guidelines at any time, and your continued use of our platform constitutes acceptance of any such changes.</p>
                        </div>
                        <div className="col-md-6">
                            <h2>User Conduct</h2>
                            <p style={{ fontSize: "24px" }}>We aim to foster a positive and inclusive community within our platform. By accessing our services, you agree to engage in conduct that is respectful, lawful, and considerate towards others. Any behavior deemed inappropriate, including but not limited to harassment, discrimination, or misuse of our platform, may result in restriction of access or other measures as deemed necessary by us.</p>
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

export default Terms;
