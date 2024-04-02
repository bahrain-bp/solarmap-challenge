const About = () => {
    return (
        <div className="about-container">
            <section className="introduction">
                <h2>About Us</h2>
                <p>SolarMap is a startup that focuses on improving the energy sector using technology & AI. It solves the ever-growing problem of the lack of awareness when it comes to solar panel installations in terms of its cost as well as its return. SolarMap aims to educate the Bahraini population on the benefits of using renewable energy in hopes of building a more sustainable Bahrain.</p>
            </section>
            <section className="mission">
                <h2>Our Mission</h2>
                <p>Our mission is to empower homeowners and business owners with the knowledge necessary on how to transition to solar energy to make life more sustainable.</p>
            </section>
            <section className="vision">
                <h2>Our Vision</h2>
                <p>Our vision is a future where solar energy is the economical fuel which powers the country to reduce the dependency on non-renewable sources of energy.</p>
            </section>
            <section className="values">
                <h2>Our Values</h2>
                <ul>
                    <li>Integrity</li>
                    <li>Sustainability</li>
                    <li>Transparency</li>
                    <li>Customer Centric</li>
                    <li>Excellence</li>
                </ul>
            </section>
            <section className="solution">
                <h2>The Solution</h2>
                <p>The prototype will be developed in three months by using AWS (Amazon Web Services) cloud and innovative technologies that streamline the installation process of solar panels in Bahrain through an automated solution that is on-the-go and tailored to user’s needs and demands. It provides insightful user-specific information such as estimated costs ROI and the next steps to transition into solar energy.</p>
            </section>
            <section className="team">
                <h2>Team Members</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Husain Basem</td>
                            <td>System Architect</td>
                        </tr>
                        <tr>
                            <td>Suhaib Rajab</td>
                            <td>Business Analyst</td>
                        </tr>
                        <tr>
                            <td>Mahdi Alebrahim</td>
                            <td>Tech Lead</td>
                        </tr>
                        <tr>
                            <td>Sayed Qassim</td>
                            <td>Developer</td>
                        </tr>
                        <tr>
                            <td>Amira Alawadhi</td>
                            <td>Project Manager</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default About;
