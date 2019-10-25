const express = require("express");

const server = express();

server.use(express.json());

const users = ["Thiago", "João", "Amor"];

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

function checkUserExistis(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "Nome de usuário é requerido" });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "Usuário não existe" });
  }

  req.user = user;

  return next();
}

// Listar todos usários
server.get("/users", (req, res) => {
  return res.json(users);
});

// Listar um usário
server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

// Criar usuário
server.post("/users", checkUserExistis, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

// Editar usuário
server.put("/users/:index", checkUserExistis, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

// Deletar usuário
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
