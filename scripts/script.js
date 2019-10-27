const addSkill = document.querySelector('.add-skill');
const skillList = document.querySelector('.skill-list');
const currentScore = document.querySelectorAll('.currentScore');

// On Submit, dynamically post a list item

const arrayOfSkills = [];

function addItem(e) {
	e.preventDefault();
	const skill = this.querySelector('[name="skill"]').value;

	arrayOfSkills.push(skill);

	skillList.innerHTML += `
	<li>${skill}</li>
	<p class="currentScore">number</p>
	<button class="plus" onclick="add()">+</button>
	<button class="minus" onclick="minus()">-</button>

	`;

	addSkill.reset();
}

function add() {
	console.log('hi');
	currentScore.forEach((item) => {
		console.log(item);
	});
}

function minus() {
	console.log('bye');
}

// everytime we press submit, we add a new value to arrayOfSkills
// then in updateList() function, we map through the entire array, including what we already mapped through

addSkill.addEventListener('submit', addItem);
