import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class RedisService {
    private client: Redis;
    constructor() {
        this.client = new Redis({
            host: 'localhost',
            port: 6379,
        });
    }

    async set(key: string, value: string, ttl: number) {
        await this.client.set(key, value, 'EX', ttl);
    }

    async get(key: string) {
        return await this.client.get(key);
    }

    async del(key: string) {
        return await this.client.del(key);
    }
}
