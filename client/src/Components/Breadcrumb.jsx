import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  let pathnames = location.pathname.split("/").filter(x => x);

  // Ignore values with numeric IDs at the end
  const isNumericID = str => /^\d+$/.test(str);

  if (pathnames.length > 0 && isNumericID(pathnames[pathnames.length - 1])) {
    pathnames.pop();
  }

  return (
    <nav
      aria-label="breadcrumb"
      style={{ marginLeft: "1rem", marginRight: "1rem" }}
    >
      <ol
        className="breadcrumb"
        style={{
          fontSize: "18px",
          margin: "20px 0",
          paddingLeft: "15px",
          paddingRight: "15px",
          borderRadius: "4px",
          backgroundColor: "#f8f9fa",
        }}
      >
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li
              className={`breadcrumb-item ${isLast ? "active" : ""}`}
              style={{ fontSize: "18px" }}
              key={routeTo}
            >
              {isLast ? (
                name
              ) : (
                <Link
                  to={routeTo}
                  style={{ color: "#5a8dee", textDecoration: "none" }}
                >
                  {name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
