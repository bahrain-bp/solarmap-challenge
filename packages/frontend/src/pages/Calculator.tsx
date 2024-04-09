import 'bootstrap/dist/css/bootstrap.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function Calculator() {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d135879.49791094012!2d50.53494783320151!3d26.20639097685625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e48524e6a47a211%3A0x2e9450e2dbda1046!2sBahrain!5e1!3m2!1sen!2sbh!4v1712604671178!5m2!1sen!2sbh"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps Embed"
                ></iframe>
            </div>
            <div>
                <div style={{
                    display: 'block',
                    width: "500px",
                    paddingLeft: '10%',
                    marginLeft: 'auto'
                }}>
                    <h4>Please enter your details</h4>
                    <Form>
                        <Form.Group>
                            <Form.Control type="text"
                                placeholder="Enter your full name" style={{ width: '75%', marginBottom:'2%' }} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Control type="email"
                                placeholder="Enter your your email address" style={{ width: '75%', marginBottom:'2%' }} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Control type="number" placeholder="Enter your load" style={{ width: '75%', marginBottom:'2%' }} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Control type="number" placeholder="Enter your Kilowatts" style={{ width: '75%', marginBottom:'2%' }} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Control type="number" placeholder="Enter your dimensions ex. (25x27x25x25)" style={{ width: '75%', marginBottom:'2%' }} />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Click here to submit form
                        </Button>
                    </Form>
                </div>
            </div>

        </div>


    );
}