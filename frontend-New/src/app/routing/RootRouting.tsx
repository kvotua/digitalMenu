import { Route, Routes } from "react-router-dom";
import { publicRoutes } from "./RootRoutes";  //authRoutes,
// import { IsAuth } from "./IsAuth";
// import { PointInfo } from "src/pages/PointAdd/PointInfo";
// import PointAdd from "src/pages/PointAdd/PointAdd";
// import { PointContact } from "src/pages/PointAdd/PointContact";
// import { PointFile } from "src/pages/PointAdd/PointFile";
// import { Suspense } from "react";

const RootRouting: React.FC = () => {
  return (
    <main className="container">

       <Routes>
        {publicRoutes.map(({ Element, path }) => (
          <Route key={path} path={path} element={<Element />} />
        ))}
         </Routes>
        {/*
        {authRoutes.map(({ Element, path }) => (
          <Route
            key={path}
            path={path}
            element={
              <IsAuth>
                <Element />
              </IsAuth>
            }
          />
        ))}
        <Route
          path="/points/add/step/*"
          element={
            <Suspense fallback={<>Загрузка</>}>
              <PointAdd />
            </Suspense>
          }
        >
          <Route path="1" element={<PointInfo />} />
          <Route path="2" element={<PointContact />} />
          <Route path="3" element={<PointFile />} />
        </Route>
      */}
    </main>
  );
};

export { RootRouting };