import app from './app.js';
import { env } from './config/env.js';
import { startKeepAlive } from './shared/keepAlive.js';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startKeepAlive();
});

const stopKeepAlive = () => {
  // keepAlive module manages its own interval
};

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  if (typeof stopKeepAlive === 'function') stopKeepAlive();
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
  setTimeout(() => {
    process.exit(1);
  }, 10000);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  if (typeof stopKeepAlive === 'function') stopKeepAlive();
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
  setTimeout(() => {
    process.exit(1);
  }, 10000);
});

