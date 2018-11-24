import { Express } from 'express';
import { Server } from 'http';

/**
 * Promisify Express listen function
 */
export async function getServer(app: Express, port?: number): Promise<Server> {
  return new Promise<Server>(
    resolve => { const server = app.listen(3000, () => { resolve(server); }); }
  );
}
