import React, { useState } from "react";
import { Footer, Header } from "../Components";
import { useTranslation } from "react-i18next";

import ContactUsBanner from "../Components/ContactUsBanner";
import FooterTopBar from "../Components/FooterTopBar";
import axiosClient from "../AxiosClient";

export const ContactUs = () => {
  document.title = "DocAppoint";
  const { t } = useTranslation();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setSuccess("")
      setError("")
      setIsLoading(true)
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      const response = await axiosClient.post('/contact', data)
      const message = response?.data?.message
      if (message && response.status === 200 ) {
        setSuccess(message)
      }

    } catch (error) {
      console.log('error§', error)
      const message = error?.response?.data?.message
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
     {/* <TopBar/>  */}
      <Header />
<ContactUsBanner/>
      <div className="my-24 mx-auto md:px-6">
        <div className="flex justify-center">
          <div className="text-center md:max-w-xl lg:max-w-3xl">
            <h2 className="mb-12 px-6 text-3xl font-bold">
              {t("contact.contactUsTitle")}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap">
          <div className="mb-12 w-full md:p-3 lg:mb-0 lg:w-5/12 lg:px-6 shadow-xl rounded-md c-form"
          style={{
            position: 'relative',
            left:'32%',
          }}
          
          >
            <p></p>
            <form className="form-c" onSubmit={handleFormSubmit}>
              <div className="mb-6">
                <label htmlFor="exampleInputName">
                  {t("contact.nameLabel")}
                </label>
                <input
                  type="text"
                  name="name"
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  placeholder={t("contact.namePlaceholder")}
                />
              </div>

              <div className="relative mb-6">
                <label htmlFor="exampleInputEmail">
                  {t("contact.emailLabel")}
                </label>
                <input
                  type="email"
                  name="email"
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  placeholder={t("contact.emailPlaceholder")}
                />
              </div>

              <div className="relative mb-6">
                <label htmlFor="exampleFormControlTextarea1">
                  {t("contact.messageLabel")}
                </label>
                <textarea
                name="message"
                  className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                  placeholder={t("contact.messagePlaceholder")}
                  id="exampleFormControlTextarea1"
                  rows="3"
                ></textarea>
              </div>

              <button
                type="submit"
                className={` ${isLoading ? 'opacity-40' : 'opacity-100'} inline-blok w-full rounded bg-blue-300 px-6 pt-2.5 pb-2 text-xs font-medium uppercase`}
                disabled={isLoading}
              >
                { isLoading ? "Loading..." : t("contact.sendButton") }
              </button>
            </form>
            {(success || error) && 
              <section className='flex-1 flex items-center justify-end mt-10'>
                <div className={`flex-1 text-center px-4 py-2 rounded-lg mx-auto
                  ${error ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"}`}
                >
                  {error ? error : success}
                </div>
              </section>
            }
          </div>
        </div>
      </div>
   
      <FooterTopBar/>
      <Footer />
    </>
  );
};

export default ContactUs;
