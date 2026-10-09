import client from "prom-client";
import type {NextFunction, Request, Response} from "express";

export const register = new client.Registry();

register.setDefaultLabels({
    service: "comments-service",
});

client.collectDefaultMetrics({register});

const httpRequestCounter = new client.Counter({
    name: "http_request_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status"],
    registers: [register],
});

export function trackRequests(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    res.on("finish", () => {
        const route = req.route?.path ?? req.path;

        httpRequestCounter.inc({
            method: req.method,
            route,
            status: String(res.statusCode),
        });
    });

    next();
}