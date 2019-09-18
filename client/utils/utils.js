export function cifValidation(cui) {
	if (cui.length < 2 || cui.length > 10) {
		return false;
	}
	var kontrol = Number(cui[cui.length - 1]);
	var cuiShort = cui.substring(0, cui.length - 1);
	while (cuiShort.length !== 9) {
		cuiShort = '0' + cuiShort;
	}
	var sum = (cuiShort[0] * 7 + cuiShort[1] * 5 + cuiShort[2] * 3 + cuiShort[3] * 2 + cuiShort[4] * 1 + cuiShort[5] * 7 + cuiShort[6] * 5 + cuiShort[7] * 3 + cuiShort[8] * 2) * 10;
	var change = sum % 11;
	if (change == 10) {
		change = 0;
	}
	if (kontrol === change){
		return true;
	} else {
		return false;
	}
}