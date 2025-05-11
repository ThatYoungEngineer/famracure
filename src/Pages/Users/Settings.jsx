import React, { useEffect, useState } from "react";
import { Footer, Header, UserNavSettings } from "../../Components";
import { useSelector } from "react-redux";
import axiosClient from "../../AxiosClient";
import GetAuthUser from "../../hooks/GetAuthUser";

const Settings = () => {
  const UserData = useSelector((state) => state.authUser);
  const [UserAvatar, setUserAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [DataForm, setDataForm] = useState({
    id: 0,
    firstname: "",
    lastname: "",
    email: "",
    cin: "",
    user_avatar: "/img/Rectangle 4.jpg"
  });

  GetAuthUser();

  useEffect(() => {
    if (UserData.user) {
      setDataForm({
        id: UserData.user.id,
        firstname: UserData.user.firstname,
        lastname: UserData.user.lastname,
        email: UserData.user.email,
        date_of_birth: UserData.user.date_of_birth,
        age: UserData.user.age,
        gender: UserData.user.gender,
        cin: UserData.user.cin,
        user_avatar: UserData.user.user_avatar ? UserData.user.user_avatar : "/img/Rectangle 4.jpg"
      });
    }
  }, [UserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...DataForm, [name]: value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", DataForm.id);
    formData.append("firstname", DataForm.firstname);
    formData.append("lastname", DataForm.lastname);
    formData.append("email", DataForm.email);
    formData.append("cin", DataForm.cin);
    formData.append("gender", DataForm.gender);
    formData.append("date_of_birth", DataForm.date_of_birth);

    if (UserAvatar) {
      formData.append("user_avatar", UserAvatar);
    }

    axiosClient
      .post("/user/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => alert(res.data.message))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Header />
      <div className="_container my-8 flex flex-col lg:flex-row">
        {/* Sidebar - hidden on mobile, shown on tablet/desktop */}
        <div className="lg:w-1/4 mb-6 lg:mb-0">
          <UserNavSettings />
        </div>
        
        {/* Main Content */}
        <div className="w-full lg:w-3/4 px-4 lg:px-0">
          <form onSubmit={HandleSubmit}>
            {/* Profile Picture Section */}
            <div className="p-4 mb-6 bg-white rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-4">
                <img
                  className="w-28 h-28 rounded-lg object-cover"
                  src={preview ? preview : DataForm.user_avatar}
                  alt="Profile"
                />
                <div className="text-center sm:text-left">
                  <h3 className="mb-1 text-sm font-bold">Profile picture</h3>
                  <div className="mb-4 text-xs text-gray-500">
                    JPG, GIF or PNG. Max size of 800K
                  </div>
                  <div className="flex justify-center sm:justify-start">
                    <label className="inline-flex items-center px-3 py-2 text-xs text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 cursor-pointer transition-colors">
                      Upload picture
                      <input
                        className="hidden"
                        type="file"
                        name="user_avatar"
                        onChange={handleFile}
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="mt-6">
              <h3 className="mb-4 text-sm font-semibold">Personal Information:</h3>
              
              <div className="w-full lg:w-3/4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="mb-4">
                    <label htmlFor="FirstName" className="block mb-1 text-xs font-medium text-gray-900">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="FirstName"
                      name="firstname"
                      value={DataForm.firstname}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                      onChange={handleChange}
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="LastName" className="block mb-1 text-xs font-medium text-gray-900">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="LastName"
                      name="lastname"
                      value={DataForm.lastname}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="cin" className="block mb-1 text-xs font-medium text-gray-900">
                    National ID
                  </label>
                  <input
                    type="text"
                    id="cin"
                    name="cin"
                    value={DataForm.cin}
                    onChange={handleChange}
                    disabled
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2 cursor-not-allowed"
                    placeholder="National ID"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block mb-1 text-xs font-medium text-gray-900">
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={DataForm.email}
                    onChange={handleChange}
                    disabled
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2 cursor-not-allowed"
                    placeholder="example@gmail.com"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="date_of_birth" className="block mb-1 text-xs font-medium text-gray-900">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={DataForm.date_of_birth}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="age" className="block mb-1 text-xs font-medium text-gray-900">
                    Age
                  </label>
                  <input
                    type="text"
                    id="age"
                    name="age"
                    value={DataForm.age}
                    className="bg-gray-100 border border-gray-300 text-green-600 font-semibold text-sm rounded-lg block w-full p-2 cursor-not-allowed"
                    readOnly
                    disabled
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="gender" className="block mb-1 text-xs font-medium text-gray-900">
                    Gender
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    value={DataForm.gender}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  >
                    <option value="#" disabled>--Select Gender--</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="transgender">Transgender</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>

          {/* Delete Account Section */}
          <div className="mt-8 p-4 border-t border-gray-200">
            <h3 className="mb-2 text-sm font-semibold text-red-600">Delete Account:</h3>
            <p className="mb-4 text-sm text-gray-700">
              Do you want to delete the account? Please press below "Delete" button
            </p>
            <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Settings;