/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Alert from "../components/Alert";
import Loader from "../components/Loader";

import AuthService from "../services/auth.service";

const Confirmation = () => {
  const { confirmationToken } = useParams();
  const [processing, setProcessing] = useState(true);
  const [alertState, setAlertState] = useState({
    show: false,
    color: "green",
    msg: "",
  });

  useEffect(() => {
    AuthService.verify(confirmationToken)
      .then((res) => {
        setAlertState({
          show: true,
          color: "green",
          msg: res.data.message,
        });
        setProcessing(false);
      })
      .catch((err) => {
        setAlertState({
          show: true,
          color: "red",
          msg: "Failed to verify your email",
        });
        setProcessing(false);

        console.error(err);
      });
  }, []);
  return (
    <>
      <div className="flex h-screen">
        <div className="m-auto">
          {processing ? <Loader /> : null}
          {alertState.show ? (
            <Alert color={alertState.color} msg={alertState.msg} />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Confirmation;