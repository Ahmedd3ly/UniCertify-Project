import { dashboard, certificate, admin, withdraw, profile, logout } from '../assets';

export const CONTRACT_ADDRESS = "0xb76E8420691AE0Cd250D52dc346C0904C9c7E873";

export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'certificate',
    imgUrl: certificate,
    link: '/upload-certificate',
  },
  {
    name: 'admin',
    imgUrl: admin,
    link: '/add-admin',
  },
  {
    name: 'withdraw',
    imgUrl: withdraw,
    link: '/',
    disabled: true,
  },
  {
    name: 'profile',
    imgUrl: profile,
    link: '/profile',
  },
  {
    name: 'logout',
    imgUrl: logout,
    link: '/',
    disabled: true,
  },
];