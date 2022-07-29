import { Router } from 'express';
import m$todo from '#module/dashboard/todo.m.mjs';
import response from '#helper/response.mjs';
import userCookie from '#helper/middleware.mjs';

const TodoController = Router();

TodoController.get('/', userCookie, async (req, res, next) => {
  const c$list = await m$todo.list({ ...req.query, user: req.user.name });
  response.send(res, c$list);
});

TodoController.get('/:id', userCookie, async (req, res, next) => {
  const c$detail = await m$todo.detail(req.params);
  response.send(res, c$detail);
});

TodoController.post('/', userCookie, async (req, res, next) => {
  const c$add = await m$todo.add({ ...req.body, user: req.user.name });
  response.send(res, c$add);
});

TodoController.put('/:id', userCookie, async (req, res, next) => {
  const c$update = await m$todo.update({ ...req.params, ...req.body, user: req.user.name });
  response.send(res, c$update);
});

TodoController.delete('/:id', userCookie, async (req, res, next) => {
  const c$del = await m$todo.delete({ ...req.params, user: req.user.name });
  response.send(res, c$del);
});

export { TodoController };
