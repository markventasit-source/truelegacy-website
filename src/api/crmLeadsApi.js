import axios from "axios";
import { trackMetaLead } from "./enquiryApi";

const CRM_PUBLIC_LEAD_URL =
  import.meta.env.VITE_CRM_PUBLIC_LEAD_URL ||
  (import.meta.env.DEV
    ? "/crm-api/leads/public"
    : "https://crm.truelegacy.in/api/leads/public");

const CRM_FORM_KEY = import.meta.env.VITE_CRM_FORM_KEY;

export const buildSuccessionSurveyData = (successionData, successionId, pdfUrl) => {
  const survey = successionData?.survey;
  const surveyId = successionId || survey?.id;

  if (!survey) {
    return {
      survey_id: surveyId,
      ...(pdfUrl ? { pdf_url: pdfUrl } : {}),
    };
  }

  return {
    survey_id: surveyId,
    metadata: {
      religion: survey.religion,
      gender: survey.gender,
      marital_status: survey.marital_status,
      inter_caste: survey.inter_caste,
      matched_case_id: survey.matched_case_id,
      matched_case_description: survey.matched_case_description,
      total_percent: survey.total_percent,
    },
    computed_shares: survey.computed_shares,
    family_tree: survey.family_tree,
    ...(pdfUrl ? { pdf_url: pdfUrl } : {}),
  };
};

/**
 * Creates a succession-tool lead in the TrueLegacy CRM (unique-leads → succession tab).
 */
export const saveSuccessionLeadToCrm = async ({
  name,
  email,
  phone,
  successionData,
  successionId,
  pdfUrl,
}) => {
  const payload = {
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      source: "succession-tool",
      survey_data: buildSuccessionSurveyData(successionData, successionId, pdfUrl),
    },
  };

  const headers = { "Content-Type": "application/json" };
  if (CRM_FORM_KEY) {
    headers["x-form-key"] = CRM_FORM_KEY;
  }

  const response = await axios.post(CRM_PUBLIC_LEAD_URL, payload, { headers });
  trackMetaLead();
  return response.data;
};
