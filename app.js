//import { createMachine } from 'madux';
const madux = require('madux');
var currentStore;
var currentMachine;

//application collection
let applications = [
	{firstname: 'andrew', age: 42, score: 700, lastname: 'siemer', id: 1, state: 'new', currentAction: 'applying', notes: ''},
	{firstname: 'jessica', age: 36, score: 500, lastname: 'siemer', id: 2, state: 'new', currentAction: 'applying', notes: ''},
	{firstname: 'trinity', age: 15, score: 0, lastname: 'siemer', id: 3, state: 'new', currentAction: 'applying', notes: ''}
]

//states
const sAPPLIED = { name: 'applied' };

const sPERFORMINGVALIDATION = { name: 'in validation'};
const sVALIDATED = { name: 'validated' };
const sVALIDATIONFAILED = { name: 'validation failed' };

const sSEEKINGAPPROVAL = { name: 'seeking approval' };
const sAPPROVED = { name: 'approved' };
const sNOTAPPROVED = { name: 'not approved' };

const sSEEKINGFUNDING = { name: 'seeking funding' };
const sFUNDED = { name: 'funded' };
const sNOTFUNDED = { name: 'not funded' };

const sVIEWINGTERMS = { name: 'viewing terms' };
const sTERMSACCEPTED = { name: 'terms accepted' };
const sTERMSNOTACCEPTED = { name: 'terms not accepted' };

const sFUNDSDISPERSED = { name: 'funds dispersed' };
const sINGRACEPERIOD = { name: 'in grace period' };
const sACTIVEPAYMENTS = { name: 'active payments' };
const sPAID = { name: 'paid' };
const sPASTDUE = { name: 'past due' };

//actions
const aSTARTVALIDATION = 'start validation';
const aPASSVALIDATION = 'pass validation';
const aFAILVALIDATION = 'fail validation';

const aSEEKAPPROVALS = 'seek approvals';
const aFAILAPPROVALS = 'approval failed';
const aPASSAPPROVALS = 'was approved';

const aSEEKFUNDING = 'seek funding';
const aAPPLYFUNDING = 'apply funding';
const aFAILFUNDING = 'fail funding';

//action creators
const startValidation = applicationId => ({ type: aSTARTVALIDATION, params: { applicationId } });
const passValidation = applicationId => ({ type: aPASSVALIDATION, params: { applicationId } });
const failValidation = (applicationId, reason) => ({ type: aFAILVALIDATION, params: { applicationId, reason } });

const seekApprovals = applicationId => ({type: aSEEKAPPROVALS, params: { applicationId }});
const failApprovals = (applicationId, reason) => ({type: aFAILAPPROVALS, params: { applicationId, reason }});
const passApprovals = applicationId => ({type: aPASSAPPROVALS, params: { applicationId }});

const seekFunding = applicationId => ({type: aSEEKFUNDING, params: { applicationId }});
const applyFunding = applicationId => ({type: aAPPLYFUNDING, params: { applicationId }});
const failFunding = (applicationId, reason) => ({type: aFAILFUNDING, params: { applicationId, reason }});

function getMachine() {
	//create the machine
	const machine = madux.createMachine(sAPPLIED, 
	sPERFORMINGVALIDATION, sVALIDATED, sVALIDATIONFAILED, 
	sSEEKINGAPPROVAL, sAPPROVED, sNOTAPPROVED, 
	sSEEKINGFUNDING, sFUNDED, sNOTFUNDED, 
	sVIEWINGTERMS, sTERMSACCEPTED, sTERMSNOTACCEPTED, 
	sFUNDSDISPERSED, sINGRACEPERIOD, sACTIVEPAYMENTS, sPAID, sPASTDUE);

	//create the transitons
	machine.from(sAPPLIED).to(sPERFORMINGVALIDATION).on(aSTARTVALIDATION);
	machine.from(sPERFORMINGVALIDATION).to(sVALIDATED).on(aPASSVALIDATION);
	machine.from(sPERFORMINGVALIDATION).to(sVALIDATIONFAILED).on(aFAILVALIDATION);

	machine.from(sVALIDATED).to(sSEEKINGAPPROVAL).on(aSEEKAPPROVALS);
	machine.from(sSEEKINGAPPROVAL).to(sAPPROVED).on(aPASSAPPROVALS);
	machine.from(sSEEKINGAPPROVAL).to(sNOTAPPROVED).on(aFAILAPPROVALS);

	machine.from(sAPPROVED).to(sSEEKINGFUNDING).on(aSEEKFUNDING);
	machine.from(sSEEKINGFUNDING).to(sFUNDED).on(aAPPLYFUNDING);
	machine.from(sSEEKINGFUNDING).to(sNOTFUNDED).on(aFAILFUNDING);

	return machine;
}


