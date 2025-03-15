import React, { useState } from "react";
import axiosClient from "../../../AxiosClient";

const ProfileUploadImg = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("/img/Rectangle 4.jpg"); // Default profile picture

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Show image preview
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("user_avatar", selectedFile);

    try {
      const res = await axiosClient.post("/doctor/update/info", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload successful:", res.data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="col-span-full xl:col-auto">
      <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
          {/* Display Selected Image Preview */}
          <img className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0" src={preview} alt="Profile" />

          <div>
            <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
              Profile picture
            </h3>
            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              JPG, GIF, or PNG. Max size: 800KB
            </div>

            {/* File Input */}
            <input
              id="fileInput"
              type="file"
              accept="image/png, image/jpeg, image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="fileInput"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
            >
              Choose Image
            </label>

            {/* Upload Button */}
            <button
              className="ml-4 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              onClick={handleUpload}
            >
              Upload Picture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUploadImg;
