import React, { useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import { createBrowserRouter as Router, RouterProvider } from "react-router-dom";
import { useLoading } from "./context/loadingContext";
import { Loading } from "./components/ui/loader"; 
import useEagerConnect from "./hooks/useEagerConnect";

const App = () => {
  const { isLoading, setIsLoading } = useLoading();
  
  // Use the eager connect hook to try connecting automatically
  useEagerConnect();

  useEffect(() => {
    // Set loading to true when the app starts
    setIsLoading(true);
    
    // Check if all resources are loaded
    const handleLoad = () => {
      setIsLoading(false);
    };
    
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(timeoutId);
      };
    }
  }, [setIsLoading]);

  const router = Router([
    {
      path: "/",
      element: <Dashboard />,
    },
  ]);

  return (
    <>
      {isLoading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="App w-full h-full min-h-screen bg-background">
          <RouterProvider router={router} />
        </div>
      )}
    </>
  );
};

export default App;