import React from 'react';
import '../Assets/Css/HomeCss/CustomerLove.css'; // Adjust the path if necessary

const CustomerLove = () => {
    return (
        <section className="customer-love">
            <div className="container">
                <h2>What Our Customers Say</h2>
                <div className="testimonials-container">
                    <div className="testimonial">
                        <p>"Great service! The team was professional and the product quality exceeded my expectations."</p>
                        <h4>John Doe</h4>
                        <img src="/img/5.png" alt="Customer 3" className="customer-img" />
                    </div>
                    <div className="testimonial">
                        <p>"I am thrilled with the results! The customer support was outstanding, and the final product is fantastic."</p>
                        <h4>Jane Smith</h4>
                        <img src="/img/5.png" alt="Customer 3" className="customer-img" />

                    </div>
                    <div className="testimonial">
                        <p>"Excellent experience from start to finish. The team was attentive and the delivery was on time."</p>
                        <h4>Emily Johnson</h4>
                        <img src="/img/5.png" alt="Customer 3" className="customer-img" />

                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomerLove;
