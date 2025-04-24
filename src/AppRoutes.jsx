import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useToastContext } from "./components/contexts/ToastContext.js";
import AppLayout from "./AppLayout.jsx";
import Tracks from "./pages/Tracks.jsx";
import UpdateModal from "./components/TrackList/Modals/UpdateModal.jsx";
import CreateModal from "./components/TrackList/Modals/CreateModal.jsx";
import Toast from "./components/common/Toast.jsx";

export function AppRoutes() {
  const location = useLocation();
  const { toast, hideToast } = useToastContext();
  const background = location.state?.background;

  return (
    <>
      <Routes location={background || location}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to={"tracks"} />} />
          <Route path={"tracks"} element={<Tracks />} />
          <Route
            path="tracks/:slug/edit"
            element={
              <>
                <Tracks />
                <UpdateModal />
              </>
            }
          />
          <Route
            path="tracks/create"
            element={
              <>
                <Tracks />
                <CreateModal />
              </>
            }
          />
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route path={"/tracks/:slug/edit"} element={<UpdateModal />} />
          <Route path={"/tracks/create"} element={<CreateModal />} />
        </Routes>
      )}
      <Toast
        open={toast.open}
        onClose={hideToast}
        message={toast.message}
        severity={toast.severity}
      />
    </>
  );
}

export default AppRoutes;
