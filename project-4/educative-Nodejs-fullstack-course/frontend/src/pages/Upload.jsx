import React, { useState } from "react";
import UserService from "../services/user.service";
import Alert from "../components/Alert";
import Loader from "../components/Loader";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [filename, setFilename] = useState("");
  const [alertState, setAlertState] = useState({
    show: false,
    color: "green",
    msg: "",
  });
  const [processing, setProcessing] = useState(false);

  const handleUpload = (e) => {
    e.preventDefault();
    if (file === null || !description) {
      setAlertState({
        show: true,
        color: "red",
        msg: "You have to choose a file and write a description",
      });

      return;
    }
    setProcessing(true);
    const data = new FormData();
    data.append("file", file);
    data.append("name", file?.name || "filename");
    data.append("description", description);

    UserService.upload(data)
      .then((res) => {
        console.log(res);
        setProcessing(false);
        setAlertState({
          ...alertState,
          show: true,
          color: "green",
          msg: res.data.message || "File uploaded successfully",
        });
      })
      .catch((err) => {
        console.log(err);
        setProcessing(false);
        setAlertState({
          ...alertState,
          show: true,
          color: "red",
          msg: err.response.data || "Failed to upload the file",
        });
      });
  };

  return (
    <>
      <form
        onSubmit={handleUpload}
        className="m-10 flex flex-col items-center justify-center"
      >
        <div className="flex justify-center mt-10">
          {alertState.show ? (
            <Alert
              color={alertState.color}
              msg={alertState.msg}
              showAlert={alertState.show}
              setShowAlert={(value) =>
                setAlertState({ ...alertState, show: value })
              }
            />
          ) : null}
        </div>
        <label className="flex flex-col items-center justify-center h-full w-full border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
          <div className="flex flex-col items-center justify-center pt-7">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-60 h-60 text-gray-500 group-hover:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="pt-1 text-lg tracking-wider text-gray-500 group-hover:text-gray-600">
              {filename || "Upload a file"}
            </p>
          </div>
          </label>
          <input
            type="file"
            className="opacity-0"
            onChange={(e) => {
              setFile(e.target.files[0] || null);
              setFilename(e.target.files[0]?.name || "Upload a file");
            }}
          />
        

        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="mt-10 form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          rows="3"
          placeholder="File Description"
        ></textarea>

        <input
          type="submit"
          value="Upload"
          className="w-80 cursor-pointer mt-10 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        />
        <div className="flex justify-center mt-10">
          {processing ? <Loader /> : null}
        </div>
      </form>
    </>
  );
};

export default Upload;