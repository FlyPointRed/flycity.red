const fs = require('fs');
const path = require('path');
const LRU = require('lru-cache');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const compression = require('compression');
const resolve = file => path.resolve(__dirname, file);
const { createBundleRenderer } = require('vue-server-renderer');

const isProd = process.env.NODE_ENV === 'production';
const serverInfo =
	`express/${require('express/package.json').version} ` +
	`vue-server-renderer/${require('vue-server-renderer/package.json').version}`;

const app = express();

function createRenderer(bundle, options) {
	return createBundleRenderer(bundle, Object.assign(options, {
		// for component caching
		cache: LRU({
			max: 1000,
			maxAge: 1000 * 60 * 15
		}),
		// this is only needed when vue-server-renderer is npm-linked
		basedir: resolve('./dist'),
		// recommended for performance
		runInNewContext: true
	}));
}


let renderer;
let readyPromise;
const templatePath = resolve('./src/index.template.html');
if (isProd) {
	// In production: create server renderer using built server bundle.
	// The server bundle is generated by vue-ssr-webpack-plugin.
	const template = fs.readFileSync(templatePath, 'utf-8');
	const bundle = require('./dist/vue-ssr-server-bundle.json');
	// The client manifests are optional, but it allows the renderer
	// to automatically infer preload/prefetch links and directly add <script>
	// tags for any async chunks used during render, avoiding waterfall requests.
	const clientManifest = require('./dist/vue-ssr-client-manifest.json');
	renderer = createRenderer(bundle, {
		template,
		clientManifest
	});
} else {
	// In development: setup the dev server with watch and hot-reload,
	// and create a new renderer on bundle / index template update.
	readyPromise = require('./build/setup-dev-server')(
		app,
		templatePath,
		(bundle, options) => {
			renderer = createRenderer(bundle, options);
		}
	);
}

const serve = (path, cache) => express.static(resolve(path), {
	maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 10 : 0
});

const MemoryStore = require('session-memory-store')(session);

app.use(session({
	name: 'lt_manage_center',
	secret: 'linktou-center-manager',
	resave: false,
	proxy: true,
	saveUninitialized: false,
	store: new MemoryStore({
		expires: 60 * 60 * 24, //Defined how long each session will be expired. In second.
		checkperiod: 10 * 60 //Defined how long MemoryStore will check for expired. In second.
	})
}));
app.use(bodyParser.json({ limit: '20000kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '20000kb' }));
app.use(compression({ threshold: 0 }));
app.use('/favicon.ico', serve('./public/logo.ico', true));
app.use('/dist', serve('./dist', true));
app.use('/public', serve('./public', true));
app.use('/assets', serve('./src/assets', true));
app.use('/manifest.json', serve('./manifest.json', true));
app.use('/service-worker.js', serve('./dist/service-worker.js'));
const { router } = require('./src/backend/process');
app.use('/fly', router);

app.use('*', function (req, res, next) {
	console.log(new Date().toLocaleTimeString(),'===>',req.ip,'===>',req.originalUrl)
	next();
});



function render(req, res) {
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Server', serverInfo);

	const handleError = err => {
		if (err.url) {
			res.redirect(err.url);
		} else if (err.code === 404) {
			res.status(404).end('404 | Page Not Found');
		} else {
			// Render Error Page or Redirect
			res.status(500).end('500 | Internal Server Error');
			console.error(`error during render : ${req.url}`);
			console.error(err.stack);
		}
	};

	const context = {
		url: req.url,
		session: req.session
	};

	renderer.renderToString(context, (err, html) => {
		if (err) {
			return handleError(err);
		}
		res.send(html);
	});

}

app.get('*', isProd ? render : (req, res) => {
	readyPromise.then(() => render(req, res));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`server started at localhost:${port}`);
});
