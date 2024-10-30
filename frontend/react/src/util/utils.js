import {toast} from "react-toastify";
import React from "react";

export const transactionSuccess = (receipt) => {
  toast.success(<span>Transaction sent: <br/> {receipt.transactionHash}</span>);
};

export const showWarning = (warning) => {
  toast.warn(<span>{warning.toString()}</span>);
};

export const showError = (error) => {
  toast.error(<span>{error.toString()}</span>);
};

export const callWithGasEstimateAndErrorHandling = async (
  {
    callback,
    from,
    value = 0,
    onError = () => void 0,
  }
) => {
  return callback.estimateGas({from: from, value: value})
    .then(result => {
      callback.send({from: from, value: value, gas: result})
        .then((receipt) => {
          transactionSuccess(receipt);
        })
        .catch(error => {
          showError(error);
          onError();
        });
    })
    .catch(error => {
      showError(error);
      onError();
    });
};