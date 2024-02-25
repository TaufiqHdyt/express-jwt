import db from '#helper/db.mjs';
import config from '#config/app.config.json' assert { type: 'json' };

import { object, string, boolean } from 'yup';

const schema = object({
  title: string().label('Title').required(),
  description: string().label('Description').required(),
  completed: boolean().label('Completed').when(('$update', ([update], schema) => (update ? schema.required() : schema))),
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
          })
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
      const { title, description, category, user, completed } = body;

      await schema.validate(body);

      const todo = await db.toDo.create({
        data: {
          title,
          description,
          completed,
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
      
      if (Object.keys(body).length === 0) {
        return {
          status: false,
          error: 'Update body is empty. Provide at least one field to update.',
        };
      }
      // await schema.validate(body, { context: { update: true } });
  
      const updateData = {};
  
      if (title !== undefined) {
        updateData.title = title;
      }
  
      if (description !== undefined) {
        updateData.description = description;
      }
  
      if (completed !== undefined) {
        updateData.completed = completed;
      }
  
      const update = await db.toDo.update({
        where: {
          id: +id,
        },
        data: updateData,
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
