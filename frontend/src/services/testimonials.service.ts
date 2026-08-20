import { api } from "./api.client";

export const getTestimonials = async () => {
  // return api.get("/testimonials").then(res => res.data.data);
  return [];
};

export const createTestimonial = async (data: any) => {
  // return api.post("/testimonials", data).then(res => res.data.data);
  return { ...data, id: Date.now().toString() };
};

export const updateTestimonial = async ({ id, data }: { id: string; data: any }) => {
  // return api.put(`/testimonials/${id}`, data).then(res => res.data.data);
  return { ...data, id };
};

export const deleteTestimonial = async (id: string) => {
  // return api.delete(`/testimonials/${id}`).then(res => res.data.data);
  return { id };
};
