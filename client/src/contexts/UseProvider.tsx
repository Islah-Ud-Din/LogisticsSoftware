import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [email, setEmail] = useState('');
    const [recordingId, setRecordingId] = useState('');

    return <UserContext.Provider value={{ email, setEmail, recordingId, setRecordingId }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
