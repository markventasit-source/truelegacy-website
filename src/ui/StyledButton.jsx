const StyledButton = ({
  name,
  onClick,
  variant = "primary",
  disabled = false,
  minWidth = "120px",
  className = "",
  style = {},
}) => {
  const variants = {
    primary: {
      base: "bg-[#F4D57E] text-[#15302D] font-medium",
      hover: "before:bg-[#15302D] hover:text-[#F4D57E]",
    },
    secondary: {
      base: "border border-[#FFFFFF] bg-transparent text-[#FFFFFF] font-medium",
      hover: "before:bg-[#FFFFFF] hover:text-[#15302D]",
    },
    tertiary: {
      base: "border border-yellow bg-transparent text-yellow font-medium",
      hover: "before:bg-yellow hover:text-[#15302D]",
    },
    quaternary: {
      base: "bg-transparent text-[#132F2C] font-medium",
      hover: "before:bg-[#132F2C] hover:text-[#F4D57E]",
    },
    quinary: {
      base: "bg-[#F9F9F9] text-[#000] font-medium",
      hover: "before:bg-[#000] hover:text-[#F9F9F9]",
    },
    senary: {
      base: "bg-[#1C4D4D] text-[#F4D57E] font-medium",
      hover: "before:bg-[#F4D57E] hover:text-[#1C4D4D]",
    },
    navbar: {
      base: "bg-green text-yellow font-medium",
      hover:
        "before:bg-gradient-to-r before:from-[#FFCD42] before:to-[#F4D57E] hover:text-green",
    },
    home: {
      base: "bg-gradient-to-r from-[#FFCD42] to-[#F4D57E] text-green font-bold",
      hover: "before:bg-green hover:text-[#F4D57E]",
    },
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`relative overflow-hidden w-auto text-base px-5 py-3 flex items-center justify-center gap-2 transition-colors duration-500 transition-transform ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F4D57E] ${
        variants[variant].base
      } ${
        !disabled
          ? `${variants[variant].hover} before:absolute before:inset-0 before:w-0 before:transition-all before:duration-500 before:ease-out hover:before:w-full before:z-0 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] active:translate-y-0 active:scale-[0.99]`
          : ""
      } ${
        disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
      } ${className}`}
      style={{ minWidth, ...style }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {name}
      </span>
    </button>
  );
};

export default StyledButton;

