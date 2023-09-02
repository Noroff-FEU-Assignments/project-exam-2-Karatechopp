import PropTypes from "prop-types";

function DisplayMessage({ messageType, children }) {
  return <div className={messageType}>{children}</div>;
}

DisplayMessage.propTypes = {
  message: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default DisplayMessage;
