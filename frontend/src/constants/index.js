import { uploadCertificate, dashboard, logout, payment, profile, withdraw } from '../assets';

export const CONTRACT_ADDRESS = "0x354CC584C1a50AfDd476f176cfA4c7a427a22d29";

export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'certificate',
    imgUrl: uploadCertificate,
    link: '/upload-certificate',
  },
  {
    name: 'admin',
    imgUrl: uploadCertificate,
    link: '/add-admin',
  },
  {
    name: 'payment',
    imgUrl: payment,
    link: '/',
    disabled: true,
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