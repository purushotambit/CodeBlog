import React from "react";
import { useLocation } from "react-router-dom";
import Comments from "../comments/Comments";
import { MDBCard } from "mdb-react-ui-kit";
const Page = () => {
  const company = useLocation().state;
  return (
    <div className="body" style={{ marginLeft: "10px" }}>
      {company && (
        <MDBCard>
          <div>
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
      <Comments pageId={company.pageId} />
    </div>
  );
};

export default Page;
