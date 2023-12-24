import React, { useEffect, useState } from "react";

import companiesData from "../../data/data";
import Card from "./Card";
import "./HomePage.css";
const HomePage = () => {
  const [companies, setCompanies] = useState([]);

  const fetchData = () => {
    setCompanies(companiesData.companies);
    console.log(companiesData.companies);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="heading-container">
        <h3 style={{ fontFamily: "Roboto, sans-serif" }}>
          Click on Any of the Coding Platforms
        </h3>
      </div>

      <div className="companies-container">
        {companies.length >= 0 &&
          companies.map((company) => (
            <Card key={company.company} company={company} />
          ))}
      </div>
    </>
  );
};

export default HomePage;
