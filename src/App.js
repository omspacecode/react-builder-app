import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import FourOhFour from './404.page'; // Adjust the path if necessary
import ProductPage from './ProductPage'; // Import the new ProductPage component

// Put your API key here
builder.init(process.env.REACT_APP_BUILDER_API_KEY);

function CatchAllRoute() {
  const isPreviewingInBuilder = useIsPreviewing();
  const [notFound, setNotFound] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    async function fetchContent() {
      const content = await builder
        .get("page", {
          url: window.location.pathname
        })
        .promise();

      setContent(content);
      setNotFound(!content);

      if (content?.data.title) {
        document.title = content.data.title
      }
    }
    fetchContent();
  }, []);

  if (notFound && !isPreviewingInBuilder) {
    return <FourOhFour />
  }

  return (
    <BuilderComponent model="page" content={content} />
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="*" element={<CatchAllRoute />} />
      </Routes>
    </Router>
  );
}

export default App;