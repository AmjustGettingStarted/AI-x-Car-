import React from "react";

const layout = ({ children }) => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      {children}
    </div>
  );
};

export default layout;
