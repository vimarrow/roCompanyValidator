import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
	root: {
		flexGrow: 1,
		height: 64,
		position: 'relative',
		background: '#333'
	},
	copy: {
		position: 'absolute',
		bottom: 0,
		fontSize: '10px',
		color: '#EEE',
		textAlign: 'center',
		width: '100%'
	},
	descript: {
		color: '#EEE',
		fontSize: '12px',
		textAlign: 'center',
		width: '100%'
	}
}));

export default function Footer() {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Typography variant="body1" align="center" className={classes.descript} gutterBottom>Acest site nu foloseste nici un fel de cookie-uri sau alte metode de stocare a datelor carora li se poate atribui o identitate.</Typography>
			<Typography variant="body1" align="center" className={classes.copy} gutterBottom>CLAUDIT @ 2019</Typography>
		</div>
	);
}
