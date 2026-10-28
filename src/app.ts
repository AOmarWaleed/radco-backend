import express from 'express';
import { helmetMiddleware } from './shared/middleware/helmet.js';
import { corsMiddleware } from './shared/middleware/cors.js';
import { errorHandler } from './shared/middleware/error.js';
import { languageMiddleware } from './shared/middleware/language.js';
import { authRoutes } from './features/auth/auth.routes.js';
import { inventoryRoutes } from './features/inventory/inventory.routes.js';
import { warehousesRoutes } from './features/warehouses/warehouses.routes.js';
import { suppliersRoutes } from './features/suppliers/suppliers.routes.js';
import { employeesRoutes } from './features/employees/employees.routes.js';
import { itemCodeRoutes } from './features/item-code/item-code.routes.js';

const app = express();

// Security middleware
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(languageMiddleware);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check (public)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes());
app.use('/api/inventory', inventoryRoutes());
app.use('/api/warehouses', warehousesRoutes());
app.use('/api/suppliers', suppliersRoutes());
app.use('/api/employees', employeesRoutes());
app.use('/api/item-code', itemCodeRoutes());

// Error handler (must be last)
app.use(errorHandler);

export default app;
