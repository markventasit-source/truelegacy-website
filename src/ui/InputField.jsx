const InputField = ({ label, id, className = "", ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block mb-2 text-sm text-primary">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-md px-4 py-3 outline-none placeholder:text-secondary/70 ${className}`}
        {...props}
      />
    </div>
  );
};

export default InputField;
