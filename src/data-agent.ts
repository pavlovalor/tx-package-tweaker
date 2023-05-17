import axios from 'axios';

export const agent = axios.create({
  baseURL: 'https://api.bitbucket.org/2.0',
});
