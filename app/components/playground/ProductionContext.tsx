import React, { createContext, useContext, useState } from 'react';

interface ProductionContextType {
  isProduction: boolean;
  apiURL: string;
  setIsProduction: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductionContext = createContext<ProductionContextType | undefined>(undefined);

export const useProductionContext = () => {
  const context = useContext(ProductionContext);
  if (!context) {
    throw new Error('useProductionContext must be used within a ProductionProvider');
  }
  return context;
};

interface ProductionProviderProps {
  initialValue: boolean;
  children: React.ReactNode;
}

export const ProductionProvider: React.FC<ProductionProviderProps> = ({ children, initialValue }) => {
  const [isProduction, setIsProduction] = useState(initialValue);

  // Use the new anyparser API URL for both production and development
  const apiURL = process.env.NEXT_PUBLIC_ANYPARSER_API_URL || 'https://anyparser.cambioml.com';

  return (
    <ProductionContext.Provider value={{ isProduction, apiURL, setIsProduction }}>
      {children}
    </ProductionContext.Provider>
  );
};
