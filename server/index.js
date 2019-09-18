const { Server } = require('r3lab-server');
const MongoClient = require('mongodb').MongoClient;
const routes = require('./services/index');

(async () => {
	const client = await MongoClient.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@127.0.0.1:27017`, { useNewUrlParser: true, useUnifiedTopology: true });
	const serverConfig = {
		db: client.db('firme'),
		routes: {
			'/api/companydata/:cif': routes.CompanyData
		}
	};

	const app = new Server(serverConfig);

	app.listen(2424);
})();