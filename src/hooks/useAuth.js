import { connectorsByName } from "../lib/web3React";
import { toast } from "react-toastify";

const useAuth = () => {
  const login = async (connectorId) => {
    const connector = connectorsByName[connectorId];
    if (connector) {
      if (connectorId === "injected") {
        await connector.activate(137);
      } else {
        await connector.activate(connector.connectorId);
      }
    } else {
      toast.error(`Connector with id ${connectorId} not found`);
      throw new Error(`Connector with id ${connectorId} not found`);
    }
  };

  const logout = async (connectorId) => {
    const connector = connectorsByName[connectorId];
    if (connector) {
      await connector.deactivate();
    } else {
      toast.error(`Connector with id ${connectorId} not found`);
      throw new Error(`Connector with id ${connectorId} not found`);
    }
  };

  return { login, logout };
};

export default useAuth;
