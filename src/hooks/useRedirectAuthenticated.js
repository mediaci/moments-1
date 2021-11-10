import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router";

export const useRedirectAuthenticated = (redirectAuthenticated) => {
  const history = useHistory();

  useEffect(() => {
    const handleMount = async () => {
      try {
        await axios.post("/dj-rest-auth/token/refresh/");
        if (redirectAuthenticated) history.push("/");
      } catch (err) {
        if (!redirectAuthenticated) history.push("/");
      }
    };
    handleMount();
  }, [history, redirectAuthenticated]);
};
