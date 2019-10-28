// ! What I have
// When I click send, I dynamically create an object in firebase and dynamically render it on screen
// On page load, I can access my objects in firebase
// I can access my database everytime something changes
//  When user presses send, send an object to firebase that looks like this {skill: "skillname", count: 1}
//  On page load, check if there are objects in firebase and if there are, render them on to the screen
//  When user clicks +/- button, increase/decrease count by one on firebase and update UI when firebase changes

// TODO BONUS:
// * Sort list from highest to lowest
// * When count is at 0, pressing the - button removes skill from list

const dbRef = firebase.database().ref();
const entireForm = document.querySelector('.entireForm');
const listOfSkills = document.querySelector('.listOfSkills');

let count = 1;
const arrayOfSkills = [];

function addItemToList(e) {
	e.preventDefault();
	const skill = this.querySelector('[name="skill"]').value;
	arrayOfSkills.push(skill);

	sendToFirebase = (event, skill) => {
		event.preventDefault();
		const newSkill = { skill: skill, count: count };
		dbRef.update({
			[skill]: newSkill
		});
	};

	sendToFirebase(e, skill);

	dbRef.once('value', (response) => {
		const firebaseArray = Object.values(response.val());
		const newItem = firebaseArray[firebaseArray.length - 1];
		console.log(newItem);

		listOfSkills.innerHTML += `
		<div>
			<li class="skillName">${newItem.skill}</li>
			<p class="currentScore">${newItem.count}</p>
			<button class="plus">+</button>
			<button class="minus">-</button>
		</div>
		`;
	});
	entireForm.reset();
	return;
}

function updateUIOnPageLoad() {
	dbRef.once('value', (response) => {
		const firebaseArray = Object.values(response.val());

		if (firebaseArray.length != 0) {
			firebaseArray.map((item) => {
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

window.addEventListener('load', updateUIOnPageLoad);
entireForm.addEventListener('submit', addItemToList);
listOfSkills.addEventListener('click', increaseCount);
listOfSkills.addEventListener('click', decreaseCount);
