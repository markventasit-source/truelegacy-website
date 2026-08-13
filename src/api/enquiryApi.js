import axiosInstance from "./axiosIntercepter";

export const trackMetaLead = () => {
  if (typeof window.fbq === "function") {
    window.fbq("track", "Lead");
  }
};

export const createEnquiry = async (data) => {
  try {
    const response = await axiosInstance.post(`/enquiries`, data);
    trackMetaLead();
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
