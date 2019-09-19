const { Route, ServerError } = require('r3lab-server');
const constants = require('../utils/constants');
const { cifValidation } = require('../utils/helpers');
const axios = require('axios');
const parseString = require('xml2js').parseString;

function shouldUpdate(past, now) {
	const pastArr = past.split('-');
	const nowArr = now.split('-');
	if(Number(pastArr[0]) < Number(nowArr[0])){
		return true;
	}

	if(Number(pastArr[1]) < Number(nowArr[1])) {
		return true;
	}

	return false;
}

function formatSOAP(cif, cod){
return (
`<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <tns1:checkVat xmlns:tns1='urn:ec.europa.eu:taxud:vies:services:checkVat:types'>
      <tns1:countryCode>${cod}</tns1:countryCode>
      <tns1:vatNumber>${cif}</tns1:vatNumber>
    </tns1:checkVat>
  </soap:Body>
</soap:Envelope>`
);
}

class CompanyData extends Route {
	constructor(...args){
		super(...args);
		this.headers = constants.STD_HEADERS;
	}

	async get() {
		const { cif } = this.params;
		const cod = this.query.cod === undefined ? 'RO' : this.query.cod;
		const today = new Date();
		const formattedToday = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
		const cifComplet = cod + '-' + cif;
		if(cod === 'RO' && (!cifValidation(cif) || isNaN(Number(cif)))) {
			throw ServerError(400, 'invalid', 'CIF invalid');
		}
		let mfinante = cod === 'RO' ? await this.db.collection('mfinante').findOne({_id: Number(cif)}) : {};
		let anaf = cod === 'RO' ? await this.db.collection('anaf').findOne({_id: Number(cif)}) : {};
		let vies = (await this.db.collection('vies').findOne({_id: cod + '-' + cif})) || {};
		if (cod === 'RO' && (!anaf || !Object.keys(anaf).length || shouldUpdate(anaf.data, formattedToday))) {
			console.log('request from ANAF: '+formattedToday);
			const { data: anafRaw } = await axios.post('https://webservicesp.anaf.ro/PlatitorTvaRest/api/v4/ws/tva', [{"cui": cif, "data": formattedToday}]);
			if(anafRaw.cod === 200 && anafRaw.message === 'SUCCESS' && anafRaw.found[0] && Object.keys(anafRaw.found[0]).length) {
				const rAnaf = {...anafRaw.found[0]};
				anaf = rAnaf;
				const _id = rAnaf.cui;
				delete rAnaf.cui;
				const newAnaf = {_id,...rAnaf};
				await this.db.collection('anaf').insertOne(newAnaf);
				console.log('inserted into ANAF: '+formattedToday);
			};
		}
		if (!vies || !Object.keys(vies).length || shouldUpdate(vies.data, formattedToday)) {
			console.log('request from VIES: '+formattedToday);
			const { data: viesRaw } = await axios.post('http://ec.europa.eu/taxation_customs/vies/services/checkVatService', formatSOAP(cif, cod || 'RO'));
			parseString(viesRaw, async (err, result) => {
				if(err) {
					console.error('error parsing VIES response');
					return;
				}
				const body = result['soap:Envelope']['soap:Body'][0];
				if(body['soap:Fault'] && body['soap:Fault'][0] && body['soap:Fault'][0]['faultcode']){
					console.error('error from VIES: ', body['soap:Fault'][0]['faultstring']);
				} else if(body['checkVatResponse'] && body['checkVatResponse'][0] && Object.keys(body['checkVatResponse'][0]).length && body['checkVatResponse'][0]['valid'] && body['checkVatResponse'][0]['valid'].length) {
					const checkVatResponse = body['checkVatResponse'][0];
					const newVies = {
						_id: cifComplet,
						data: checkVatResponse['requestDate'][0],
						valid: checkVatResponse['valid'][0] === "true",
						name: checkVatResponse['name'][0],
						address: checkVatResponse['address'][0]
					};
					vies = newVies;
					await this.db.collection('vies').insertOne(newVies);
					console.log('inserted into VIES: '+formattedToday);
				}
			});
		}
		if((!mfinante || !Object.keys(mfinante).length) && (!anaf || !Object.keys(anaf).length) && (!vies || !Object.keys(vies).length)) {
			throw ServerError(404, 'not found', 'Nu a fot gasit nici un agent ecomonic');
		}
		return { cifComplet, mfinante, anaf, vies };
	}

	onError(error) {
		this.status = error.status || 500;
		return { message: error.message };
	}

}

module.exports = CompanyData;