import { useEffect, useState } from "react";
import { getQueueManager } from "../services/queue/queue-manager";
import { TypedSocket } from "../types/socket";

const useSocket = () => {
  const [socket, setSocket] = useState<TypedSocket | null>(null);

  useEffect(() => {
    let isMounted = true;
    let currentSocket: TypedSocket | null = null;

    const setupSocket = async () => {
      try {
        const manager = await getQueueManager();
        currentSocket = manager.socket;

        if (isMounted && currentSocket) {
          setSocket(currentSocket);
        }

        const onConnect = () => {
          if (isMounted && currentSocket) {
            console.log("Socket connected");
            setSocket(currentSocket);
          }
        };

        currentSocket?.on("connect", onConnect);

        return () => {
          currentSocket?.off("connect", onConnect);
        };
      } catch (err) {
        console.error("Error initializing socket in useSocket:", err);
      }
    };

    const cleanupPromise = setupSocket();

    return () => {
      isMounted = false;
      cleanupPromise.then((cleanup) => {
        if (typeof cleanup === "function") cleanup();
      });
    };
  }, []);

  return socket;
};

export default useSocket;
