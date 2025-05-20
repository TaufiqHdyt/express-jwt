export const config = {
  port: 3500,
  name: 'express-be',
  db: {
    provider: 'mysql',
    host: 'localhost',
    user: 'user',
    password: 'pw',
    database: 'db',
    socket: '/path/to/db.sock',
    charset: 'utf8mb4',
    rejectEmpty: true,
  },
  jwt: {
    secret: 'secret-app-express-be',
    refreshSecret: 'secret-refresh-app-express-be',
    expired: 18000000,
  },
  public: {
    folder: '/path/to/folder',
  },
  debug: false,
};
