import db from '#helper/db.mjs';
import config from '#config/app.config.json' assert { type: 'json' };

class _user {
  list = async (query = {}) => {
    try {
      const { detail, roleName } = query;
      const users = await db.user.findMany({
        where: {
          userRole: {
            every: {
              OR: roleName?.split(',')?.map((name) => ({
                roleName: {
                  equals: name,
                },
              })),
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
      return {
        status: true,
        data: users?.map(({ id, name, userRole: [{ roleName }] }) => ({
          id,
          name,
          role: roleName,
        })),
      };
    } catch (error) {
      if (config.debug) console.error(`list user module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  detail = async (params = {}) => {
    try {
      const { id } = params;
      const me = await db.user.findUniqueOrThrow({
        where: {
          id: Number(id) || undefined,
        },
        select: {
          name: true,
          email: true,
        },
      });
      return {
        status: true,
        data: {
          name: me.name,
          email: me.email,
          bio: me.profile.bio,
        },
      };
    } catch (error) {
      if (config.debug) console.error(`detail user module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  add = async (body = {}) => {
    try {
      const { name, role } = body;
      const { userRole: [{ roleName }], ...addUser } = await db.user.create({
        data: {
          name,
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
      return {
        status: true,
        data: {
          ...addUser,
          role: roleName,
        },
      };
    } catch (error) {
      if (config.debug) console.error(`add user module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  update = async (params = {}, body = {}) => {
    try {
      const { id } = params;
      const { name, email, bio } = body;
      const update = await db.user.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          email,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      return {
        status: true,
        data: {
          id: update.id,
          name: update.name,
          email: update.email,
        },
      };
    } catch (error) {
      if (config.debug) console.error(`update user module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  delete = async (params = {}) => {
    try {
      const { id } = params;
      const deleteUser = await db.user.delete({
        where: {
          id: Number(id),
        },
      });
      return {
        status: true,
        data: {
          name: deleteUser.name,
        },
      };
    } catch (error) {
      if (config.debug) console.error(`delete user module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
}

export default new _user();
