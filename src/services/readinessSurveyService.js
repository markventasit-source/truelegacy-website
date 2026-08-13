import axiosInstance from "../api/axiosIntercepter";

export const getReadinessSurveyQuestions = async () => {
  try {
    const response = await axiosInstance.get(`/readiness-survey/questions`);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const submitReadinessSurvey = async (payload) => {
  try {
    const response = await axiosInstance.post(`/readiness-survey/submit`, payload);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const downloadReadinessSurveyPdf = async () => {
  // This function is deprecated - PDF is now served statically
  // Use the pdf_url from submit response instead
  throw new Error("Use pdf_url from submit response instead of download endpoint");
};
