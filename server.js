require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Production server running on port ${PORT}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`🔧 Port: ${PORT}`);
});
