
const app = require('./src/app');

const port = process.env.port || 2800;

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});