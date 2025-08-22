import { Link } from "react-router-dom";

const Sidebar = () => (
  <div className="sidebar">
    <Link to="/dashboard">Dashboard</Link>
    <Link to="/users">Users</Link>
    <Link to="/kyc">KYC</Link>

    <Link to="/logout" style={{ marginTop: "1rem", color: "red" }}>
      Logout
    </Link>
  </div>
);

export default Sidebar;
