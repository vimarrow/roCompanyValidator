const { Server } = require('r3lab-server');
const MongoClient = require('mongodb').MongoClient;
const routes = require('./services/index');

(async () => {
	const client = await MongoClient.connect('mongodb://atlasClaudit:iKNies6GHGpiEooZ@167.71.3.14:27017', { useNewUrlParser: true, useUnifiedTopology: true });
	const serverConfig = {
		db: client.db('firme'),
		routes: {
			'/api/companydata/:cif': routes.CompanyData
		}
	};
	
	const app = new Server(serverConfig);
	
	app.listen(2424);
})();