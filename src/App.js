import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Selections from './Dataroom';
import Drive from './components/Drive/Drive';
import DropboxIntegration from './DropBox/Dropbox';
import TwoFactorAuth from './Auth/TwoFactorAuth';
import Login from './Auth/Login';
// import TextTranslation from './open-ai/TextTranslate'; 
import './App.css';

const SuccessPage = () => {
  return <h1>Authentication Successful!</h1>;
};

const ErrorPage = () => {
  return <h1>Authentication Failed!</h1>;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/2factor" element={<TwoFactorAuth />} />
        <Route path="/dashboard" element={<Selections />} />
        <Route path="/drive" element={<Drive />} />
        <Route path="/auth/callback" element={<DropboxIntegration />} />
        {/* <Route path="/translate" element={<TextTranslation />} /> */}
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
