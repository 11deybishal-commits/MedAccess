import api from './api.js';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const hospitalService = {
  getNearbyHospitals: (latitude, longitude, radius = 5000) =>
    api.get('/hospitals/nearby', {
      params: { latitude, longitude, radius },
    }),
  getHospitalDetails: (placeId) => api.get(`/hospitals/details/${placeId}`),
};

export const pharmacyService = {
  getNearbyPharmacies: (latitude, longitude, radius = 5000) =>
    api.get('/pharmacies/nearby', {
      params: { latitude, longitude, radius },
    }),
  getNearbyEmergencyServices: (latitude, longitude, radius = 5000, type = 'police') =>
    api.get('/pharmacies/emergency', {
      params: { latitude, longitude, radius, type },
    }),
};

export const donorService = {
  registerDonor: (data) => api.post('/donors/register', data),
  searchDonors: (params) => api.get('/donors/search', { params }),
  getAllDonors: () => api.get('/donors/all'),
  getMyProfile: () => api.get('/donors/my-profile'),
  updateProfile: (data) => api.put('/donors/update-profile', data),
};

export const bloodRequestService = {
  createRequest: (data) => api.post('/blood-requests', data),
  getRequests: (params) => api.get('/blood-requests', { params }),
  getMyRequests: () => api.get('/blood-requests/my-requests'),
  updateRequest: (id, data) => api.put(`/blood-requests/${id}`, data),
  deleteRequest: (id) => api.delete(`/blood-requests/${id}`),
};

export const resourceService = {
  reportResource: (data) => api.post('/resources', data),
  getVerifiedResources: (params) => api.get('/resources/verified', { params }),
  getPendingResources: () => api.get('/resources/pending'),
  getMyReports: () => api.get('/resources/my-reports'),
  verifyResource: (id) => api.put(`/resources/${id}/verify`),
  rejectResource: (id) => api.put(`/resources/${id}/reject`),
  deleteResource: (id) => api.delete(`/resources/${id}`),
};
