import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StyledButton from "../../ui/StyledButton";
import heroImage from "../../assets/img/Frame 2147224783.webp";
import truelegacyLogo from "../../assets/img/Group (1).webp";
import headerBackgroundDecor from "../../assets/img/backround.png";
import headerTriangleDecor from "../../assets/img/Frame 2147224880.png";

const SuccessionLanding = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full min-h-[100dvh] bg-[#0F2F2C]"
    >
      <div className="bg-[#0F2F2C] relative overflow-hidden">
        {/* Exit Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 z-20 text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer"
        >
          Exit ✕
        </button>
        
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <img
            src={headerBackgroundDecor}
            alt="Decorative background pattern"
            aria-hidden="true"
            className="absolute md:hidden opacity-100 object-contain"
            style={{ width: "335.17px", height: "202.94px", top: "47px", left: "20px" }}
            loading="eager"
            decoding="async"
          />
          <img
            src={headerBackgroundDecor}
            alt="Decorative background pattern"
            aria-hidden="true"
            className="absolute hidden md:block opacity-100 object-contain"
            style={{ width: "459.17px", height: "278.01px", top: "-1px", left: "490px" }}
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 md:py-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white font-[Urania] font-light text-[26px] md:text-[36px] leading-[100%] tracking-[0%]"
          >
            Welcome to
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#F4D57E] font-[Urania] font-medium text-[37.47px] leading-[45.8px] md:text-[56px] md:leading-[61px] tracking-[0%] mt-3 md:mt-5"
          >
            Legal Heir Identification Tool
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-2 md:mt-3 flex items-center justify-center gap-3 text-white"
          >
            <span className="font-[Urania] font-normal text-[31.23px] leading-[36.32px] md:text-[42px] md:leading-[48px] tracking-[0%]">
              By
            </span>
            <img
              src={truelegacyLogo}
              alt="Truelegacy"
              width={500}
              height={112}
              className="relative -top-[3px] md:-top-[4px] w-[231.68px] h-[51.46px] md:w-[306.16px] md:h-[68px] object-contain"
              loading="eager"
              decoding="async"
            />
          </motion.div>
        </div>
        <img
          src={headerTriangleDecor}
          alt="Decorative triangle accent"
          aria-hidden="true"
          className="absolute hidden md:block pointer-events-none select-none object-contain opacity-90 z-0"
          style={{ right: "0px", bottom: "0px", width: "240px", height: "180px" }}
          loading="eager"
          decoding="async"
        />
      </div>

      <div className="bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-left text-[#132F2C] font-[Urania] font-medium text-[24px] leading-[31px] md:text-[26px] md:leading-[37px] tracking-[0%] w-full max-w-[341px] md:w-[554px] md:max-w-none mx-0"
            >
              Built based on Indian Succession Laws, our tool is designed to help you identify your legal heirs if you have no proper Succession Plan.
            </motion.div>

            <div className="relative w-[266px] h-[235px] ml-auto md:w-[340.752px] md:h-[338.703px] md:max-w-none md:mx-auto">
              <img
                src={heroImage}
                alt="Legal heir tool"
                className="relative w-full h-full md:h-full rounded-[5px] object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>

          <div className="mt-12 md:mt-16 bg-[#F3FAF7] rounded-[6px] px-6 py-10 md:px-10 md:py-12 relative left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] md:w-[calc(100vw-44px)] max-w-[1396px]">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center text-[#132F2C] font-[Urania] font-bold text-[32px] leading-[100%] md:text-[42px] md:leading-[49px] tracking-[0%]"
            >
              How It Works
            </motion.div>

          <div className="mt-8">
            <div className="hidden md:block">
              <div className="relative max-w-4xl mx-auto">
                <div
                  className="absolute top-5 h-[2px] bg-[#F4D57E] opacity-80"
                  style={{ left: "16.6667%", right: "16.6667%" }}
                />

                <div className="relative z-10 flex items-start justify-between gap-6">
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#F4D57E] flex items-center justify-center font-[Urania] font-bold text-[28px] leading-none tracking-[0%] text-[#000000]">
                      <span className="block leading-none">1</span>
                    </div>
                    <div className="mt-4 font-[Urania] font-medium text-[21px] leading-[25px] tracking-[0%] text-[#000000] max-w-[220px]">
                      Answer a
                      <br />
                      few questions
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#F4D57E] flex items-center justify-center font-[Urania] font-bold text-[28px] leading-none tracking-[0%] text-[#000000]">
                      <span className="block leading-none">2</span>
                    </div>
                    <div className="mt-4 font-[Urania] font-medium text-[21px] leading-[25px] tracking-[0%] text-[#000000] max-w-[240px]">
                      Identify your
                      <br />
                      Legal Heirs
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#F4D57E] flex items-center justify-center font-[Urania] font-bold text-[28px] leading-none tracking-[0%] text-[#000000]">
                      <span className="block leading-none">3</span>
                    </div>
                    <div className="mt-4 font-[Urania] font-medium text-[21px] leading-[25px] tracking-[0%] text-[#000000] max-w-[260px]">
                      Download your
                      <br />
                      Personalised Report
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:hidden relative w-fit mx-auto">
              <div className="absolute left-5 top-6 bottom-6 w-[2px] bg-[#F4D57E] opacity-80" />

              <div className="relative z-10 flex flex-col gap-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F4D57E] flex items-center justify-center font-[Urania] font-bold text-[24.89px] leading-none tracking-[0%] text-[#000000] shrink-0">
                    <span className="block leading-none">1</span>
                  </div>
                  <div className="pt-[2px] font-[Urania] font-medium text-[20px] leading-[22px] tracking-[0%] text-[#000000]">
                    Answer a
                    <br />
                    few questions
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F4D57E] flex items-center justify-center font-[Urania] font-bold text-[24.89px] leading-none tracking-[0%] text-[#000000] shrink-0">
                    <span className="block leading-none">2</span>
                  </div>
                  <div className="pt-[2px] font-[Urania] font-medium text-[20px] leading-[22px] tracking-[0%] text-[#000000]">
                    Identify your
                    <br />
                    Legal Heirs
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F4D57E] flex items-center justify-center font-[Urania] font-bold text-[24.89px] leading-none tracking-[0%] text-[#000000] shrink-0">
                    <span className="block leading-none">3</span>
                  </div>
                  <div className="pt-[2px] font-[Urania] font-medium text-[20px] leading-[22px] tracking-[0%] text-[#000000]">
                    Download your
                    <br />
                    Personalised Report
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-10 flex justify-center">
            <StyledButton
              name={
                <>
                  Identify my Legal Heirs
                  <span className="hidden md:inline"> →</span>
                </>
              }
              onClick={() => navigate("/succession/questions")}
              variant="primary"
              minWidth="auto"
              className="rounded-full !bg-[#132F2C] w-full max-w-[320px] px-6 py-3 whitespace-nowrap font-[Urania] font-bold text-[18px] leading-[100%] md:text-[24px] tracking-[0%] !text-white"
            />
          </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0F2F2C]">
        <div className="w-full px-4 md:px-5 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
          <div className="font-[Urania] font-medium text-[20px] leading-[100%] tracking-[0%] text-[#FFFFFF]">
            Disclaimer
          </div>
          <div className="mt-3 font-[Urania] font-normal text-[12px] leading-[16px] md:text-[14px] md:leading-[20px] tracking-[0%] text-[#A1A1A1]">
            The results generated by this tool are based on general principles of Indian succession law and are intended for informational purposes only. They do not constitute legal advice and should not be relied upon as a substitute for consultation with a qualified legal professional. Individual circumstances, applicable personal laws, existing wills, court orders, or jurisdictional variations may affect actual succession outcomes. While every effort has been made to ensure accuracy, there is a possibility of error in the results generated. True Legacy makes no representation as to the legal accuracy or completeness of results in any specific case and shall not be held liable for any decisions made on the basis of this tool's output.
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SuccessionLanding;
