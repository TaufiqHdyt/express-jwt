import { AuthController } from '#controller/auth.c.mjs';
import { TodoController } from '#controller/dashboard/todo.c.mjs';

const baseRoutesArray = [['auth', AuthController]];

const apiRoutesArray = [['todo', TodoController]];

const routes = (app) => {
  baseRoutesArray.forEach(([url, controller]) =>
    app.use(`/${url}`, controller)
  );
  apiRoutesArray.forEach(([url, controller]) =>
    app.use(`/api/${url}`, controller)
  );
};

export { routes };
