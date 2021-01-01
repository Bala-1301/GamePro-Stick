import React, {useState} from 'react';

export const ClientContext = React.createContext(null);

export default function Client({children}) {
  const [client, _setClient] = useState(null);

  const setClient = (client) => {
    _setClient(client);
  };

  const removeClient = () => {
    _setClient(null);
  };

  return (
    <ClientContext.Provider value={{client, setClient, removeClient}}>
      {children}
    </ClientContext.Provider>
  );
}
