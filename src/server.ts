import app from "./app";

const server = app();

server.listen({host: '0.0.0.0', port: parseInt(process.env.PORT ?? '4000')}, (err) => {
	if (err) console.error(err);
	console.log(`server listening on ${process.env.PORT || 4000}`);
})

// Graceful shutdown of server
process.on('SIGINT', () => {
	console.log('\n[server][SIGINT] Shutting down...');
	server.close();
	process.exit();
})

process.on('SIGTERM', () => {
	console.log('\n[server][SIGTERM] Shutting down...');
	server.close();
	process.exit();
})

process.on('uncaughtException', (error) => {
	console.log(error);
	console.log('\n[server][uncaughtException] Shutting down...');
	server.close();
	process.exit();
})