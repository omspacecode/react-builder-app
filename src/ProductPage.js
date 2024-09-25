// ProductPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BuilderComponent, builder, useIsPreviewing, BuilderContent, Builder } from '@builder.io/react';

builder.init(process.env.REACT_APP_BUILDER_API_KEY);

const locale = "en-US";

const Heading = props => (
  <h1>{props.title}</h1>
)

Builder.registerComponent(Heading, { 
  name: 'Heading',
  inputs: [{ name: 'title', type: 'text', defaultValue: 'Default Heading'}],
  image: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F6bef27ee40d24f3b88239fd7e616f82a'
})

export default function ProductPage() {
  const { slug } = useParams();
  const [productData, setProductData] = useState(null);
  const [productTemplate, setProductTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const isPreviewingInBuilder = useIsPreviewing();

  useEffect(() => {
    async function fetchData() {
      try {
        const [productDataResponse, productTemplateResponse] = await Promise.all([
          builder.get('products', {
            query: {
              'data.slug': slug
            },
            locale,
            options: { enrich: true }
          }).toPromise(),
          builder.get('product-section', {
            userAttributes: {
              urlPath: `/product/${slug}`,
            },
            options: { enrich: true },
            locale,
          }).toPromise()
        ]);

        setProductData(productDataResponse);
        setProductTemplate(productTemplateResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const show404 = !productData && !isPreviewingInBuilder;

  if (show404) {
    return <h1>404 - Not Found</h1>;
  }

  const useDataVisualPreview = (isPreviewingInBuilder && builder?.editingModel === "article");

  return (
    <>
      {!productData && <meta name="robots" content="noindex" />}
      {useDataVisualPreview ? (
        <BuilderContent model="products" content={productData}>
          {(product) => (
            <BuilderComponent 
              model="product-section" 
              locale={locale} 
              content={productTemplate} 
              data={{product}}  
            />
          )}
        </BuilderContent>
      ) : (
        <BuilderComponent 
          model="product-section" 
          locale={locale} 
          content={productTemplate} 
          data={{product: productData?.data}}
        />
      )}
    </>
  );
}
