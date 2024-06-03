const Notification = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div style={{
      color: "red",
      fontStyle: "bold",
      fontSize: 16,
      border: "1px solid red",
      padding: "8px",
      borderRadius: "4px",
      opacity: message ? 1 : 0,
      display: message ? "block" : "none",
    }}>
      {message}
    </div>
  );
};

export default Notification;