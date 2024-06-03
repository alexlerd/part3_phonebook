const Filter = ({ id, type = "text", value, onChange, children }) => {
  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input id={id} type={type} value={value} onChange={onChange} />
    </>
  );
};

export default Filter;
