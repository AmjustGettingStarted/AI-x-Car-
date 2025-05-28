import React from "react";

export async function generateMetadata() {
  return {
    title: `Book Test Drive 📑 | AIxCAR`,
    description: `Schedule a test drive in few seconds`,
  };
}

const TestDrivePage = ({params}) => {
  return <div>TestDrivePage: {params.id}</div>;
};

export default TestDrivePage;
