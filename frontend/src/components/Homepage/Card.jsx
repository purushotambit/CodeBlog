import React from "react";
import { useNavigate } from "react-router-dom";
import { MDBCard } from "mdb-react-ui-kit";
const Card = ({ company }) => {
  const navigate = useNavigate();

  const handle = () => {
    navigate("/page", { state: company });
  };
  return (
    <>
      {company && (
        <MDBCard onClick={handle}>
          <div style={{ width: "400px", height: "400px" }}>
            <img
              style={{ width: "200px", height: "200px" }}
              src={company.img}
              alt={company.company}
            />
            <div className="company-info">
              <h3>{company.company}</h3>
              <p>{company.about}</p>
            </div>
          </div>
        </MDBCard>
      )}
    </>
  );
};

export default Card;
