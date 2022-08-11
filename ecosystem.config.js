module.exports = {
	apps: [
		{
			name: "foodbear-api",
			script: "dist/src/server.js",
			time: true,
			env: {
				NODE_ENV: "production"
			},
			exec_mode: "fork"
		}
	]
}
