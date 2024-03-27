import db from '#helper/db.mjs';
import { config } from '#config';

import { object, string, boolean } from 'yup';

const schema = object({
  title: string()
    .label('Title')
    .when(
      ('$update', ([update], schema) => (!update ? schema.required() : schema)),
    ),
  description: string()
    .label('Description')
    .when(
      ('$update', ([update], schema) => (!update ? schema.required() : schema)),
    ),
  completed: boolean()
    .label('Completed')
    .when(
      ('$update', ([update], schema) => (update ? schema.required() : schema)),
    ),
});

class todo {
  list = async (query = {}) => {
    try {
      const { id, name, inquiry, user } = query;
      const todo = await db.toDo.findMany({
        where: {
          user: {
            name: user,
          },
        },
      });
      return {
        status: true,
        data: todo?.map(
          ({ id, createdAt, title, completed, description, categoryName }) => ({
            id,
            title,
            createdAt,
            completed,
            description,
            categoryName,
          }),
        ),
      };
    } catch (error) {
      if (config.debug) console.error(`list todo module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  detail = async (params = {}) => {
    try {
      const { id } = params;
      const detail = await db.toDo.findUniqueOrThrow({
        where: {
          id: Number(id) || undefined,
        },
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      });
      return {
        status: true,
        data: detail,
      };
    } catch (error) {
      if (config.debug) console.error(`detail todo module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  add = async (body = {}) => {
    try {
      const { title, description, category, user } = body;

      await schema.validate(body);

      const todo = await db.toDo.create({
        data: {
          title,
          description,
          completed: false,
          user: {
            connectOrCreate: {
              where: {
                name: user,
              },
              create: {
                name: user,
              },
            },
          },
          category: {
            connectOrCreate: {
              where: {
                name: category,
              },
              create: {
                name: category,
              },
            },
          },
        },
        select: {
          title: true,
        },
      });
      return {
        status: true,
        data: todo,
      };
    } catch (error) {
      if (config.debug) console.error(`add todo module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  update = async (body = {}) => {
    try {
      const { id, title, description, completed } = body;

      await schema.validate(body, { context: { update: true } });

      const update = await db.toDo.update({
        where: {
          id: +id,
        },
        data: {
          title,
          description,
          completed,
        },
        select: {
          title: true,
          completed: true,
        },
      });

      return {
        status: true,
        data: update,
      };
    } catch (error) {
      if (config.debug) console.error(`update todo module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  delete = async (params = {}) => {
    try {
      const { id } = params;
      const del = await db.toDo.delete({
        where: {
          id: Number(id),
        },
      });
      return {
        status: true,
        data: del,
      };
    } catch (error) {
      if (config.debug) console.error(`delete todo module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
}

export default new todo();
