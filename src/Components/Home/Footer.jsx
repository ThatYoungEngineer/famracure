import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-400 text-gray-800 py-8">
            <div className="container mx-auto flex justify-between">
                <div className="w-1/4">
                    <div className="flex items-center mb-4">
                        <img src={"/img/footer-logo.png"} />
                    </div>
                    <p className="text-sm mb-4">
                        Book appointments with the best Doctors <br></br>and Specialists such as Gynecologists,<br></br> 
                        Skin Specialists, Child Specialists, <br></br>Surgeons, etc. in Pakistan conveniently.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                    </div>
                </div>
                <div className="w-1/4">
                    <h3 className="font-bold mb-2">Cities</h3>
                    <ul className="text-sm space-y-1">
                        <li>Karachi</li>
                        <li>Lahore</li>
                        <li>Islamabad</li>
                        <li>Rawalpindi</li>
                        <li>Multan</li>
                        <li>Peshawar</li>
                        <li>Gujranwala</li>
                    </ul>
                </div>
                <div className="w-1/4">
                    <h3 className="font-bold mb-2">Specialties</h3>
                    <ul className="text-sm space-y-1">
                        <li>Child specialist</li>
                        <li>ENT specialist</li>
                        <li>Gynecologists</li>
                        <li>Dentists</li>
                        <li>Dermatologists</li>
                        <li>Eye specialist</li>
                        <li>Dietitian/Nutrition</li>
                    </ul>
                </div>
                <div className="w-1/4">
                    <h3 className="font-bold mb-2">Company</h3>
                    <ul className="text-sm space-y-1">
                        <li>Refund Policy</li>
                        <li>Payment Terms</li>
                        <li>Cancellations Policy</li>
                        <li>Terms of Use</li>
                        <li>About Us</li>
                        <li>Contact Us</li>
                        <li>Careers</li>
                    </ul>
                </div>
            </div>
            <div className="bg-gray-500 text-center py-4 mt-8">
                <p className="text-sm text-gray-800">© 2024 Famra Cure. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
