# UCSD Keebs Raffle Spinner
**Contributors: Colin Wang and Andrew Nguyen**

This repo is used to create a new raffle spinner to be used for UCSD Meets.

Based on the limitations on the whole wheel, we decided to go for a vertical wheel spinner approach.

There is a version in React inside of the `test-raffle-react-spinner` folder.

Run steps:
- Need two terminals, one to run the API, and one to run the spinner itself, type `cd test-raffle-react-spinner` for both
- The google sheets that the code queries from is [check-in](https://docs.google.com/spreadsheets/d/1GKyP_61jo1Btik3lX_qalejXb_0txDFv5dvhEJ20S24/edit#gid=901739931)
***API***
- `cd server`
- `node index.js`
***Spinner***
- `cd src`
- `npm start`

***Current Progress***: Basic Functionalities are done, works for sample numbers

***TODO***: Make it look prettier LOL

Link to the raffle spinner can be found [here](https://ucsdkeebs.github.io/test-raffle-spinner/public/spin.html)
