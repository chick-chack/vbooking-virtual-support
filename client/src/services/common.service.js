import axios from 'axios';

import { API_BASE } from './config';

const SERVICE_BASE = API_BASE + '/common';

const getPublicUserData = (userId) => {
  return axios
    .get(`${SERVICE_BASE}/user-data/${userId}`)
    .then((res) => res.data);
};

const CommonService = { getPublicUserData };

export default CommonService;
