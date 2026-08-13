import axiosInstance from "./axiosIntercepter";

export const getBlogs = async (filter = {}) => {
  try {
    const { page, page_no, ...rest } = filter;
    const response = await axiosInstance.get(`/pages/blogs`, {
      params: {
        ...rest,
        page_no: page_no ?? page ?? 1,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllBlogs = async (filter = {}) => {
  const limit = Number(filter?.limit) > 0 ? Number(filter.limit) : 500;
  const maxPages = 50;

  const extractList = (res) => {
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.data)) return res.data.data;
    if (Array.isArray(res?.blogs)) return res.blogs;
    if (Array.isArray(res?.blogs?.data)) return res.blogs.data;
    return [];
  };

  const extractTotalCount = (res) => {
    const v = res?.total_count ?? res?.totalCount ?? res?.data?.total_count;
    return Number.isFinite(Number(v)) ? Number(v) : null;
  };

  const all = [];
  for (let page = 1; page <= maxPages; page += 1) {
    const res = await getBlogs({ ...filter, page_no: page, limit });
    const list = extractList(res);
    all.push(...list);

    const totalCount = extractTotalCount(res);
    if (totalCount != null && all.length >= totalCount) break;
    if (list.length < limit) break;
    if (list.length === 0) break;
  }

  return { data: all };
};

export const getBlogById = async (id) => {
  try {
    const response = await axiosInstance.get(`/pages/blog/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getBlogBySlug = async (slug) => {
  try {
    const response = await getBlogs({
      status: "published",
      slug,
      limit: 1,
      page_no: 1,
    });
    const list = Array.isArray(response?.data) ? response.data : [];
    return list[0] || null;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const formatContentTypeLabel = (type) => {
  const labels = {
    blog: "Blog",
    article: "Article",
    event: "Event",
    news: "News",
  };
  return labels[type] || "Blog";
};
