import React from "react";
import { Link } from "react-router";

const Signup = () => {
  return (
    <section className="bg-surface dark:bg-dark">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        {/* <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Flowbite
        </a> */}
        <div className="w-full bg-light rounded-md shadow dark:border-second_dark md:mt-0 sm:max-w-md xl:p-0 dark:bg-second_dark/40">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-light">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-dark dark:text-white">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-light dark:bg-second_dark border outline-gray-300  text-gray-900 rounded-lg outline-2 focus:outline-orange-500  block w-full p-2.5 dark:border-none dark:placeholder-gray-500 dark:text-white"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-light dark:bg-second_dark border outline-gray-300  text-gray-900 rounded-lg outline-2 focus:outline-orange-500  block w-full p-2.5 dark:border-none dark:placeholder-gray-500 dark:text-white"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Confirm password
                </label>
                <input
                  type="confirm-password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="bg-light dark:bg-second_dark border outline-gray-300  text-gray-900 rounded-lg outline-2 focus:outline-orange-500  block w-full p-2.5 dark:border-none dark:placeholder-gray-500 dark:text-white"
                  required
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required=""
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-light">
                    I accept the{" "}
                    <a
                      className="font-medium text-gray-500 hover:underline dark:text-light"
                      href="#">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-light bg-orange-500 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Create an account
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-light">
                Already have an account?{" "}
                <Link
                  to={"/login"}
                  className="font-medium text-gray-500 hover:underline dark:text-light">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
