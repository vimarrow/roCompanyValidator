import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import Modal from '@material-ui/core/Modal';
import Divider from '@material-ui/core/Divider';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	root: {
		minHeight: '800px',
		height: 'calc(100vh)'
	},
	nodata: {
		position: 'relative',
		top: '33%',
		color: '#CCC',
		fontWeight: 800
	},
	back: {
		color: theme.palette.primary.main,
		cursor: 'pointer',
		position: 'relative',
		top: 'calc(33% + 16px)',
		width: '128px',
		margin: 'auto'
	},
	tvaBtn: {
		color: theme.palette.primary.main,
		cursor: 'pointer',
		fontSize: 14
	},
	error: {
		position: 'relative',
		top: '50%'
	},
	errorColor:{
		fontWeight: 800,
		color: theme.palette.error.main
	},
	paper: {
		position: 'relative',
		width: '90%',
		margin: `${theme.spacing(8)}px auto`,
		overflowX: 'auto',
	},
	faded: {
		fontWeight:100,
		color: '#777'
	},
	modalTVA: {
		position: 'absolute',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		borderRadius: '5px',
		top: '50%',
		left: '50%',
		width: '80%',
		transform: 'translate(-50%, -50%)',
	},
	viesYes: {
		color: '#228B22'
	},
	viesNo: {
		color: theme.palette.error.main
	},
	table: {
		minWidth: 1200,
	}
});

function scrollTop() {
	window.scroll({
		top: 0, 
		behavior: 'smooth'
	});
}

function scrollBottom() {
	window.scroll({
		top: document.body.scrollHeight - window.innerHeight - 128, 
		behavior: 'smooth'
	});
}

