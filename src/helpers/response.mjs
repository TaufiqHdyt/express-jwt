import config from '#config/app.config.json' assert { type: 'json' };

class Response {
  send = (res, { code, status, data, error }) => {
    try {
      if (Array.isArray(data) && !data.length) {
        status = false;
        error = 'Data is Empty';
        data = undefined;
      }
      const responseData = {
        status,
        error: error?.meta?.cause ?? error?.message ?? error,
        data,
      };
      res.status(code ? code : status ? 200 : 400).send(responseData);
      return true;
    } catch (error) {
      if (config.debug) console.error(`send response helper error`, error);
      res.status(400).send({
        status: false,
        error,
      });
    }
  };
  catchAll = (req, res, next) => {
    this.send(res, {
      status: false,
      error: "Can't find this route!",
    });
  };
  errorHandler = (err, req, res, next) => {
    if (typeof err === 'string') {
      // custom application error
      return res.status(400).json({ data: err });
    }

    if (err.code === 'permission_denied') {
      return res.status(403).send('Forbidden');
    }

    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ status: false, error: 'Invalid Token' });
    }

    // default to 500 server error
    return res.status(500).json({ status: false, error: err.message });
  };
}

export default new Response();
