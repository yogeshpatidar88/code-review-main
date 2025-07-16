require('dotenv').config();

try {
    const app = require('./src/app');

    app.listen(3000, () => {
        console.log('✅ Server is running on http://localhost:3000');
    });
} catch (error) {
    console.error('❌ Error starting server:', error);
}
