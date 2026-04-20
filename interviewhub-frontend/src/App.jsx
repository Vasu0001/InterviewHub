import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Outlet />
    </div>
  );
}

export default App;
