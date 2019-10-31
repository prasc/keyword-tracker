// selecting dom elements for manipulation
const dbRef = firebase.database().ref();
const entireForm = document.querySelector('.entireForm');
const listOfSkills = document.querySelector('.listOfSkills');

// assigning global variables
let count = 1; // change to inital count
const arrayOfSkills = [];

// function to render newly typed skill and call sendToFirebase function
function addItemToList(e) {
	e.preventDefault();
	const skill = this.querySelector('[name="skill"]').value;

	if (!skill || skill.length > 30) {
		alert('Type something less than 30 characters but longer than 0');
		return;
	}

	arrayOfSkills.push(skill);
	sendToFirebase(e, skill);
	entireForm.reset();
}

// function to listen to changes in firebase database and render UI on change
updateListFromFirebase = dbRef.on('value', (response) => {
	const firebaseArray = Object.values(response.val());
	const sortedArray = firebaseArray.sort((a, b) =>
		a.count < b.count ? 1 : -1
	);

	listOfSkills.innerHTML = '';

	sortedArray.map((item) => {
		listOfSkills.innerHTML += `
	<div class="skillContainer">
		<li class="skillName">${item.skill}</li>
		<p class="currentScore">${item.count}</p>
		<button class="plus">+</button>
		<button class="minus">-</button>
	</div>
	`;
	});
	console.log('just updated UI');
});

// function to send new item to firebase
sendToFirebase = (event, skill) => {
	event.preventDefault();
	const newSkill = { skill, count };
	dbRef.update({
		[skill]: newSkill
	});
};

// function to increase counter by one on button click and update firebase
function increaseCount(e) {
	if (!e.target.matches('.plus')) return;
	const targ = e.target;

	let currentScore = targ.parentElement.querySelector('.currentScore')
		.innerText;
	currentScore = Number(currentScore) + 1;
	targ.parentElement.querySelector('.currentScore').innerText = currentScore;

	let skillName = e.target.parentElement.children[0].innerText;
	const userRef = dbRef.child(`${skillName}`);

	const count = currentScore;
	userRef.update({
		count: count
	});
	return;
}

// function to decrease counter by one on button click and delete any skill with a count of 0
function decreaseCount(e) {
	if (!e.target.matches('.minus')) return;

	const targ = e.target;

	let currentScore = targ.parentElement.children[1].innerText;
	currentScore = Number(currentScore) - 1;
	let skillName = e.target.parentElement.children[0].innerText;
	const userRef = dbRef.child(`${skillName}`);
	const count = currentScore;

	if (count == 0) {
		userRef.remove();
	} else {
		userRef.update({
			count: count
		});
	}
}

window.addEventListener('load', updateListFromFirebase);
entireForm.addEventListener('submit', addItemToList);
listOfSkills.addEventListener('click', increaseCount);
listOfSkills.addEventListener('click', decreaseCount);
