import { useState } from "react";

import { useForm, Controller } from "react-hook-form";

import { motion, AnimatePresence } from "framer-motion";

import { CheckIcon, ChevronLeft, ChevronRight } from "lucide-react";

import surveyImg from "../../assets/img/succession/bg.webp";

import male from "../../assets/img/succession/boy.webp";

import female from "../../assets/img/succession/girl.webp";

import StyledButton from "../../ui/StyledButton";

import { createSuccession } from "../../api/successionApi";
import { generateTreeBase64 } from "../../utils/tree/generateTreeBase64";
import SuccessionLoading from "./SuccessionLoading";

import { useNavigate } from "react-router-dom";

import { useSuccession } from "../../context/SuccessionContext";

import logo from "../../assets/img/succession/Truelegacy Black Logo.png";

const steps = [
  {
    id: 1,

    question: "What is your gender?",

    description:
      "This helps us determine the succession law applicable to you.",

    type: "gender",

    name: "gender",

    options: [
      { label: "Male", icon: male },

      { label: "Female", icon: female },
    ],
  },

  {
    id: 2,

    question: "What is your religion?",

    description:
      "This helps us determine the succession law applicable to you.",

    type: "religion",

    name: "religion",

    options: ["Hindu", "Muslim", "Christian"],
  },

  {
    id: 3,

    question: "What is your current marital status?",

    description:
      "This helps us determine the succession law applicable to you.",

    type: "maritalStatus",

    name: "maritalStatus",

    options: ["Married", "Widow", "Widower", "Divorced", "Not married"],
  },

  {
    id: 4,

    question: "Was your marriage registered under the Special Marriage Act ?",

    description:
      "This helps us determine the succession law applicable to you.",

    type: "interCaste",

    name: "interCaste",

    options: ["Yes", "No"],
  },

  {
    id: 7,

    question: "How many children do you have?",

    description: "Please provide the count of sons and daughters.",

    type: "childrenCount",

    name: "childrenCount",

    fields: [
      { name: "sons", label: "Number of sons" },

      { name: "daughters", label: "Number of daughters" },
    ],
  },

  {
    id: 8,

    question: "Are your parents alive?",

    description: "Please select one of the following options.",

    type: "parentsAlive",

    name: "parentsAlive",

    options: ["Both alive", "Mother only", "Father only", "No one alive"],
  },

  {
    id: 9,

    question: "How many siblings do you have?",

    description: "Please provide the count of brothers and sisters.",

    type: "siblingsCount",

    name: "siblingsCount",

    fields: [
      { name: "brothers", label: "Number of brothers" },

      { name: "sisters", label: "Number of sisters" },
    ],
  },
];

const getMaritalStatus = (status) => {
  switch (status) {
    case "Married":
    case "Widow":
    case "Widower":
      return "married";

    case "Divorced":
      return "divorced";

    case "Not married":
      return "unmarried";

    default:
      return "unmarried";
  }
};

