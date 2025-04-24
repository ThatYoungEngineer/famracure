import React, { useEffect, useState } from "react";
import { Footer, Header, UserNavSettings } from "../../Components";
import { useSelector } from "react-redux";
import axiosClient from "../../AxiosClient";
import GetAuthUser from "../../hooks/GetAuthUser";

const Settings = () => {
  const UserData = useSelector((state) => state.authUser);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

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
      setPreview(URL.createObjectURL(file)); // ✅ Use 'file' directly
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
          "Content-Type": "multipart/form-data", // Ensures form-data format
        },
      })
      .then((res) => alert(res.data.message))
      .catch((err) => console.log(err));
  };


  return (
    <>
      <Header />
      <div className="_container my-8 flex ">
        <UserNavSettings />
        <div className=" w-[75%] ">
          <form onSubmit={HandleSubmit}>
            <div className=" ml-7   ">
              <div className="p-4 mb-4 bg-white   ">
                <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
                  <img
                    className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0"
                    src={preview ? preview : DataForm.user_avatar}
                    alt=""
                  />
                  <div>
                    <h3 className="mb-1  text-sm  font-bold">
                      Profile picture
                    </h3>
                    <div className="mb-4 text-[11px] text-gray-500 ">
                      JPG, GIF or PNG. Max size of 800K
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <label
                          className="inline-flex items-center px-3 py-2 text-[12px]  text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 "
                          htmlFor="DownloadFile"
                        >
                          Upload picture
                        </label>
                        <input
                          className=" hidden "
                          id="DownloadFile"
                          type="file"
                          name="user_avatar"
                          onChange={handleFile}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="  ml-16 ">
              <h3 className="mb-7  text-sm  ">Personal Information :</h3>

              <div className=" w-[55%] ">
                <div className="grid gap-6 mb-[20px] md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="FirstName"
                      className="block mb-1 text-[12px]  font-medium text-gray-900 dark:text-white"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="FirstName"
                      name="firstname"
                      value={DataForm.firstname}
                      className={
                        "bg-gray-50 border border-gray-300 text-gray-900 text-[14px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      }
                      onChange={handleChange}
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="LastName"
                      className="block mb-1 text-[12px]  font-medium text-gray-900 dark:text-white"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="LastName"
                      name="lastname"
                      value={DataForm.lastname}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-[14px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>
                <div className="mb-[20px]">
                  <label
                    htmlFor="cin"
                    className="block mb-1 text-[14px]  font-medium text-gray-900 dark:text-white"
                  >
                    National ID
                  </label>
                  <input
                    type="text"
                    id="cin"
                    name="cin"
                    value={DataForm.cin}
                    onChange={handleChange}
                    disabled
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full   py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="National ID "
                    required
                  />
                </div>
                <div className="mb-[20px]">
                  <label
                    htmlFor="email"
                    className="block mb-1 text-[14px]  font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={DataForm.email}
                    onChange={handleChange}
                    disabled
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full   py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="exemple@gmail.com"
                    required
                  />
                </div>
                <div className="mb-[20px]">
                  <label
                    htmlFor="date_of_birth"
                    className="block mb-1 text-[14px]  font-medium text-gray-900 dark:text-white"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={DataForm.date_of_birth}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full   py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="exemple@gmail.com"
                    required
                  />
                </div>
                <div className="mb-[20px]">
                  <label
                    htmlFor="age"
                    className="block mb-1 text-[14px]  font-medium text-gray-900 dark:text-white"
                  >
                    Age
                  </label>
                  <input
                    type="text"
                    id="age"
                    name="age"
                    value={DataForm.age}
                    className="text-green-600 font-semibold opacity-80 bg-gray-50 border border-gray-300 text-[12px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full   py-[4px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-not-allowed "
                    placeholder="exemple@gmail.com"
                    readOnly
                    disabled
                  />
                </div>
                <div className="mb-[20px]">
                  <label
                    htmlFor="gender"
                    className="block mb-1 text-[14px]  font-medium text-gray-900 dark:text-white"
                  >
                    Gender
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    value={DataForm.gender}
                    onChange={handleChange}
                    className={`bg-gray-50 !border text-xs rounded-lg block w-full py-2 px-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 border-gray-300 text-gray-900}`}
                  >
                    <option value="#" selected disabled  >--Select Gender--</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="transgender">Transgender</option>
                  </select>
                </div>
                <button className="inline-flex items-center px-3 py-2 text-[12px]  text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 ">
                  Save Changes
                </button>
              </div>
            </div>
          </form>
          <div className="  ml-16 mt-7 ">
            <h3 className="mb-2  text-sm  text-red-600 ">Delete Account :</h3>
            <p className=" mb-5 text-[16px] ">
              Do you want to delete the account? Please press below "Delete"
              button
            </p>
            <form className=" w-[55%] ">
              <button className="inline-flex items-center px-3 py-2 text-[12px]  text-center text-white rounded-lg bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 ">
                Delete Acount
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Settings;
