import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer, Bounce } from "react-toastify";
import './styles/index.css'
import App from './App.tsx'
import "react-toastify/dist/ReactToastify.css";


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
  </BrowserRouter>
)