class SearchResults extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasData: false,
			showTVA: false,
			isRO: true,
			errMsg: '',
			response: {}
		}
		this.goBack = this.goBack.bind(this);
		this.loadData = this.loadData.bind(this);
		this.displayData = this.displayData.bind(this);
		this.toggleShowTVA = this.toggleShowTVA.bind(this);
	}
	componentDidMount() {
		window.addEventListener('submitData', this.loadData, false);
	}
	loadData(ev) {
		const { cod, cif } = ev.detail;
		fetch(`http://167.71.3.14:2424/api/companydata/${cif}?cod=${cod}`).then(async (res) => {
				if(res.status > 399) {
					throw await res.json();
				}
				this.setState({isRO: cod === 'RO'});
				res.json().then(this.displayData);
			}).catch((err) => {
				this.setState({hasData: false, errMsg: err.err});
			});
	}
	displayData(data) {
		if(data.mfinante || data.anaf || data.vies) {
			this.setState({hasData: true, response: {...data}});
			scrollBottom();
		}
	}
	goBack() {
		scrollTop();
		this.setState({hasData: false})
	}
	componentWillUnmount() {
		window.removeEventListener('submitData', this.loadData);
	}
	toggleShowTVA() {
		this.setState({showTVA: !this.state.showTVA});
	}
	renderData() {
		const { classes } = this.props;
		const { response, showTVA, isRO } = this.state;
		return (
			<Paper className={classes.paper}>
				<Modal
					aria-labelledby="tva-modal-titlu"
					aria-describedby="tva-modal-descript"
					open={showTVA}
					onClose={() => this.setState({showTVA: false})} >
					<div className={classes.modalTVA}>
						<Typography id="tva-modal-titlu" variant="h5">Detalii TVA</Typography>
						<Typography id="tva-modal-descript" variant="subtitle1">
							<div><span className={classes.faded}>Nume:</span> {response.mfinante.nume || response.anaf.denumire || response.vies.name}</div>
							<div><span className={classes.faded}>Cod Indentificare Ficala:</span> {response.cifComplet}</div>
							{isRO ? (<div><span className={classes.faded}>Data interogare ANAF:</span> {response.anaf.data}</div>) : (<div><span className={classes.faded}>Data interogare VIES:</span> {response.vies.data}</div>)}
						</Typography>
						<Divider />
						{isRO ? (
							<Typography style={{margin: '16px 0'}} id="tva-modal-descript" variant="body2">
								<div>ANAF: {response.anaf.mesaj_ScpTVA}</div>
								<div><span className={classes.faded}>Data înregistrării în scopuri de TVA: </span>{response.anaf.data_inceput_ScpTVA || '-'}</div>
								<div><span className={classes.faded}>Data anulării înregistrării în scopuri de TVA: </span>{response.anaf.data_sfarsit_ScpTVA || '-'}</div>
								<div><span className={classes.faded}>Aplica TVA la incasare: </span>{response.anaf.statusTvaIncasare ? 'DA' : 'NU'}</div>
								<div><span className={classes.faded}>Data de la care aplică TVA la încasare: </span>{response.anaf.dataInceputTvaInc || '-'}</div>
								<div><span className={classes.faded}>Data până la care aplică TVA la încasare: </span>{response.anaf.dataSfarsitTvaInc || '-'}</div>
								<div><span className={classes.faded}>Aplica plata defalcata a TVA: </span>{response.anaf.statusSplitTVA ? 'DA' : 'NU'}</div>
								<div><span className={classes.faded}>Data de la care aplică "Split TVA": </span>{response.anaf.dataInceputSplitTVA || '-'}</div>
								<div><span className={classes.faded}>Data până la care aplică "Split TVA": </span>{response.anaf.dataAnulareSplitTVA || '-'}</div>
							</Typography>
						) : (
							<Typography style={{margin: '16px 0'}} id="tva-modal-descript" variant="body2">
								<div>VIES: {response.vies.valid ? (<span className={classes.viesYes}>Da, număr valid de înregistrare pentru TVA</span>) : (<span className={classes.viesNo}>Număr de TVA invalid pentru tranzacțiile transfrontaliere în interiorul UE</span>)}</div>
							</Typography>
						)}
					</div>
				</Modal>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<TableCell>Camp</TableCell>
							<TableCell>M. Finante</TableCell>
							<TableCell>ANAF</TableCell>
							<TableCell>VIES</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow hover>
							<TableCell>Denumire</TableCell>
							<TableCell>{response.mfinante.nume || '-'}</TableCell>
							<TableCell>{response.anaf.denumire || '-'}</TableCell>
							<TableCell>{response.vies.name || '-'}</TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell><div>Platitor de TVA</div><Typography onClick={this.toggleShowTVA} className={classes.tvaBtn} variant="subtitle1">Detali TVA</Typography></TableCell>
							<TableCell>{response.mfinante.tva || '-'}</TableCell>
							<TableCell>{response.anaf.mesaj_ScpTVA || '-'}</TableCell>
							<TableCell>{(typeof response.vies.valid === 'boolean') && (
								response.vies.valid ? (
									<span className={classes.viesYes}>Da, număr valid de înregistrare pentru TVA</span>
								) : (
									<span className={classes.viesNo}>Număr de TVA invalid pentru tranzacțiile transfrontaliere în interiorul UE</span>
								))}
							</TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell>Status</TableCell>
							<TableCell>{response.mfinante.status || '-'}</TableCell>
							<TableCell>{response.anaf.denumire ? (
								response.anaf.statusInactivi === true ? 'Inactiv (figureaza ca inactiv la ANAF)' : 'Activ (nu figureaza ca inactiv la ANAF)'
							) : null}
							</TableCell>
							<TableCell>-</TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell>Judet</TableCell>
							<TableCell>{response.mfinante.jud || '-'}</TableCell>
							<TableCell>{response.anaf.adresa && response.anaf.adresa.split(',')[0] || '-'}</TableCell>
							<TableCell>-</TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell>Localitate</TableCell>
							<TableCell>{response.mfinante.loc || '-'}</TableCell>
							<TableCell>{response.anaf.adresa && response.anaf.adresa.split(',')[1] || '-'}</TableCell>
							<TableCell>-</TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell>Adresa</TableCell>
							<TableCell>{response.mfinante.str || '-'}</TableCell>
							<TableCell>{response.anaf.adresa || '-'}</TableCell>
							<TableCell>{response.vies.address || '-'}</TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell>Cod Postal</TableCell>
							<TableCell>{response.mfinante.zip || '-'}</TableCell>
							<TableCell>-</TableCell>
							<TableCell>-</TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell>Registrul Comertului /<br />Act de autorizare</TableCell>
							<TableCell>{response.mfinante.reg || response.mfinante.auth || '-'}</TableCell>
							<TableCell>-</TableCell>
							<TableCell>-</TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell>Telefon</TableCell>
							<TableCell>{response.mfinante.tel || '-'}</TableCell>
							<TableCell>-</TableCell>
							<TableCell>-</TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell>Impozit micro</TableCell>
							<TableCell>{response.mfinante.impMicro || '-'}</TableCell>
							<TableCell>-</TableCell>
							<TableCell>-</TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell>Impozit profit</TableCell>
							<TableCell>{response.mfinante.impProf || '-'}</TableCell>
							<TableCell>-</TableCell>
							<TableCell>-</TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell>IBAN</TableCell>
							<TableCell>-</TableCell>
							<TableCell>{response.anaf.iban || '-'}</TableCell>
							<TableCell>-</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Paper>
		)
	}
	render () {
		const { classes } = this.props;
		const { hasData, errMsg } = this.state;
		return (
			<div className={classes.root}>
				{hasData ? this.renderData() : (
					<>
						<Typography variant="h2" align="center" className={classes.nodata} gutterBottom>NO DATA</Typography>
						<Typography onClick={this.goBack} variant="subtitle1" align="center" className={classes.back} gutterBottom>Reia cautarea</Typography>
						{errMsg && errMsg.length ? (<Typography variant="body1" className={classes.error} align="center">Cauza: <span className={classes.errorColor}>{errMsg}</span></Typography>) : null}
					</>
				)}
			</div>
		);
	}
}

export default withStyles(styles, {withTheme: true})(SearchResults);
