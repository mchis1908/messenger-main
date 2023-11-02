const express = require('express');
const userRoutes = require('./src/routes/userRoutes'); 

const app = express();

app.use(express.json());

app.use('/user', userRoutes);
// app.use('/chat', chatRoutes);


// app.use((req, res) => {
//   res.status(404).json({ error: 'Not Found' });
// });

// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ error: 'Internal server error' });
// });

const PORT = 8383;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
