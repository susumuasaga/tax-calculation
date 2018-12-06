import { Router } from 'express';
import { Model } from 'express-cassandra';
import { LocationDoc, Location } from '../models/Entity';

/**
 * Create Transactions route.
 * @param logger Error logger to defect diagnostics.
 */
export function getLocationsRouter(
  locationModel: Model<LocationDoc>
): Router {
  const router = Router();

  router.get('/', async (req, res) => {
    const query = req.query as { [key: string]: any };
    const locations = await locationModel.findAsync(
      query, { raw: true, allow_filtering: true }
    );
    res.json(locations);
  });

  return router;
}
