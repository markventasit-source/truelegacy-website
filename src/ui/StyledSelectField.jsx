const StyledSelectField = ({ label, options = [], className = "", ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm text-primary">
          {label}
        </label>
      )}
      <select
        className={`w-full rounded-md px-4 py-3 border border-black/15 outline-none bg-white ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StyledSelectField;
