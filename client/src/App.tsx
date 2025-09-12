import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoute";
import { useEffect } from "react";
import { setIsMobile } from "./redux/reducers/mics.reducer";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkMobile = () => {
      dispatch(setIsMobile(window.innerWidth < 768));
    };

    checkMobile(); // run once on mount
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
