
const Footer = () => {
    return (
        <footer className="bg-gray-400 text-gray-800 py-8 overflow-hidden">
            <div className="container max-w-screen-xl mx-auto px-4 flex flex-wrap justify-between">
                <div className="w-full sm:w-1/2 md:w-1/4 mb-6 md:mb-0">
                    <div className="flex items-center mb-4">
                        <img src={"/img/footer-logo.png"} alt="Footer Logo" />
                    </div>
                    <p className="text-sm mb-4">
                        Book appointments with the best Doctors <br />
                        and Specialists such as Gynecologists, <br />
                        Skin Specialists, Child Specialists, <br />
                        Surgeons, etc. in Pakistan conveniently.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                    </div>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/4 mb-6 md:mb-0">
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
                <div className="w-full sm:w-1/2 md:w-1/4 mb-6 md:mb-0">
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
                <div className="w-full sm:w-1/2 md:w-1/4">
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
