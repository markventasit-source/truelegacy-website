import axiosInstance from "./axiosIntercepter";

export const createSuccession = async (data) => {
  try {
    const response = await axiosInstance.post(`/succession`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const updateMember = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `/succession/${id}/edit-member`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const updateUser = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/user/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const loginSuccession = async (data) => {
  try {
    const response = await axiosInstance.post(`/auth/login`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const addMember = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `/succession/${id}/add-member`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const removeMember = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `/succession/${id}/remove-member`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getTree = async () => {
  try {
    const response = await axiosInstance.get(`/succession/my-successions`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const removeGuest = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/succession/cleanup-temporary/${id}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};