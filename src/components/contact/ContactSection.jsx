import { useEffect, useRef, useState } from "react";
import { createEnquiry } from "../../api/enquiryApi";
import PhoneInputField from "../../ui/PhoneInputField";
import ContactImage from "../../assets/img/contac_form 1.webp";
import MailIcon from "../../assets/icon/mail-edit-01.webp";
import PhoneIcon from "../../assets/icon/calling.webp";
import LocationIcon from "../../assets/icon/location-03.webp";

const ContactSection = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Scroll-triggered entrance
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const form = e.target;

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim(),
      type: "contact",
      source: "website",
    };

    if (!payload.name || !payload.email || !payload.phone || !payload.message) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      await createEnquiry(payload);
      setSuccessMessage("Thank you! Your message has been sent.");
      form.reset();
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
      // Optional: log real error for debugging
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`relative pt-6 lg:pt-10 pb-34 lg:pb-35 bg-[#ffffff] contact-section ${isVisible ? "contact-section-visible" : ""
        }`}
    >
      <div
        className="absolute top-122 left-1/2 w-screen h-[870px] -translate-x-1/2 hidden lg:block"
        style={{
          background: "#F6FFFF",
        }}
      />
      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Top heading */}
        <div className="text-center mb-10 lg:mb-12 contact-heading max-w-[1600px] mx-auto">
          <h2 className="font-[Urania] text-[#132F2C] font-bold
                         text-[32px] lg:text-[36px] leading-[32px] lg:leading-[40px] mb-3">
            Let's Connect
          </h2>
          <p className="font-[Urania] text-[#132F2C]
                         text-[16px] lg:text-[16px]
                         leading-[22px] lg:leading-[22px]
                         max-w-[260px] mx-auto lg:max-w-none">
            We look forward to learning about your Legacy and Succession goals.
          </p>
        </div>

        {/* Contact info row */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_0.8fr_1.1fr] gap-4 lg:gap-0 mb-8 lg:mb-12 contact-info lg:px-0">
          {/* Email */}
          <div className="flex flex-col items-center lg:flex-row lg:items-center gap-3 lg:gap-3 contact-item">
            <div className="w-[67px] h-[67px] lg:w-[79px] lg:h-[79px] rounded-full bg-[#F4D57E] flex-none flex items-center justify-center">
              <img src={MailIcon} alt="Email" className="w-[24px] h-[24px] lg:w-[28px] lg:h-[28px]"
  loading="lazy"
  decoding="async"
  />
            </div>
            <div className="text-center lg:text-left mt-1 lg:mt-0">
              <p className="font-[Urania] text-[14px] leading-[16px] text-[#868989] mb-1">
                Email
              </p>
              <p className="font-[Urania] text-[16px] lg:text-[16px] leading-[28px] text-[#132F2C]">
                <a
                  href="mailto:info@truelegacy.in"
                  className="hover:underline"
                >
                  info@truelegacy.in
                </a>
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col items-center lg:flex-row lg:items-center gap-3 lg:gap-4 contact-item">
            <div className="w-[67px] h-[67px] lg:w-[79px] lg:h-[79px] rounded-full bg-[#F4D57E] flex-none flex items-center justify-center">
              <img src={PhoneIcon} alt="Phone" className="w-[24px] h-[24px] lg:w-[28px] lg:h-[28px]"
  loading="lazy"
  decoding="async"
  />
            </div>
            <div className="text-center lg:text-left mt-1 lg:mt-0">
              <p className="font-[Urania] text-[14px] leading-[16px] text-[#868989] mb-1">
                Phone
              </p>
              <p className="font-[Urania] text-[16px] lg:text-[18px] leading-[28px] text-[#132F2C]">
                <a
                  href="tel:+917592912300"
                  className="hover:underline"
                >
                  +91 7592 912 300 (IND)
                </a>
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col items-center lg:flex-row lg:items-center gap-3 lg:gap-4 contact-item">
            <div className="w-[67px] h-[67px] lg:w-[79px] lg:h-[79px] rounded-full bg-[#F4D57E] flex-none flex items-center justify-center">
              <img src={LocationIcon} alt="Location" className="w-[24px] h-[24px] lg:w-[28px] lg:h-[28px]"
  loading="lazy"
  decoding="async"
  />
            </div>
            <div className="text-center lg:text-left mt-1 lg:mt-0">
              <p className="font-[Urania] text-[14px] leading-[16px] text-[#868989] mb-2 lg:mb-3">
                Address
              </p>
              <p className="font-[Urania] text-[14px] lg:text-[18px] leading-[19px] lg:leading-[24px] text-[#132F2C] max-w-[280px] lg:max-w-none" style={{ fontFamily: 'Urania', fontWeight: '400', fontStyle: 'Regular' }}>
                True Legacy Solutions Private Limited, 2nd Floor, Imperial Amity, NH Bypass,
                Vyttila, Kochi, Kerala – 682019, India
              </p>
            </div>
          </div>
        </div>

        {/* Main contact card */}
        <div className="bg-white rounded-xl shadow-sm contact-form max-w-[1600px] mx-auto overflow-visible">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_1.1fr)_minmax(0,_0.9fr)]">
            {/* Form side */}
            <div className="bg-[#132F2C] text-white px-6 lg:px-10 py-8 lg:py-10">
              <h3 className="font-[Urania] font-bold text-white
                             text-[28px] lg:text-[36px] xl:text-[42px]
                             leading-[34px] lg:leading-[42px] xl:leading-[49px] mb-3">
                Get in Touch
              </h3>
              <p className="font-[Urania] font-normal
                             !text-[16px] lg:text-[18px]
                             leading-[20px] lg:leading-[24px]
                             text-[#5A7371] mb-8 max-w-md">
                Have a question or feedback? Fill out the form below, and we'll respond promptly!
              </p>

              {successMessage && (
                <p className="mb-4 text-sm text-green-300">{successMessage}</p>
              )}
              {errorMessage && (
                <p className="mb-4 text-sm text-red-300">{errorMessage}</p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-[Urania] text-[16px] leading-[22px] mb-1 text-white">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full h-11 rounded-md bg-[#213D3A] border border-[#2B4A46] px-3
                               text-[16px] leading-[22px] font-[Urania] text-white
                               placeholder:text-[#5A7371] focus:outline-none focus:ring-1 focus:ring-[#F4D57E]"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block font-[Urania] text-[16px] leading-[22px] mb-1 text-white">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full h-11 rounded-md bg-[#213D3A] border border-[#2B4A46] px-3
                               text-[16px] leading-[22px] font-[Urania] text-white
                               placeholder:text-[#5A7371] focus:outline-none focus:ring-1 focus:ring-[#F4D57E]"
                    placeholder="john@test.com"
                  />
                </div>

                <div>
                  <label className="block font-[Urania] text-[16px] leading-[22px] mb-1 text-white">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <PhoneInputField
                    name="phone"
                    variant="dark"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block font-[Urania] text-[16px] leading-[22px] mb-1 text-white">
                    Additional Notes
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    className="w-full rounded-md bg-[#1F3C39] border border-[#2B4A46] px-3 py-2
                               text-[16px] leading-[22px] font-[Urania] text-white
                               placeholder:text-[#5A7371] resize-none focus:outline-none focus:ring-1 focus:ring-[#F4D57E]"
                    placeholder="Please provide any additional details about your request..."
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-[180px] h-11 rounded-full bg-[#FFFFFF]
                               text-[#132F2C] font-[Urania] text-[16px] leading-[20px] font-medium
                               flex items-center justify-center hover:bg-[#f7e291]
                               disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>

            {/* Image side (hidden on mobile) */}
            <div className="relative hidden lg:block lg:h-full overflow-hidden rounded-r-xl">
              <img
                src={ContactImage}
                alt="Contact illustration"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#132F2C]/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
   