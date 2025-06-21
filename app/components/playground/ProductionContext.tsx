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
  const apiURL = isProduction
    ? process.env.NEXT_PUBLIC_PLAYGROUND_API_URL || ''
    : process.env.NEXT_PUBLIC_PRE_PROD_PLAYGROUND_API_URL || '';

  return (
    <ProductionContext.Provider value={{ isProduction, apiURL, setIsProduction }}>
      {children}
    </ProductionContext.Provider>
  );
};
