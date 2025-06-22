// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { BrowserRouter } from "react-router-dom";

<BrowserRouter
  future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
>
  <App />
</BrowserRouter>


ReactDOM.createRoot(document.getElementById('root')).render(

 <React.Fragment>
  <AuthProvider>
      <App />
    </AuthProvider>
</React.Fragment>
);