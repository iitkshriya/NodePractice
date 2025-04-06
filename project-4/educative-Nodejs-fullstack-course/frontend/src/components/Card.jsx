import React, { useState } from "react";
import UserService from "../services/user.service";
import UpdateForm from "./UpdateForm";

const Card = ({ file, fetchFiles }) => {
  const [openUpdate, setOpenUpdate] = useState(false);

  const handleDelete = () => {
    UserService.deleteFile(file._id)
      .then((res) => {
        console.log(res);
        fetchFiles();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  return (
    <>
      <UpdateForm
        open={openUpdate}
        setOpen={setOpenUpdate}
        file={file}
        fetchFiles={fetchFiles}
      />
      <div className="max-w-sm rounded overflow-hidden shadow-lg border-2">
        <iframe
          style={{ height: "20rem" }}
          className="w-full"
          src={file.filePath}
          title={file.name}
        ></iframe>
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{file.name}</div>
          <p className="text-gray-700 text-base">{file.description}</p>
        </div>

        <div class="inline-flex px-6 pb-3">
          <a
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-l"
            href={file.filePath}
            download={file.name}
            target="_blank"
            rel="noreferrer"
          >
            Download
          </a>
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
            onClick={() => {
              setOpenUpdate(true);
            }}
          >
            Edit
          </button>
          <button
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-r"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default Card;