import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks");
    setTasks(res.data);
  };

  const register = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      alert(res.data.message);
      setIsLogin(true);
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  const login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const addTask = async () => {
    if (!title) return;

    await axios.post("http://localhost:5000/api/tasks", {
      title,
      status: "Pending",
      priority: "Medium",
    });

    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    fetchTasks();
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow w-96">
          <h1 className="text-2xl font-bold mb-4 text-center">
            {isLogin ? "Login" : "Register"}
          </h1>

          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              className="border p-2 w-full mb-3 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full mb-3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="bg-blue-500 text-white w-full p-2 rounded"
            onClick={isLogin ? login : register}
          >
            {isLogin ? "Login" : "Register"}
          </button>

          <p className="mt-4 text-center">
            <button
              className="text-blue-500"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Create Account"
                : "Already have an account?"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-3xl font-bold">
            Task Manager
          </h1>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder="New Task"
            className="border p-2 flex-1 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button
            onClick={addTask}
            className="bg-green-500 text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        {tasks.map((task) => (
          <div
            key={task._id}
            className="border p-3 rounded mb-3 flex justify-between"
          >
            <div>
              <h3 className="font-semibold">
                {task.title}
              </h3>

              <p>{task.status}</p>
            </div>

            <button
              onClick={() => deleteTask(task._id)}
              className="bg-red-500 text-white px-3 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;