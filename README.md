# madux-state-machine-example

There are two files in this repository.  The `simple.js` shows a basic example of the madux state machine working.  The `app.js` shows a more complex model around the notion of a `loan application`.

The loan process has many different states and splits in logic.  You apply, go through basic validation (age, data validation), seek an approval (credit score high enough?), then attempt to get funding.  Etc.

The `app.js` file runs three test case scenarios at the bottom of the file showing three different applications that make it a certain way through the application process.

The madux creator site is here: https://github.com/Jense5/madux