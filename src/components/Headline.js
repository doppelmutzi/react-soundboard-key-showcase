import React, { useContext } from "react";
import PropTypes from "prop-types";

import "./Headline.scss";
import AppContext from "../AppContext";

const Headline = ({ children }) => {
  const { darkMode } = useContext(AppContext);
  return (
    <div className={`headline ${darkMode && "dark-mode"}`}>
      <h1>{children}</h1>
    </div>
  );
};
export default Headline;

Headline.propTypes = {
  children: PropTypes.node.isRequired,
};
