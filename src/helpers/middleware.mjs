import { config } from '#config';
import db from '#helper/db.mjs';
import response from '#helper/response.mjs';

import jwt from 'jsonwebtoken';

const checkPermission = async (roleId = 6, targetUrl) => {
  const pathByRoleId = await db.access.findMany({
    where: {
      roleId,
    },
    select: {
      path: true,
    },
  });
  const allowedPath = pathByRoleId?.filter(({ path }) =>
    targetUrl.startsWith(path),
  );
  return !!allowedPath.length;
};

const userAuth = async (req, res, next) => {
  try {
    const { headers, originalUrl } = req;
    const token = headers?.authorization?.startsWith('Bearer')
      ? headers?.authorization?.split(' ')[1]
      : null;

    if (!token) {
      throw new Error('Not Authenticated, No Session');
    }

    const decoded = jwt.verify(token, config.jwt.secret);

    const isAllowed = await checkPermission(decoded.role.id, originalUrl);

    if (!isAllowed) {
      throw new Error('Not Permitted');
    }

    const user = await db.user.findUniqueOrThrow({
      where: {
        username: decoded.id,
      },
      select: {
        id: true,
        name: true,
        username: true,
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

    req.user = {
      ...user,
      userRole: undefined,
      role: user.userRole[0].role,
    };

    next();
  } catch (error) {
    if (config.debug) console.error(`userAuth middleware helper error`, error);
    response.send(res, {
      status: false,
      error,
    });
  }
};

export default userAuth;
