import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { cifValidation } from '../utils/utils';

const styles = theme => ({
	root: {
		background: '#C9D6FF',
		background: '-webkit-linear-gradient(to bottom, #E2E2E2, #C9D6FF)',
		background:'linear-gradient(to bottom, #E2E2E2, #C9D6FF)',
		borderRadius: 0,
		color: 'white',
		flex: '1 1 auto',
		height: 'calc(100vh - 64px)'
	},
	fullHeight: {
		flex: '1 1 auto',
		height: '100%',
	},
	vertical: {
		display: 'flex',
		height: '100%',
		flexDirection: 'column',
		justifyContent: 'center'
	},
	title: {
		color: theme.palette.primary.main
	},
	select: {
		width: '80px'
	},
	divider: {
		fontSize: '28px',
		fontWeight: 800,
		lineHeight: '54px',
		padding: '0 2px',
		color: theme.palette.primary.main
	},
	button: {
		marginLeft: '8px',
		height: '56px'
	}
});

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.timeoutId = null;
		this.state = {
			prefix: 'RO',
			cifInput: '',
			isLocked: false,
			inputErr: false
		};
		this.prefixChange = this.prefixChange.bind(this);
		this.inputChange = this.inputChange.bind(this);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.validate = this.validate.bind(this);
		this.submit = this.submit.bind(this);
	}
	submit() {
		const { prefix, cifInput } = this.state;
		if(cifInput.length > 2 && prefix) {
			const event = new CustomEvent('submitData', {detail: {cod: prefix, cif: cifInput}});
			window.dispatchEvent(event);
			this.setState({isLocked: true});
			setTimeout(() => {
				this.setState({isLocked: false});
			}, 10 * 1000);
		}
	}
	validate() {
		const { cifInput, prefix } = this.state;
		if(prefix !== 'RO') {
			return;
		}
		if(!cifValidation(cifInput)) {
			this.setState({inputErr: 'CIF introdus pare sa fie invalid...'});
		} else {
			this.setState({inputErr: false});
		}
	}
	prefixChange(ev) {
		const { value } = ev.target;
		this.setState({prefix: value, inputErr: false});
	}
	inputChange(ev) {
		if(this.timeoutId) {
			clearTimeout(this.timeoutId);
		}
		const { value } = ev.target;
		this.setState({cifInput: value}, () => {
			if(value.length > 2) {
				this.timeoutId = setTimeout(this.validate, 333);
			} else {
				this.setState({inputErr: false});
			}
		});
	}
	onKeyPress(ev) {
		if(ev.key === 'Enter' && !this.state.isLocked) {
			this.submit();
		}
	}
	render () {
		const { classes } = this.props;
		const { cifInput, inputErr, prefix, isLocked } = this.state;
		return (
			<Grid container wrap="nowrap">
				<Grid item xs={12}>
					<Paper className={classes.root}>
						<Grid container wrap="nowrap" className={classes.fullHeight} justify="center">
							<Grid item xs={10} md={8} className={classes.vertical}>
								<Typography variant="h2" align="center" className={classes.title} gutterBottom>Cautare CIF</Typography>
								<Grid container wrap="nowrap" justify="center" spacing={2}>
									<FormControl className={classes.select} variant="outlined">
										<Select native value={prefix}
											onChange={this.prefixChange}
										>
											<option value="AT" label="AT">AT - Austria</option>
											<option value="BE" label="BE">BE - Belgium</option>
											<option value="BG" label="BG">BG - Bulgaria</option>
											<option value="CY" label="CY">CY - Cyprus</option>
											<option value="CZ" label="CZ">CZ - Czech Republic</option>
											<option value="DE" label="DE">DE - Germany</option>
											<option value="DK" label="DK">DK - Denmark</option>
											<option value="EE" label="EE">EE - Estonia</option>
											<option value="EL" label="EL">EL - Greece</option>
											<option value="ES" label="ES">ES - Spain</option>
											<option value="FI" label="FI">FI - Finland</option>
											<option value="FR" label="FR">FR - France </option>
											<option value="GB" label="GB">GB - United Kingdom</option>
											<option value="HR" label="HR">HR - Croatia</option>
											<option value="HU" label="HU">HU - Hungary</option>
											<option value="IE" label="IE">IE - Ireland</option>
											<option value="IT" label="IT">IT - Italy</option>
											<option value="LT" label="LT">LT - Lithuania</option>
											<option value="LU" label="LU">LU - Luxembourg</option>
											<option value="LV" label="LV">LV - Latvia</option>
											<option value="MT" label="MT">MT - Malta</option>
											<option value="NL" label="NL">NL - The Netherlands</option>
											<option value="PL" label="PL">PL - Poland</option>
											<option value="PT" label="PT">PT - Portugal</option>
											<option value="RO" label="RO">RO - Romania</option>
											<option value="SE" label="SE">SE - Sweden</option>
											<option value="SI" label="SI">SI - Slovenia</option>
											<option value="SK" label="SK">SK - Slovakia</option>
										</Select>
									</FormControl>
									<font className={classes.divider}>-</font>
									<TextField id="cifInput"
										value={cifInput}
										InputProps={{
											readOnly: isLocked,
											style: isLocked ? {cursor: 'not-allowed'} : {}
										}}
										style={isLocked ? {cursor: 'not-allowed'} : {}}
										onChange={this.inputChange}
										onKeyPress={this.onKeyPress}
										fullWidth
										autoFocus
										label="CIF"
										error={(inputErr && !!inputErr.length)}
										helperText={inputErr}
										type="number"
										variant="outlined"
									/>
									<Button style={isLocked ? {cursor: 'not-allowed'} : {}} disabled={isLocked} variant="outlined" className={classes.button} onClick={this.submit}>
										CAUTA
									</Button>
								</Grid>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</Grid>
		);
	}
}

export default withStyles(styles, {withTheme: true})(Search);
