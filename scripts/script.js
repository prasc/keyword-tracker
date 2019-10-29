// TODO BONUS:
// * Sort list from highest to lowest
// * When count is at 0, pressing the - button removes skill from list

// selecting dom elements for manipulation
const dbRef = firebase.database().ref();
const entireForm = document.querySelector('.entireForm');
const listOfSkills = document.querySelector('.listOfSkills');

// assigning global variables
let count = 1;
const arrayOfSkills = [];

// function to render newly typed skill and call sendToFirebase function
function addItemToList(e) {
	e.preventDefault();
	const skill = this.querySelector('[name="skill"]').value;

	if (skill == '') {
		alert('Type something before sending');
		return;
	}

	arrayOfSkills.push(skill);
	sendToFirebase(e, skill);
	dbRef.once('value', updateListFromFirebase);
	entireForm.reset();
	return;
}

// function to render latest list item onto screen
updateListFromFirebase = (response) => {
	const firebaseArray = Object.values(response.val());
	const sortedArray = firebaseArray.sort((a, b) =>
		a.count < b.count ? 1 : -1
	);

	console.log(sortedArray);
	listOfSkills.innerHTML = '';

	sortedArray.map((item) => {
		listOfSkills.innerHTML += `
	<div>
		<li class="skillName">${item.skill}</li>
		<p class="currentScore">${item.count}</p>
		<button class="plus">+</button>
		<button class="minus">-</button>
	</div>
	`;
	});
};

// function to send new item to firebase
sendToFirebase = (event, skill) => {
	event.preventDefault();
	const newSkill = { skill: skill, count: count };
	dbRef.update({
		[skill]: newSkill
	});
};

// function to load existing list items from firebase on page load
function updateUIOnPageLoad() {
	dbRef.once('value', (response) => {
		const firebaseArray = Object.values(response.val());
		const sortedArray = firebaseArray.sort((a, b) =>
			a.count < b.count ? 1 : -1
		);
		if (sortedArray.length != 0) {
			sortedArray.map((item) => {
				listOfSkills.innerHTML += `
					<div>
						<li class="skillName">${item.skill}</li>
						<p class="currentScore">${item.count}</p>
						<button class="plus">+</button>
						<button class="minus">-</button>			
					</div>`;
			});
		}
	});
	return;
}

// function to increase counter by one on button click and update firebase
function increaseCount(e) {
	if (!e.target.matches('.plus')) return;
	const targ = e.target;

	let currentScore = targ.previousElementSibling.innerText;
	currentScore = Number(currentScore) + 1;
	targ.previousElementSibling.innerText = currentScore;

	let skillName = e.target.parentElement.children[0].innerText;
	const userRef = dbRef.child(`${skillName}`);

	const count = currentScore;
	userRef.update({
		count: count
	});
	return;
}

// function to decrease counter by one on button click and update firebase
function decreaseCount(e) {
	if (!e.target.matches('.minus')) return;

	const targ = e.target;

	let currentScore = targ.parentElement.children[1].innerText;
	currentScore = Number(currentScore) - 1;
	targ.parentElement.children[1].innerText = currentScore;
	let skillName = e.target.parentElement.children[0].innerText;
	const userRef = dbRef.child(`${skillName}`);

	const count = currentScore;
	userRef.update({
		count: count
	});

	return;
}

// event listeners
window.addEventListener('load', updateUIOnPageLoad);
entireForm.addEventListener('submit', addItemToList);
listOfSkills.addEventListener('click', increaseCount);
listOfSkills.addEventListener('click', decreaseCount);
