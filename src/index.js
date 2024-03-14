import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { SidebarProvider } from "./scenes/global/SidebarContext";
import { DarkProvider } from "./scenes/global/DarkBar";
import PdfProvider from "./Context/pdfcontext";
import { QueryClient,QueryClientProvider } from '@tanstack/react-query';

 

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient=new QueryClient({
  defaultOptions:{
    queries:{
      staleTime:20000,
    },
  }
});
root.render(
  <React.StrictMode>
    <DarkProvider>
      <SidebarProvider>
        <PdfProvider>
        <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
          </QueryClientProvider>   
        </BrowserRouter>
        </PdfProvider>
      </SidebarProvider>
    </DarkProvider>
  </React.StrictMode>
);
