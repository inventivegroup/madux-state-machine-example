//import { createMachine } from 'madux';
const madux = require('madux');

//states
const GREEN = { name: 'green' };
const RED = { name: 'red' };

//actions
const ERROR = 'error';
const FIXED = 'fixed';

const breakIt = () => ({ type: ERROR });
const fixIt = () => ({ type: FIXED });

//create the machine
const machine = madux.createMachine(GREEN, RED);

//create the transitons
machine.from(GREEN).to(RED).on(ERROR);
machine.from(RED).to(GREEN).on(FIXED);

//convert the machine to a store
const store = machine.buildStore().bindMiddleware((next) => (action) => {
	
	console.log('here');
	console.log(action);

	next(action);
});

//subscribe to the state
const unsubscribe = store.subscribe((prev, action, next) => {
	console.log('Prior state: ' + prev.name);
	console.log('What happened: ' + action.type);
	console.log('Current state: ' + next.name);
});

store.dispatch(breakIt());
store.dispatch(fixIt());
