import Dashboard from './pages/dashboard';
import Root from './pages';
import {
    Navigate,
    Outlet,
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom';
import { Suspense, lazy } from 'react';

const Graph = lazy(() => import('./pages/graph'));

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="*"
            element={
                <Root>
                    <Outlet />
                </Root>
            }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route
                path="graph"
                element={
                    <Suspense fallback={null}>
                        <Graph />
                    </Suspense>
                }
            />
            <Route path="*" element={<Navigate to="dashboard" />} />
        </Route>
    )
);

export default function App() {
    return <RouterProvider router={router} />;
}
