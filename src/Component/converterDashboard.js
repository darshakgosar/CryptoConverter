import React, { useState, useEffect } from 'react';
import CustomForm from "./FormElements";
import constants from "../Constant";
import { requestParam } from '../scripts/requestParameter';

const ConverterDashboard = (props) => {

    const [inputs, setInputs] = useState({});
    const [amount, setAmount] = useState({});
    const [errorMessages, setErrorMessages] = useState({});

    // Saving user choosen exchanged data
    const handleSave = (e) => {
        e.preventDefault();
        inputs.amount = amount;
        let body = inputs;
        if (inputs.quantity > 0) {
            fetch(constants.SERVICE_BASE_URL + '/storeCurrencyData', requestParam('POST', body))
                .then(response => response.json())
                .then(response => {
                    if (response.status === 200) {
                        var d = new Date(parseInt(String(response.data.createdAt).padEnd(13, '0')))
                        response.data.createdAt = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " +
                            d.getHours() + ":" + d.getMinutes();
                        props.storedData.push(response.data);
                        inputs.quantity = "";
                    } else if (response.status === 403) {
                        console.log(response.msg);
                    }
                })
                .catch((e) => {
                    throw new Error(`Request failed: ${e}`)
                });
        } else {
            setErrorMessages({ name: "quantity", message: 'Please Enter Quantity' });
        }
    }

    return (
        <CustomForm
            handleSave={handleSave}
            inputs={inputs}
            setInputs={setInputs}
            setAmount={setAmount}
            errorMessages={errorMessages}
            setErrorMessages={setErrorMessages}
            isShown={props.isShown} />
    );
}

export default ConverterDashboard;
