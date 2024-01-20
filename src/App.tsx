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
import Nodes from './pages/nodes';
import Links from './pages/links';
import Tags from './pages/tags';

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
            <Route path="nodes" element={<Nodes />} />
            <Route path="links" element={<Links />} />
            <Route path="tags" element={<Tags />} />
            <Route
                path="graph"
                element={
                    <Suspense fallback={null}>
                        <Graph />
                    </Suspense>
                }
            />
            <Route path="*" element={<Navigate to="nodes" />} />
        </Route>
    )
);

export default function App() {
    return <RouterProvider router={router} />;
}
