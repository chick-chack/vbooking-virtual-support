import { useEffect, useState } from "react";

import VverseRouter from "router";
// import NotAuthRouter from "router/NotAuthRouter";

import UserContext from "context/userContext";
import { notification } from "antd";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const offlineListener = window.addEventListener("offline", () => {
      notification.error({ message: "You lost your internet connection!" });
    });
    const onlineListener = window.addEventListener("online", () => {
      notification.success({
        message: "Your connection have been restored!",
      });
    });

    return () => {
      window.removeEventListener("offline", offlineListener);
      window.removeEventListener("online", onlineListener);
    };
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const {
  //         data: { data: user },
  //       } = await AuthService.getAuth();

  //       localStorage.setItem(
  //         "vverse-token",
  //         user.customerWebDashboardAccessToken,
  //       );
  //       setUser(user);
  //       axios.defaults.headers.authorization =
  //         user.customerWebDashboardAccessToken;
  //     } catch (ignored) {
  //       setUser(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, []);

  return loading ? (
    <div className="loading-holder">
      <video autoPlay muted loop className="video-loading">
        <source src={require("./assets/loading.mp4")} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  ) : (
    <UserContext.Provider value={{ user, setUser }}>
      <VverseRouter />
      {/* {user ? <VverseRouter /> : <NotAuthRouter />} */}
    </UserContext.Provider>
  );
}

export default App;
