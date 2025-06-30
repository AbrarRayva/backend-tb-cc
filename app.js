const express = require("express");
const cors = require("cors");

// Untuk express
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Menyimpan todos
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
        description:
            "Kerja kelompok bersama kelompok 5 untuk tugas besar Data Mining.",
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

// Menyimpan total ID
let totalId = todos.length + 1;

// Return response berhasil
function responseSuccess(message, data) {
    return {
        status: "success",
        message,
        data
    };
}

// Format response error
function responseError(message) {
    return {
        status: "error",
        message
    };
}

// GET /api/todos (Ambil list to-do)
app.get("/api/todos", (req, res) => {
    res.json(responseSuccess("Data retrieved successfully", todos));
})

// POST /api/todos (Tambah to-do)
app.post("/api/todos", (req, res) => {
    const { title, description, completed, dueDate } = req.body;

    if (!title || !description || !completed || !dueDate) {
        return (res.status(400).json(responseError('All field must be filled (title, description, completed, dueDate)')))
    }

    const newTodo = {
        id: totalId++,
        title,
        description,
        completed: completed || false,
        dueDate,
        createdAt: new Date().toISOString(),
    };
    todos.push(newTodo);

    res.status(201).json(responseSuccess("To-do added succesfully", newTodo));
});

// GET /api/todos/:id (Ambil to-do dengan id spesifik)
app.get('/api/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === req.params.id);

    if (!todo) {
        return res.status(404).json(responseError('To-do with the given ID not found'));
    }

    res.json(responseSuccess('Data retrieved successfully', todo));
});

// PUT /api/todos/:id (Update to-do dengan id spesifik)
app.put("/api/todos/:id", (req, res) => {
    const updatedTodo = todos.find(t => t.id == req.params.id);
    if (!updatedTodo) {
        return res.status(404).json(responseError('To-do with the given ID not found'));
    }

    const { title, description, completed, dueDate } = req.body;

    updatedTodo.title = title ?? todo.title;
    updatedTodo.description = description ?? todo.description;
    updatedTodo.completed = completed ?? todo.completed;
    updatedTodo.dueDate = dueDate ?? todo.dueDate;

    res.status(200).json(responseSuccess("To-do updated succesfully", updatedTodo));
});

// DELETE /api/todos/:id (Delete item dari list to-do dengan id spesifik)
app.delete("/api/todos/:id", (req, res) => {
    const index = todos.findIndex(t => t.id == req.params.id);
    if (index === -1) {
        return res.status(404).json(responseError("To-do with the given ID not found"));
    }

    const deleted = todos.splice(index, 1);
    res.json(responseSuccess("To-do deleted successfully", deleted[0]));
});

// Jalankan server express
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});