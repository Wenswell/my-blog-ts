import { getAllCateg } from '@/db/models/CATEGORY';
import { Router } from 'express';


export function testRoutes() {

  const router = Router();

  router.get('/', async (req, res) => {


    const getcatelist = await getAllCateg();
    console.log('getcatelist', getcatelist);

    res.send(getcatelist);
  });

  router.post('/', (req, res) => {
    res.send('Method POST test successful!');
  });

  router.put('/', (req, res) => {
    res.send('Method PUT test successful!');
  });

  router.delete('/', (req, res) => {
    res.send('Method DELETE test successful!');
  });

  return router;

}