import axiosInstance from './axiosIntercepter';
import { saveSuccessionLeadToCrm } from './crmLeadsApi';

/**
 * Sends succession tree data to backend for WhatsApp report generation,
 * then saves the lead to the TrueLegacy CRM (unique-leads → succession).
 * @param {Object} payload - Request payload
 * @param {string} payload.successionId - Succession ID
 * @param {string} payload.name - User name
 * @param {string} payload.email - User email
 * @param {string} payload.phone - Phone number
 * @param {string} payload.treeImage - Base64 PNG string of tree
 * @param {Object} [payload.successionData] - Succession context data for CRM survey_data
 * @returns {Promise<Object>} Response data
 */
export const sendSuccessionTreeToBackend = async (payload) => {
  const response = await axiosInstance.post('/succession/share', {
    survey_id: payload.successionId,
    name: payload.name.trim(),
    email: payload.email.trim(),
    mobile: payload.phone,
    tree_image: payload.treeImage,
  });

  const pdfUrl = response.data?.data?.pdf_url;

  try {
    await saveSuccessionLeadToCrm({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      successionData: payload.successionData,
      successionId: payload.successionId,
      pdfUrl,
    });
  } catch (crmError) {
    console.error('CRM lead save failed:', crmError?.response?.data || crmError?.message);
  }

  return response.data;
};
