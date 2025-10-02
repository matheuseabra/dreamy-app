# Dreamy Studio - Server

Minimal Express scaffold for the Dreamy Studio project.

Setup


1. Install dependencies:

	npm install

2. Development (auto-restart via ts-node-dev):

	npm run dev

3. Build to JavaScript:

	npm run build

4. Run compiled code:

	npm start

Default port: 5173 (can be overridden with the PORT environment variable)

Health endpoint

GET /health -> { status: 'ok', uptime: number }

Quick verification (from project root):

	cd server
	npm run dev
	# or build & run
	npm run build
	npm start

