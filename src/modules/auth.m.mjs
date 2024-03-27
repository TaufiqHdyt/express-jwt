import db from '#helper/db.mjs';
import { config } from '#config';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { object, string } from 'yup';

const schema = object({
  name: string()
    .label('Name')
    .when(
      ('$register',
      ([register], schema) => (register ? schema.required() : schema)),
    ),
  username: string().label('Username').required(),
  password: string().label('Password').required(),
  role: string().label('Password'),
});

// extend session time to additional
// hour: k * min * second * ms
const refreshTime = 2 * 60 * 60 * 1000;

class _auth {
  register = async (body = {}) => {
    try {
      const { name, username, password, role } = body;

      await schema.validate(body, { context: { register: true } });

      const check = await db.user.findUnique({
        where: {
          name,
        },
      });

      if (check?.username) {
        throw new Error('User already registered');
      }

      const pw = bcrypt.hashSync(password, 10);

      let user = {};

      if (check) {
        user = await db.user.update({
          where: {
            name,
          },
          data: {
            username,
            password: pw,
          },
          select: {
            id: true,
            name: true,
            userRole: {
              select: {
                roleName: true,
              },
            },
          },
        });
      } else {
        user = await db.user.create({
          data: {
            name,
            username,
            password: pw,
            userRole: {
              connectOrCreate: {
                where: {
                  userName: name,
                },
                create: {
                  role: {
                    connect: {
                      name: role ?? 'User',
                    },
                  },
                },
              },
            },
          },
          select: {
            id: true,
            name: true,
            userRole: {
              select: {
                roleName: true,
              },
            },
          },
        });
      }

      return {
        status: true,
        data: {
          name: user.name,
          role: user.userRole?.map(({ roleName }) => roleName),
        },
      };
    } catch (error) {
      if (config.debug) console.error(`register auth module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  login = async (body = {}) => {
    try {
      const { username, password } = body;
      const {
        jwt: { expired, secret },
      } = config;

      await schema.validate(body);

      const check = await db.user.findUniqueOrThrow({
        where: {
          username,
        },
        select: {
          username: true,
          name: true,
          password: true,
          userRole: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!bcrypt.compareSync(password, check.password)) {
        return {
          status: false,
          code: 401,
          error: 'Wrong password',
        };
      }

      const payload = {
        id: check.username,
        name: check.name,
        role: check.userRole[0].role,
      };

      const now = Date.now();
      const token = jwt.sign(payload, secret, { expiresIn: String(expired) });
      const expiresAt = new Date(now + expired);

      return {
        status: true,
        data: { token, expiresAt },
      };
    } catch (error) {
      if (config.debug) console.error(`login auth module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  logout = async (session) => {
    try {
      await db.session.delete({
        where: {
          id: session,
        },
      });
      return {
        status: true,
        data: 'Logout success',
      };
    } catch (error) {
      if (config.debug) console.error(`logout auth module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  session = async (user = {}) => {
    try {
      return {
        status: true,
        data: {
          ...user,
          role: user.role.name,
          session: undefined,
        },
      };
    } catch (error) {
      if (config.debug) console.error(`session auth module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
}

export default new _auth();
