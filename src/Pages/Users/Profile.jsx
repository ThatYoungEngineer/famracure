import { Footer, Header, UserNavSettings } from "../../Components";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../AxiosClient";
import { logout } from "../../Redux/SliceAuthUser";
import { useNavigate } from "react-router";
import { remove } from "../../Services/LocalStorageService";
import GetAuthUser from "../../hooks/GetAuthUser";
import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const Profile = () => {
  const UserData = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  GetAuthUser();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close mobile nav when resizing to desktop
      if (window.innerWidth >= 768) {
        setMobileNavOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const HandleLogout = () => {
    axiosClient
      .post("/user/logout")
      .then((res) => {
        if (res.data.success && res.status === 200) {
          dispatch(logout());
          remove("TOKEN_USER");
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const isMobile = windowWidth < 768;

  return (
    <>
      <Header />
      <div className="_container my-8 flex flex-col md:flex-row">
        {/* Mobile Nav Toggle Button */}
        {isMobile && (
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 mb-4 text-gray-500 rounded-lg hover:bg-gray-100"
          >
            {mobileNavOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
            <span className="sr-only">Toggle navigation</span>
          </button>
        )}

        {/* Navigation - Always rendered but shown/hidden based on screen size */}
        <div className={`${isMobile ? (mobileNavOpen ? 'block' : 'hidden') : 'block'} md:w-[25%] lg:w-[20%]`}>
          <UserNavSettings />
        </div>

        {/* Main Content */}
        <div className={`w-full ${!isMobile ? 'md:w-[75%] lg:w-[80%]' : ''} flex justify-center`}>
          {UserData.user && (
            <div className={`w-full ${isMobile ? 'px-4' : 'md:w-[75%] lg:w-[50%]'} mx-auto`}>
              {/* Rest of your profile content... */}
              <div className="border-x border-t rounded-sm flex justify-center">
                <div className="text-center p-4">
                  <img
                    className="mb-4 mt-4 md:mt-9 rounded-lg w-24 h-24 md:w-28 md:h-28"
                    src={UserData?.user?.user_avatar || "/img/Rectangle 4.jpg"}
                    alt="User avatar"
                  />
                  <h3 className="mt-4 font-[600] mb-5 text-[16px]">
                    {UserData.user.firstname} {UserData.user.lastname}
                  </h3>
                </div>
              </div>
              <div className="border p-4 md:p-8">
                <div className="space-y-2">
                  {UserData.user.phoneNumber && (
                    <p className="text-[15px]">
                      <span className="font-semibold">Phone No:</span> {UserData.user.phoneNumber}
                    </p>
                  )}
                  <p className="text-[15px]">
                    <span className="font-semibold">CIN:</span> {UserData.user.cin}
                  </p>
                  <p className="text-[15px]">
                    <span className="font-semibold">Email:</span> {UserData.user.email}
                  </p>
                </div>
                <div className="mt-4 md:mt-6 text-center md:text-left">
                  <button
                    onClick={HandleLogout}
                    type="button"
                    className="text-white text-[13px] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-4 py-2 focus:outline-none w-full md:w-auto"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;