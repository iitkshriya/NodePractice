import React, { useContext } from "react";
import { Context } from "../context";
import welcome from "../assets/welcome.png";

const Home = () => {
  const { state } = useContext(Context);
  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {`Welcome, ${state.user.firstName}!`}
          </h2>
          <p className="mt-6 text-center text-3xl text-gray-900">
            You can upload your content easily to manage your files
          </p>
          <img className="mx-auto w-auto my-12" src={welcome} alt="Workflow" />
        </div>
      </div>
    </>
  );
};

export default Home;