import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/DashBoard/DashBoard';
import Login from './pages/Login/Login';
import MainLayout from './layout/MainLayout';
import AuthLayout from './layout/AuthLayout';
import University from './pages/University/University';
import Monitor from './pages/Monitor/Monitor';

const App = () => {
	return (
		<Router>
			<Routes>
				<Route element={<AuthLayout />}>
					<Route path="/" element={<Login />} />
				</Route>
				<Route element={<MainLayout />}>
					<Route path="/dashboard" element={<Dashboard />} />
				</Route>
				<Route element={<MainLayout />}>
					<Route path="/university" element={<University />} />
				</Route>
				<Route element={<MainLayout />}>
					<Route path="/monitor" element={<Monitor />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
