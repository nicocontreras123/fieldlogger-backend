import { Controller, Get, Res, Inject } from '@nestjs/common';
import type { Response } from 'express';
import type { InspectionRepositoryPort } from '../../domain/inspection.repository.port';

/**
 * Inspection Events Controller - Server-Sent Events (SSE)
 * 
 * Provides a lightweight real-time update mechanism using SSE.
 * Clients receive automatic updates when new inspections are created.
 * No additional libraries needed - uses native HTTP.
 */
// Global store for SSE clients (shared across all instances)
const globalClients: Response[] = [];

@Controller('inspections/events')
export class InspectionEventsController {
    // Use global clients array to ensure all instances share the same clients
    private clients = globalClients;

    constructor(
        @Inject('InspectionRepositoryPort')
        private readonly repository: InspectionRepositoryPort,
    ) { }

    /**
     * SSE endpoint for real-time inspection updates
     * Clients connect here to receive live updates
     */
    @Get('stream')
    async stream(@Res() res: Response) {
        // Set SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Send initial data
        const inspections = await this.repository.findAll();
        const data = {
            type: 'initial',
            count: inspections.length,
            inspections: inspections.map((i) => i.toJSON()),
            timestamp: new Date().toISOString(),
        };
        res.write(`data: ${JSON.stringify(data)}\n\n`);

        // Add to active clients
        this.clients.push(res);
        console.log(`🔌 SSE client connected. Total clients: ${this.clients.length}`);

        // Send heartbeat every 30 seconds to keep connection alive
        const heartbeat = setInterval(() => {
            res.write(`:heartbeat\n\n`);
        }, 30000);

        // Remove client on disconnect
        res.on('close', () => {
            clearInterval(heartbeat);
            this.clients = this.clients.filter((client) => client !== res);
            console.log(`🔌 SSE client disconnected. Total clients: ${this.clients.length}`);
        });
    }

    /**
     * Trigger a broadcast to all connected clients
     * Called when new inspections are created
     */
    async broadcastUpdate() {
        try {
            const inspections = await this.repository.findAll();
            const data = {
                type: 'update',
                count: inspections.length,
                inspections: inspections.map((i) => i.toJSON()),
                timestamp: new Date().toISOString(),
            };

            const message = `data: ${JSON.stringify(data)}\n\n`;

            // Send to all connected clients
            this.clients.forEach((client) => {
                try {
                    client.write(message);
                } catch (error) {
                    console.error('Error sending SSE to client:', error);
                }
            });

            console.log(`📢 Broadcasted update to ${this.clients.length} clients`);
        } catch (error) {
            console.error('Error broadcasting update:', error);
        }
    }

    /**
     * Get current active connections count
     */
    getActiveConnections(): number {
        return this.clients.length;
    }
}
