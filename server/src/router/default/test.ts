import { Router } from 'express';


export function testRoutes() {

  const router = Router();

  router.get('/', (req, res) => {


    res.send('test');
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