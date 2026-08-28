"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'SmartProcure Backend REST API Service',
        ministry: 'Ministry of Consumer Affairs, Food & Public Distribution',
        timestamp: new Date().toISOString()
    });
});
// Register API Routes
app.use('/api', routes_1.default);
// Start Server
app.listen(PORT, () => {
    console.log(`=================================================================`);
    console.log(`  🌾 SmartProcure REST API Server running on port ${PORT}`);
    console.log(`  🏛️  Ministry of Consumer Affairs, Food & Public Distribution`);
    console.log(`  🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=================================================================`);
});
