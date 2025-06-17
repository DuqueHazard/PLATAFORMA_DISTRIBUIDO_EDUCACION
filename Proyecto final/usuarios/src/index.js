import express from 'express';
import cors from 'cors';
import perfilRoutes from './EditPerfiles.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

app.use('/', perfilRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Microservicio USUARIOS corriendo en el puerto ${PORT}`);
});
