import { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";

const VARIANT_STYLES = {
  dark: {
    containerClass: "tl-phone-input tl-phone-input--dark",
    inputClass: "tl-phone-input__input tl-phone-input__input--dark",
    buttonClass: "tl-phone-input__button tl-phone-input__button--dark",
    dropdownClass: "tl-phone-input__dropdown",
  },
  light: {
    containerClass: "tl-phone-input tl-phone-input--light",
    inputClass: "tl-phone-input__input tl-phone-input__input--light",
    buttonClass: "tl-phone-input__button tl-phone-input__button--light",
    dropdownClass: "tl-phone-input__dropdown",
  },
  modal: {
    containerClass: "tl-phone-input tl-phone-input--modal",
    inputClass: "tl-phone-input__input tl-phone-input__input--modal",
    buttonClass: "tl-phone-input__button tl-phone-input__button--modal",
    dropdownClass: "tl-phone-input__dropdown",
  },
};

const formatPhoneValue = (value) => (value ? `+${value}` : "");

const PhoneInputField = ({
  name = "phone",
  variant = "light",
  placeholder = "Enter phone number",
  required = false,
  disabled = false,
  value,
  onChange,
  id,
}) => {
  const containerRef = useRef(null);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState("");
  const phoneValue = isControlled ? value : internalValue;
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.light;

  useEffect(() => {
    import("react-phone-input-2/lib/style.css");
  }, []);

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    if (!form || isControlled) return;

    const handleReset = () => setInternalValue("");
    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, [isControlled]);

  const handleChange = (nextValue) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(formatPhoneValue(nextValue), nextValue);
  };

  return (
    <div ref={containerRef}>
      <PhoneInput
        country="in"
        value={phoneValue}
        onChange={handleChange}
        enableSearch
        countryCodeEditable={false}
        preferredCountries={["in", "ae", "sa", "us", "gb", "sg"]}
        placeholder={placeholder}
        disabled={disabled}
        inputProps={{
          id,
          required,
          autoComplete: "tel",
        }}
        containerClass={styles.containerClass}
        inputClass={styles.inputClass}
        buttonClass={styles.buttonClass}
        dropdownClass={styles.dropdownClass}
        searchClass="tl-phone-input__search"
      />
      <input type="hidden" name={name} value={formatPhoneValue(phoneValue)} />
    </div>
  );
};

export default PhoneInputField;