//middle ware
const peek = (next) => (action) => {
	console.log(currentMachine.current);
	next(action);
}

function worker(prev, action, next) {
	console.log('-----------------------------')
	console.log('Prior state:   ' + prev.name);
	console.log('What happened: ' + action.type);
	console.log('Current state: ' + next.name);
	console.log(action);
	console.log('-----------------------------')

	let appid = action.params.applicationId;
	let app = applications.find(x => x.id == appid);

	if(action.params.reason) {
		app.notes = app.notes + action.params.reason;	
	}
	app.currentAction = action.type;
	app.state = currentMachine.current;

	//massive switch statement until other options present themselves
	performInitialValidation(action, app);
	determineApproval(action, app);
	determineFunding(action, app);
}

function determineFunding(action, app) {
	switch(action.type) {
		case aSEEKFUNDING:
			console.log("seek funding");
			if(true) //TODO: need a rule for why someone wouldn't be able to find funding
				currentStore.dispatch(applyFunding(app.id));
			else
				currentStore.dispatch(failFunding(app.id, 'you suck'));
			break;

		case aFAILFUNDING:
			console.log("fail funding");
			currentStore.dispatch()
			break;

		case aAPPLYFUNDING:
			console.log("funded");
			break;
	}
}

function determineApproval(action, app) {
	switch(action.type) {
		case aSEEKAPPROVALS:
			console.log("Application score: " + app.score);
			if(app.score < 600) {
				console.log("Failed approval");
				currentStore.dispatch(failApprovals(app.id, 'credit score too low'));
			}
			else {
				console.log("Passed approval");
				currentStore.dispatch(passApprovals(app.id));
			}
			break;

		case aPASSAPPROVALS:
			console.log("Approved");
			currentStore.dispatch(seekFunding(app.id));
			break;

		case aFAILAPPROVALS:
			console.log("Not approved");
			//notify user
			break;
	}
}

function performInitialValidation(action, app) {
	switch(action.type) {
		case aSTARTVALIDATION:
			console.log("Start validation");
			if(app.age >= 18) {
				currentStore.dispatch(passValidation(app.id));
			}
			else {
				currentStore.dispatch(failValidation(app.id, 'too young'));
			}
			break;

		case aPASSVALIDATION:	
			console.log("Passed validation");		
			currentStore.dispatch(seekApprovals(app.id));
			break;

		case aFAILVALIDATION:
			//todo
			break;
	}
}

const machine1 = getMachine();
const store1 = machine1.buildStore().bindMiddleware(peek);
store1.subscribe((prev, action, next) => {
	worker(prev, action, next);
});

const machine2 = getMachine();
const store2 = machine2.buildStore().bindMiddleware(peek);
store2.subscribe((prev, action, next) => {
	worker(prev, action, next);
});

const machine3 = getMachine();
const store3 = machine3.buildStore().bindMiddleware(peek);
store3.subscribe((prev, action, next) => {
	worker(prev, action, next);
});

console.log('');
console.log('start 1 ############################');
currentStore = store1;
currentMachine = machine1;
store1.dispatch(startValidation(1));

console.log('');
console.log('start 2 ############################');
currentStore = store2;
currentMachine = machine2;
store2.dispatch(startValidation(2));

console.log('');
console.log('start 3 ############################');
currentStore = store3;
currentMachine = machine3;
store3.dispatch(startValidation(3));

console.log(applications);
//store.dispatch(fixIt());
