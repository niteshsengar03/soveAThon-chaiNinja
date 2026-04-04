import "dotenv/config"
import app from "./src/app.js"
import connectDB from "./src/common/config/db.js"
import { connectRedis } from "./src/common/config/redis.config.js"
import { startScheduler } from "./src/common/services/scheduler.service.js"

const PORT = process.env.PORT || 5000

const start = async () => {
    // connect to database
    await connectDB()

    // connect to Redis
    await connectRedis()

    // start complaint scheduler
    startScheduler()

    app.listen(PORT, () => {
        console.log(`Server is running at ${PORT} in ${process.env.NODE_ENV} mode`)
    })
}

start().catch((err) => {
    console.error("Failed to start server", err)
    process.exit(1)
})

