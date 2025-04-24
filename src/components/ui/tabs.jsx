import React, { useState, createContext, useContext } from 'react';

const TabsContext = createContext();

export const Tabs = ({ defaultValue, className, children, ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`${className || ''}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ className, children, ...props }) => {
  return (
    <div className={`flex space-x-2 border-b ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, className, children, ...props }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      className={`px-4 py-2 ${isActive ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'} ${className || ''}`}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, className, children, ...props }) => {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) return null;
  
  return (
    <div className={`mt-4 ${className || ''}`} {...props}>
      {children}
    </div>
  );
};
