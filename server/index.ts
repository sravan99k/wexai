import app from '../api/index.js';
import { checkConnection } from '../api/db.js';

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  checkConnection();
});
