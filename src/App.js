import './App.css';
import React, { useState, useEffect } from 'react';
import ConverterDashboard from './Component/converterDashboard';
import './assets/scss/style.scss';
import CustomTable from "./Component/Table";
import constants from "./Constant";
import { requestParam } from './scripts/requestParameter';
import dimension from './scripts/dimension';

function App() {

  const [storedData, setStoredData] = useState([]);
  const [isShown, setShown] = useState(window.innerWidth > dimension.ipadWidth);

  // Updates the conditional flag used for changing the styling of element based on resolution
  const handleResize = () => {
    setShown(window.innerWidth > dimension.ipadWidth)
  }

  // This is used when screen is resized
  // For veritical and horizontal view
  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, [])

  // The below code would trigger after every 10000ms and fetches the updated data from the backend
  useEffect(() => {
    setInterval(() => {
      fetch(constants.SERVICE_BASE_URL + '/exchangedData', requestParam('POST', {}))
        .then(response => response.json())
        .then(response => {
          if (response.status === 200) {
            let updatedData = response.data;
            for (var i = 0; i < updatedData.length; i++) {
              if (updatedData[i].status === 'Live') {
                if (updatedData[i].price && updatedData[i].price !== undefined) {
                  var d = new Date(parseInt(String(updatedData[i].dateTime).padEnd(13, '0')))
                  updatedData[i].createdAt = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " +
                    d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0');
                  updatedData[i].amount = "$" + parseFloat(updatedData[i].price).toFixed(8);
                } else {
                  delete (updatedData[i]);
                }
              } else {
                var d = new Date(updatedData[i].createdAt);
                updatedData[i].createdAt = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " +
                  d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0');
                updatedData[i].amount = "$" + parseFloat(updatedData[i].amount.split(" ")[1]).toFixed(8);
              }
            }
            // Sorting the data
            // updatedData.sort(function (a, b) {
            //   return new Date(b.createdAt) - new Date(a.createdAt)
            // });
            setStoredData(updatedData);
          } else if (response.status === 403) {
            console.log(response.msg);
          }
        })
        .catch((e) => {
          throw new Error(`Request failed: ${e}`)
        });
    }, 10000);
  }, []);

  return (
    <div className={`App ${isShown ? 'mt-60' : 'mt-20'}`}>
      <header className="App-header w-100">
        <span className={`${isShown ? 'w-80' : 'w-85'} custom-heading text-align-left`}>Exchange</span>
      </header >
      <ConverterDashboard isShown={isShown} storedData={storedData} setStoredData={setStoredData} />
      <CustomTable isShown={isShown} storedData={storedData} setStoredData={setStoredData} />
    </div >
  );
}

export default App;
