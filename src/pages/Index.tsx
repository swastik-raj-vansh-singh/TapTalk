
// This page is no longer needed as we're using the App.tsx routing
import { Navigate } from "react-router-dom";

const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
