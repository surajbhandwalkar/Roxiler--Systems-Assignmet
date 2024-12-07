import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './index.css'

const Statistics = (props) => {
  const [statistics, setStatistics] = useState({});
//  const [selectedMonth, setSelectedMonth] = useState('march');
const {selectedMonth} = props

//   useEffect(() => {
//     const getStatistics = async ()=>{
       
// //      const statistics = await axios.get(`http://localhost:3000/statistics?month=january?${selectedMonth}`)
//       const statistics = await axios.get(`http://localhost:3000/statistics?month=${selectedMonth}`);
  
//             setStatistics(statistics.data)
  
//     }

useEffect(() => {
  const getStatistics = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/statistics?month=z${selectedMonth}`);
      if (response && response.data) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setStatistics({}); // Optionally set to an empty object or some default values.
    }
  };
    

    getStatistics()
    
  }, [selectedMonth]);
  console.log(statistics)

  return (
    <div className='statistics-main-container'>
        <h2>Statistics - {selectedMonth}</h2>
        <div className='statitics-container'>
            <div className='element'><span>Total Sale</span> <span>{statistics.totalSaleAmountv||0}</span></div>
            <div className='element'><span>Total sold item</span> <span>{statistics.totalSoldItemsv||0}</span></div>
            <div className='element'><span>Total not sold item</span> <span>{statistics.totalNotSoldItemsv||0}</span></div>
        </div>
    </div>
  );
};

export default Statistics;
