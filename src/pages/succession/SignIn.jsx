import { useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "../../ui/InputField";
import logo from "../../assets/img/succession/Truelegacy Black Logo.png";
import StyledButton from "../../ui/StyledButton";
import { updateUser, loginSuccession, getTree } from "../../api/successionApi";
import { useSuccession } from "../../context/SuccessionContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

const SignIn = () => {
  const navigate = useNavigate();
  const { successionData, setSuccessionData } = useSuccession();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const loadFamilyTree = async (tempUserData, setSuccessionData) => {
    try {
      const response = await getTree();

      if (response?.data) {
        const updatedData = {
          ...tempUserData,
          survey: response.data,
        };

        setSuccessionData(updatedData);
        return updatedData;
      }
    } catch (error) {
      console.error("Family tree fetch failed", error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      let currentData = { ...successionData };
      const token = currentData?.temporary_user?.token;

      if (!token) {
        const loginResponse = await loginSuccession({
          email: data.email,
          password: data.password,
          role: "guest",
        });

        const newToken = loginResponse?.data?.token;
        if (!newToken) throw new Error("Login failed. Token not received.");

        currentData = {
          ...currentData,
          temporary_user: {
            ...currentData.temporary_user,
            token: newToken,
            is_logged_in: true,
          },
        };

        setSuccessionData(currentData);
        localStorage.setItem("successionData", JSON.stringify(currentData));
        if (!currentData?.survey?.family_tree) {
          currentData = await loadFamilyTree(currentData, setSuccessionData);
        }
        toast.success("Login successful.");
        navigate("/succession/view");
      } else {
        await updateUser(currentData?.temporary_user?.user_id, data);
        currentData = {
          ...currentData,
          temporary_user: {
            ...currentData.temporary_user,
            is_logged_in: true,
          },
        };

        setSuccessionData(currentData);
        toast.success("Login successful.");
        navigate("/succession/view");
      }
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-[#FFFFFF] to-[#FFF0C5]">
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-16 py-10 text-center md:text-left">
      <Link to="/" className="inline-block mx-auto md:mx-0">
          <img
            src={logo}
            alt="True Legacy"
            className="w-28 sm:w-32 md:w-36 mb-6 object-contain cursor-pointer"
            loading="lazy"
            decoding="async"
            />
        </Link>
        <h2 className="text-3xl sm:text-4xl font-semibold text-primary mb-4 max-w-lg mx-auto md:mx-0 leading-snug">
          Save your family estate plan securely?
        </h2>
        <p className="text-secondary text-base sm:text-lg md:text-2xl leading-relaxed max-w-lg mx-auto md:mx-0">
          Your information is encrypted and never shared. Logging in ensures
          your succession plan remains private and editable anytime.
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8 md:px-0">
        <div className="w-full max-w-md md:max-w-xl bg-gradient-to-b from-[#FFFFFF] to-[#FFFFFF]/80 backdrop-blur-lg p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-primary mb-2 text-center">
            Sign in
          </h2>
          <p className="text-secondary text-center mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
            Don’t lose your progress — secure your family plan safely.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 sm:space-y-8"
          >
            <div>
              <InputField
                label="Email Address"
                type="email"
                id="email"
                className="border-[0.8px] border-black/15"
                placeholder="Enter Email Address"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <InputField
                label="Password"
                type="password"
                id="password"
                className="border-[0.8px] border-black/15"
                placeholder="Enter Password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <StyledButton
              name={loading ? "Processing..." : "Login"}
              className="w-full mt-2 sm:mt-4"
              disabled={loading}
            />
          </form>

          {/* <div className="mt-6 text-sm sm:text-base text-primary text-center">
            Don’t have an account?{" "}
            <a href="#" className="text-[#047B16] hover:underline">
              Create one now.
            </a>
          </div> */}

          <p className="mt-4 text-xs sm:text-sm md:text-base text-secondary text-center leading-relaxed">
            Your estate data is encrypted and stored securely. TrueLegacy never
            shares or uses your information for any other purpose.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
