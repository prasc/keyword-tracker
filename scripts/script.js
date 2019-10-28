// ! What I have
// When I click send, I dynamically create an object in firebase and dynamically render it on screen
// On page load, I can access my objects in firebase
// I can access my database everytime something changes
//  When user presses send, send an object to firebase that looks like this {skill: "skillname", count: 1}
//  On page load, check if there are objects in firebase and if there are, render them on to the screen

// TODO NOW:
// ? When user clicks +/- button, increase/decrease count by one on firebase and update UI when firebase changes

// TODO BONUS:
// * Sort list from highest to lowest
// * When count is at 0, pressing the - button removes skill from list

const dbRef = firebase.database().ref();
const skillForm = document.querySelector('.skillForm');
const skillList = document.querySelector('.skillList');

let count = 1;
const arrayOfSkills = [];

function add(skill) {
	const newSkill = { skill: skill, count: (count += 1) };
	const dbRef = firebase.database().ref(`${skill}`);
	dbRef.child('count').setValue((count += 1));
	//  = FirebaseDatabase.getInstance().getReference("QuoteList").child("Quote");
	// mDatabase.child("likes").setValue(mItem.totalLikes + 1);
}

function minus() {
	console.log('You clicked minus');
}

function addItem(e) {
	e.preventDefault();
	const skill = this.querySelector('[name="skill"]').value;
	arrayOfSkills.push(skill);
	sendToFirebase(e, skill);

	dbRef.once('value', (response) => {
		const firebaseArray = Object.values(response.val());
		const newItem = firebaseArray[firebaseArray.length - 1];
		console.log(newItem);

		skillList.innerHTML += `
		<li>${newItem.skill}</li>
		<p class="currentScore">${newItem.count}</p>
		<button class="plus" onclick="add(skill)">+</button>
		<button class="minus" onclick="minus(skill)">-</button>
		`;
	});
	skillForm.reset();
}

sendToFirebase = (event, skill) => {
	event.preventDefault();
	const newSkill = { skill: skill, count: count };
	dbRef.update({
		[skill]: newSkill
	});
};

function updateUIOnPageLoad() {
	dbRef.once('value', (response) => {
		const firebaseArray = Object.values(response.val());

		if (firebaseArray.length != 0) {
			firebaseArray.map((item) => {
				skillList.innerHTML += `
					<li>${item.skill}</li>
					<p class="currentScore">${item.count}</p>
					<button class="plus" onclick="add()">+</button>
					<button class="minus" onclick="minus()">-</button>
					`;
			});
		}
	});
}

window.addEventListener('load', updateUIOnPageLoad);
skillForm.addEventListener('submit', addItem);
