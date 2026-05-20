import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const { role, name, email } = user;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/user");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold break-words">
          Welcome {name}
        </h1>

        <p className="mt-2 text-slate-500 text-sm sm:text-base break-all">
          {email}
        </p>

        <div className="mt-4">
          <span className="px-4 py-1 rounded-full bg-indigo-100 text-indigo-600 text-sm">
            {role}
          </span>
        </div>

        <div className="mt-6">
          <p className="text-xs break-all text-slate-400">
            {token}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white py-3 rounded-2xl text-sm sm:text-base transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;