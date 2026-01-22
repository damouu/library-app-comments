import client from 'prom-client';

export const register = new client.Registry();

register.setDefaultLabels({
    service: 'comments-service'
});

client.collectDefaultMetrics({register});

const httpRequestCounter = new client.Counter({
    name: 'http_request_total', help: 'total number of HTTP requests', label: ['method', 'route', 'status'],
});

export const trackRequests = (req, res, next) => {
    res.on('finish', () => {
        httpRequestCounter.inc({
            method: req.method, route: req.route, status: req.status,
        });
    });
    next();
};