const SurveyForm = () => {
  const navigate = useNavigate();

  const { setSuccessionData } = useSuccession();

  const [error, setError] = useState(null);

  const [step, setStep] = useState(0);

  const [loading, setLoading] = useState(false);

  const [showExitPopup, setShowExitPopup] = useState(false);

  const { control, handleSubmit, getValues, watch } = useForm({
    defaultValues: {
      gender: "",

      religion: "",

      maritalStatus: "",

      spouseAlive: "",

      interCaste: "",

      childrens: "",

      sons: 0,

      daughters: 0,

      parentsAlive: "",

      siblings: "",

      brothers: 0,

      sisters: 0,
    },
  });

  // Watch the first 3 mandatory fields to enable/disable Next button

  const gender = watch("gender");

  const religion = watch("religion");

  const maritalStatus = watch("maritalStatus");

  const onSubmit = async (data) => {
    setLoading(true);

    const totalSons = Number(data.sons) || 0;

    const totalDaughters = Number(data.daughters) || 0;

    const payload = {
      gender: data.gender?.toLowerCase(),

      religion: data.religion?.toLowerCase(),

      married:
        data.maritalStatus === "Married" ||
        data.maritalStatus === "Widow" ||
        data.maritalStatus === "Widower",

      divorced: data.maritalStatus === "Divorced",

      marital_status: getMaritalStatus(data.maritalStatus),

      spouse_alive:
        data.maritalStatus === "Married" ||
        data.maritalStatus === "Widow" ||
        data.maritalStatus === "Widower"
          ? data.maritalStatus === "Married"
          : false,

      inter_caste: data.interCaste === "Yes",

      children: {
        sons: totalSons,

        daughters: totalDaughters,
      },

      parents_alive:
        data.parentsAlive === "Both alive"
          ? "both"
          : data.parentsAlive === "Father only"
            ? "father"
            : data.parentsAlive === "Mother only"
              ? "mother"
              : "none",

      siblings: {
        brothers: Number(data.brothers) || 0,

        sisters: Number(data.sisters) || 0,
      },
    };

    try {
      setLoading(true);

      setError(null);

      const res = await createSuccession(payload);

      if (res?.data) {
        console.log(res?.data);

        setSuccessionData(res.data);

        // Capture tree image immediately after succession creation
        setTimeout(async () => {
          try {
            console.log("📸 Capturing tree image after succession creation...");
            const treeImage = await generateTreeBase64();

            // Store the captured image in succession data for later WhatsApp use
            if (treeImage) {
              const updatedData = {
                ...res.data,
                capturedTreeImage: treeImage,
              };
              setSuccessionData(updatedData);
              console.log("✅ Tree image captured and stored");
            }
          } catch (error) {
            console.warn("⚠️ Failed to capture tree image:", error);
          }
        }, 100); // Very short wait for tree to render

        setTimeout(() => {
          navigate("/succession/view", { replace: true });
        }, 2000);
      } else {
        setError({
          message: res?.message || "Failed to create succession.",
        });

        console.error(res?.message || "Failed to create succession.");
      }
    } catch (error) {
      console.error("Error creating succession:", error?.message);

      setError({
        message:
          error?.message ||
          "Something went wrong while creating the succession. Please try again.",
      });
    }
  };

  const current = steps[step];

  const progress = ((step + 1) / steps.length) * 100;

  const handleNext = () => {
    const values = getValues();

    // Validate mandatory fields for first 3 steps

    if (step === 0 && !values.gender) return;

    if (step === 1 && !values.religion) return;

    if (step === 2 && !values.maritalStatus) return;

    let nextStep = step + 1;

    // Skip inter-caste question if not married

    if (steps[nextStep]?.type === "interCaste") {
      if (values.maritalStatus === "Not married") {
        // Skip to childrenCount question

        nextStep = steps.findIndex((s) => s.type === "childrenCount");
      }
    }

    if (nextStep < steps.length) setStep(nextStep);
  };

  const handlePrevious = () => {
    const values = getValues();

    let prevStep = step - 1;

    // Skip inter-caste question when going back if not married

    if (steps[prevStep]?.type === "interCaste") {
      if (values.maritalStatus === "Not married") {
        prevStep = steps.findIndex((s) => s.type === "maritalStatus");
      }
    }

    setStep(Math.max(0, prevStep));
  };

  const handleCloseClick = () => {
    setShowExitPopup(true);
  };

  const handleConfirmExit = () => {
    navigate("/");
  };

  // Show loading screen if loading

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SuccessionLoading
          error={error}
          onClose={() => {
            setError(null);

            setLoading(false);

            setStep(0);
          }}
        />
      </motion.div>
    );
  }

  return (
    <>
      <div className="flex h-[100dvh] md:h-auto md:min-h-screen bg-white relative overflow-hidden md:overflow-visible">
        <div
          className="flex-1 min-w-0 relative hidden md:block 

  bg-[linear-gradient(240deg,#FFFFFF_40%,#FFEFC2_100%)]"
        >
          <div className="h-full flex flex-col justify-center items-center p-10 text-white">
            <img
              src={logo}
              alt="Logo"
              onClick={() => navigate("/")}
              className="w-[161px] h-[63px] object-cover cursor-pointer"
              loading="lazy"
              decoding="async"
              />{" "}
            <img
              src={surveyImg}
              alt="Survey"
              className="w-[312px] h-[332px] object-cover"
              loading="lazy"
              decoding="async"
              />
            <h2 className="text-4xl text-[#966610] font-medium mb-3 mt-5">
              Know your legal heirs
            </h2>
            <p
              className="text-base text-[#8F8F8F] max-w-md text-center"
              style={{ lineHeight: "120%" }}
            >
              If you don’t plan your succession, the law steps in see how your
              wealth will be divided.
            </p>
          </div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col md:justify-between md:p-20 pt-10 md:pt-20 p-5 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-10 relative">
          <div>
            <div className="flex justify-end text-xl md:text-[26px] font-medium mb-2 md:mb-6 text-primary ">
              <span>
                {step + 1}/{steps.length}
              </span>
            </div>
          </div>
          <div className="flex flex-col flex-1 w-full mb-4 md:mb-0 overflow-y-auto md:overflow-visible pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col flex-1 justify-center min-h-[300px] md:min-h-[500px]"
            >
              <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4 }}
                    className="text-center"
                  >
                    <h2 className="lg:text-3xl text-xl font-medium mb-2 text-primary">
                      {current.type === "parentsAlive" &&
                      getValues("religion") === "Hindu" &&
                      getValues("gender") === "Female" &&
                      getValues("maritalStatus") === "Married" &&
                      getValues("interCaste") === "No"
                        ? "Are your husband's parents alive?"
                        : current.type === "siblingsCount" &&
                            getValues("religion") === "Hindu" &&
                            getValues("gender") === "Female" &&
                            getValues("maritalStatus") === "Married" &&
                            getValues("interCaste") === "No"
                          ? "How many siblings does your husband have?"
                          : current.question}
                    </h2>

                    <p className="text-secondary lg:text-base text-sm mb-8">
                      {current.description}
                    </p>

                    {current.type === "gender" && (
                      <div className="flex justify-center gap-8">
                        {current.options.map((option) => (
                          <Controller
                            key={option.label}
                            name="gender"
                            control={control}
                            render={({ field }) => (
                              <div
                                onClick={() => field.onChange(option.label)}
                                className={`relative cursor-pointer border rounded-xl p-6 w-40 flex flex-col items-center transition-all ${
                                  field.value === option.label
                                    ? "border-none bg-[#F4D57E] shadow-md"
                                    : "border-black/20 border-[0.77px] hover:border-[#F4D57E]"
                                }`}
                              >
                                <div
                                  className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                    field.value === option.label
                                      ? "bg-[#001412] border-[#001412] text-white"
                                      : "border-black/20 border-[0.77px] bg-white text-transparent"
                                  }`}
                                >
                                  <CheckIcon className="w-4 h-4" />
                                </div>

                                <img
                                  src={option.icon}
                                  alt={option.label}
                                  className="w-26 h-26 object-contain"
                                  loading="lazy"
                                  decoding="async"
                                  />

                                <span className="text-lg  text-primary">
                                  {option.label}
                                </span>
                              </div>
                            )}
                          />
                        ))}
                      </div>
                    )}

                    {(current.type === "childrenCount" ||
                      current.type === "siblingsCount") && (
                      <div className="space-y-6 max-w-md mx-auto">
                        {current.fields.map((fieldItem) => (
                          <div key={fieldItem.name}>
                            <label className="block text-left mb-2 lg:text-xl text-base">
                              {fieldItem.label}
                            </label>

                            <Controller
                              name={fieldItem.name}
                              control={control}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  placeholder={`Enter ${fieldItem.label.toLowerCase()}`}
                                  className="border border-black/20 rounded-[6px] w-full py-3 pl-6 pr-2"
                                />
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {current.options && current.type !== "gender" && (
                      <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
                        {(current.type === "maritalStatus"
                          ? current.options.filter((opt) => {
                              if (opt === "Widow" && gender === "Male")
                                return false;

                              if (opt === "Widower" && gender === "Female")
                                return false;

                              return true;
                            })
                          : current.options
                        ).map((opt) => (
                          <Controller
                            key={opt.label || opt}
                            name={current.name}
                            control={control}
                            render={({ field }) => (
                              <button
                                type="button"
                                onClick={() => field.onChange(opt.label || opt)}
                                className={`w-full border rounded-xl lg:py-5 py-2  px-6 flex items-center justify-between transition-all duration-300 ${
                                  field.value === (opt.label || opt)
                                    ? "bg-[#F4D57E] border-[#F4D57E] text-primary shadow-sm"
                                    : "bg-white border-black/20 hover:border-[#F4D57E]"
                                }`}
                              >
                                <span className="lg:text-xl text-base font-medium">
                                  {opt.label || opt}
                                </span>

                                <div
                                  className={`lg:w-6 lg:h-6 w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                    field.value === (opt.label || opt)
                                      ? "bg-[#001412] border-[#001412] text-white"
                                      : "border-black/20 bg-white text-transparent"
                                  }`}
                                >
                                  <CheckIcon className="lg:w-4 lg:h-4 w-3 h-3" />
                                </div>
                              </button>
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </form>
          </div>

          <div className="fixed bottom-3 left-0 right-0 z-20 bg-white px-5 pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] flex justify-between md:absolute md:bottom-0 md:left-0 md:right-0 md:z-auto md:bg-transparent md:px-20 md:py-5 md:pt-0 md:pb-10">

            {step > 0 && (
              <StyledButton
                name={
                  <span className="flex items-center gap-2">
                    <ChevronLeft size={18} /> Previous
                  </span>
                }
                onClick={handlePrevious}
                variant="quaternary"
              />
            )}

            {step === steps.length - 1 ? (
              <StyledButton
                name="Submit"
                onClick={handleSubmit(onSubmit)}
                variant="primary"
              />
            ) : (
              <div className="flex justify-end w-full">
                <StyledButton
                  name={
                    <span className="flex items-center gap-2">
                      Next <ChevronRight size={18} />
                    </span>
                  }
                  onClick={handleNext}
                  variant="primary"
                  disabled={
                    (step === 0 && !gender) ||
                    (step === 1 && !religion) ||
                    (step === 2 && !maritalStatus)
                  }
                />
              </div>
            )}
          </div>
        </div>

        {showExitPopup && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
              <h2 className="text-xl font-semibold mb-2">Exit the Survey ?</h2>

              <p className="text-gray-600 mb-6">
                You'll lose your progress if you exit now.
              </p>

              <div className="flex justify-end gap-3">
                <StyledButton
                  onClick={() => setShowExitPopup(false)}
                  name="Stay Here"
                  variant="quinary"
                />

                <StyledButton name="Yes, Leave" onClick={handleConfirmExit} />
              </div>
            </div>
          </div>
        )}
      </div>
      <button
        className="absolute top-4 left-4 md:top-8 md:left-8 text-primary text-lg font-medium hover:underline"
        onClick={handleCloseClick}
      >
        ✕ Close
      </button>
    </>
  );
};

export default SurveyForm;
