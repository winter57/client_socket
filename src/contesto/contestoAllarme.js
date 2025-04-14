import React, { createContext, useState, useContext } from 'react';

const AlarmContext = createContext();

export const AlarmProvider = ({ children }) => {
  const [alarms, setAlarms] = useState({});

  const setAlarm = (id, isInAlarm) => {
    setAlarms(prevAlarms => ({
      ...prevAlarms,
      [id]: isInAlarm,
    }));
  };

  return (
    <AlarmContext.Provider value={{ alarms, setAlarm }}>
      {children}
    </AlarmContext.Provider>
  );
};

export const useAlarm = () => useContext(AlarmContext);
