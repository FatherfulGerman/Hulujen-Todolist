"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [value, setValue] = useState("");
  const [data, setData]: any = useState("");
  const [list, setList]: any = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("http://localhost:3000/api/todolist");
        setList(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const dataRetriever = async () => {
    try {
      const result = await axios.post("http://localhost:3000/api/todolist", {
        title: value,
      });
      setData(result.data);
      setValue("");
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      dataRetriever();
    }
  };

  const editTodo = async (id: string, updatedTitle: string) => {
    try {
      await axios.put(
        `http://localhost:3000/api/todolist?id=${id}`,
        { title: updatedTitle },
        { headers: { "Content-Type": "application/json" } }
      );

      const result = await axios.get("http://localhost:3000/api/todolist");
      setList(result.data);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete("http://localhost:3000/api/todolist", {
        data: { id },
      });

      setList((prevList: any) =>
        prevList.filter((task: any) => task.id !== id)
      );
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  useEffect(() => {
    if (data) {
      setList((prevList: any) => [...prevList, data]);
    }
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-4 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">To-Do List</h1>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            placeholder="Add a new task..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="transition px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none"
            onClick={dataRetriever}
          >
            Add
          </button>
        </div>
        <div>
          <ul className="space-y-3">
            {Array.isArray(list) ? (
              list.map((task: any) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded-lg gap-5"
                >
                  <span>{task.title}</span>
                  <div className="flex gap-1">
                    <button
                      className="text-red-500 hover:text-red-600 focus:outline-none"
                      onClick={() => deleteTodo(task.id)}
                    >
                      🗑️
                    </button>
                    <button
                      className="text-yellow-500 hover:text-yellow-600 focus:outline-none"
                      onClick={() => {
                        const newTitle = prompt("Edit task title:", task.title);
                        if (newTitle) editTodo(task.id, newTitle);
                      }}
                    >
                      ✏️
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li>{list.title}</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
