const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Sample todos
let todos = [
    {
        id: 1,
        title: "Cloud Computing di Gedung H",
        description: "Mengikuti kelas Cloud Computing selasa bersama asdos.",
        completed: true,
        dueDate: "2025-06-28",
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        title: "Workshop BEM KM FTI UNAND",
        description: "Mengikuti workshop Dinas Medinkraf BEM KM FTI UNAND.",
        completed: false,
        dueDate: "2025-07-01",
        createdAt: new Date().toISOString(),
    },
    {
        id: 3,
        title: "Kerja Kelompok Data Mining",
        description: "Kerja kelompok bersama kelompok 5 untuk tugas besar Data Mining.",
        completed: false,
        dueDate: "2025-07-03",
        createdAt: new Date().toISOString(),
    },
    {
        id: 4,
        title: "Tugas Besar PBD",
        description: "Presentasi Tugas Besar Perancangan Basis Data.",
        completed: false,
        dueDate: "2025-07-05",
        createdAt: new Date().toISOString(),
    },
];

let totalId = todos.length + 1;

function responseSuccess(message, data) {
    return {
        status: "success",
        message,
        data,
    };
}

function responseError(message) {
    return {
        status: "error",
        message,
    };
}

// GET all todos
app.get("/api/todos", (req, res) => {
    res.json(responseSuccess("Data retrieved successfully", todos));
});

// POST create todo
app.post("/api/todos", (req, res) => {
    const { title, description, completed, dueDate } = req.body;

    if (!title || !description || typeof completed !== "boolean" || !dueDate) {
        return res.status(400).json(
            responseError("All fields must be filled correctly (title, description, completed[boolean], dueDate)")
        );
    }

    const newTodo = {
        id: totalId++,
        title,
        description,
        completed,
        dueDate,
        createdAt: new Date().toISOString(),
    };
    todos.push(newTodo);

    res.status(201).json(responseSuccess("To-do added successfully", newTodo));
});

// GET todo by id
app.get("/api/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
        return res.status(404).json(responseError("To-do with the given ID not found"));
    }

    res.json(responseSuccess("Data retrieved successfully", todo));
});

// PUT update todo by id
app.put("/api/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
        return res.status(404).json(responseError("To-do with the given ID not found"));
    }

    const { title, description, completed, dueDate } = req.body;

    todo.title = title ?? todo.title;
    todo.description = description ?? todo.description;
    if (typeof completed === "boolean") {
        todo.completed = completed;
    }
    todo.dueDate = dueDate ?? todo.dueDate;

    res.status(200).json(responseSuccess("To-do updated successfully", todo));
});

// DELETE todo by id
app.delete("/api/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex((t) => t.id === id);

    if (index === -1) {
        return res.status(404).json(responseError("To-do with the given ID not found"));
    }

    const deleted = todos.splice(index, 1);
    res.json(responseSuccess("To-do deleted successfully", deleted[0]));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});