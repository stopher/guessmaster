var View = (function() {
	lockedGui = false;
	guessLocked = true;

	me = {};

	me.lockGui = function() {
		lockedGui = true;
	},
	me.openGui = function() {
		lockedGui = false;
	},
	me.isLocked = function() {
		return lockedGui;
	},
	me.lockGuess = function() {
		guessLocked = true;
	},
	me.openGuess = function() {
		guessLocked = false;
	},
	me.isGuessLocked = function() {
		return guessLocked;
	};

	return me;
}());