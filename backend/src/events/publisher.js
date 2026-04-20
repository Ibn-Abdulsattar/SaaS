import { pubClient } from "../config/redis.js"

export const publishEvent = async(event, payload)=>{
    await pubClient.publish(event, JSON.stringify(payload));
};