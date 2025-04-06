import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import UserService from "../services/user.service";

const View = () => {
  const [files, setFiles] = useState([]);
  const fetchFiles = () => {
    UserService.getFiles()
      .then((res) => {
        console.log(res.data.data);
        setFiles([...res.data.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchFiles();
  }, []);
  return (
    <>
      <div className="grid grid-cols-3 gap-4 m-10">
        {files.map((file) => {
          return <Card file={file} fetchFiles={fetchFiles} />;
        })}
      </div>
    </>
  );
};

export default View;