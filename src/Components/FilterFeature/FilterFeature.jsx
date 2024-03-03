import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./FilterFeature.module.css";
import * as XLSX from "xlsx";
import BankData from "../BankData/BankData";

const FilterFeature = () => {
  const initialData = [
    { date: "2023-01-01", name: "John Doe", amount: 100.0 },
    { date: "2023-01-02", name: "Jane Smith", amount: 150.5 },
    { date: "2023-01-03", name: "Bob Johnson", amount: 75.2 },
    { date: "2023-02-05", name: "Alice Lee", amount: 200.75 },
    { date: "2023-02-10", name: "Mark Davis", amount: 120.3 },
    { date: "2023-02-15", name: "Emily White", amount: 80.5 },
    { date: "2023-03-03", name: "Chris Brown", amount: 300.25 },
    { date: "2023-03-08", name: "Sarah Miller", amount: 50.75 },
    { date: "2023-03-15", name: "David Wilson", amount: 180.9 },
    { date: "2023-03-21", name: "David Wilson", amount: 380.6 },
  ];

  const formattedData = initialData.map((item) => {
    const [year, month, day] = item.date.split("-");
    const formattedDate = `${month}-${day}-${year}`;
    return { ...item, date: formattedDate };
  });

  const [filteredData, setFilteredData] = useState(initialData);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [amountRangeFilter, setAmountRangeFilter] = useState({
    min: null,
    max: null,
  });

  const handleFilter = () => {
    const startDateObj = startDate ? new Date(startDate) : null;
    const endDateObj = endDate ? new Date(endDate) : null;

    const filtered = formattedData.filter((item) => {
      const itemDate = new Date(item.date);
      const nameMatches = item.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const amountInRange =
        (!amountRangeFilter.min || item.amount >= amountRangeFilter.min) &&
        (!amountRangeFilter.max || item.amount <= amountRangeFilter.max);

      const dateInRange =
        !startDateObj ||
        !endDateObj ||
        (itemDate >= startDateObj && itemDate <= endDateObj);
      return nameMatches && amountInRange && dateInRange;
    });

    setFilteredData(filtered);
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Filtered Data");
    XLSX.writeFile(wb, "filtered_data.xlsx");
  };

  function onChangeHandler(value) {
    setStartDate(value[0]);
    setEndDate(value[1]);
  }

  function clearAll (){
    setStartDate(null)
    setEndDate(null)
    setNameFilter("")
    setAmountRangeFilter({
      min: null,
      max: null,
    })

    setFilteredData(formattedData)
    
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.FilterContainer}>
          {/* Date Filter */}
          <DatePicker
          className={styles.dateselect}
            selectsRange={true}
            onChange={onChangeHandler}
            startDate={startDate}
            endDate={endDate}
            placeholderText="Select Date"
          />

          {/* Name Filter */}
          <input
            type="text"
            placeholder="Filter by name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />

          {/* Amount Range Filter */}
          <div>
            <label>Min Amount:</label>
            <input
              type="number"
              value={amountRangeFilter.min || ""}
              onChange={(e) =>
                setAmountRangeFilter({
                  ...amountRangeFilter,
                  min: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
            />
          </div>
          <div>
            <label>Max Amount:</label>
            <input
              type="number"
              value={amountRangeFilter.max || ""}
              onChange={(e) =>
                setAmountRangeFilter({
                  ...amountRangeFilter,
                  max: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
            />
          </div>

          <button onClick={handleFilter}>Filter</button>
          <button onClick={handleExport}>Export</button>
        </div>
        <div className={styles.datawrapper}>
          {/* {filteredData.map((item, index) => (
          <div key={index} className={styles.data}>
            <h5>{item.name}</h5>
            <h5>{item.amount}</h5>
            <h5>{item.date}</h5>
          </div>
        ))} */}

          <BankData data={filteredData} />
        </div>
        <div className={styles.clearAll}>
          <button onClick={clearAll}>Clear All</button>
        </div>
      </div>
    </div>
  );
};

export default FilterFeature;
