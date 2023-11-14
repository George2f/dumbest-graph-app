import Dashboard from './pages/dashboard';
import Graph from './pages/graph';
import Root from './pages';
import {
    Navigate,
    Outlet,
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom';

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
            <Route path="graph" element={<Graph />} />
            <Route path="*" element={<Navigate to="dashboard" />} />
        </Route>
    )
);

export default function App() {
    return <RouterProvider router={router} />;
}
