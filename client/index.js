import 'babel-polyfill';
import React from "react";
import { withStyles } from '@material-ui/styles';
import Header from './common/Header';
import Search from './pages/Search';
import DataDisplay from './pages/DataDisplay';
import Footer from './common/Footer';
import ReactDOM from "react-dom";
const styles = {
	root: {
		display: 'flex',
		width: '100vw',
		flexDirection: 'column'
	}
}
function app(props) {
	const { classes } = props;
	return (
		<div className={classes.root}>
			<Header />
			<Search />
			<DataDisplay />
			<Footer />
		</div>
	);
}
const App = withStyles(styles)(app);
ReactDOM.render(<App />, document.getElementById("app"));