import { readFile } from 'node:fs/promises';

const importJson = async (path) => {
  const jsonFile = await readFile(new URL(path, import.meta.url));
  return JSON.parse(jsonFile);
};

export { importJson };
