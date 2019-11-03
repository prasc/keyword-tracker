// selecting dom elements for manipulation
const dbRef = firebase.database().ref();
const entireForm = document.querySelector('.entireForm');
const listOfSkills = document.querySelector('.listOfSkills');
const textAreaUserInput = document.querySelector('#skill');

// assigning global variables
let arrayOfHighlightedWords = [];

// function to render newly typed skill and call sendToFirebase function
function addItemToList(e) {
	e.preventDefault();

	let count = 1; // setting default count to 1 for all new skills
	console.log(arrayOfHighlightedWords);
	arrayOfHighlightedWords.map((highlightedWord) => {
		sendToFirebase(highlightedWord, count);
	});

	entireForm.reset();
}

// function to send new item to firebase
sendToFirebase = (skill, count) => {
	let b64 = btoa(skill);
	let newSkill = { skill, count };

	dbRef.on('value', (response) => {
		const firebaseArray = Object.values(response.val());
		firebaseArray.forEach((item) => {
			if (item.skill === skill) {
				newSkill.count = Number(item.count);
				newSkill.count += 1;
			}
		});
	});
	dbRef.update({
		[b64]: newSkill
	});
};

// function to listen to changes in firebase database and render UI on change
renderFromFirebase = dbRef.on('value', (response) => {
	const firebaseArray = Object.values(response.val());
	const sortedFirebaseArray = sortFirebaseArray(firebaseArray);

	listOfSkills.innerHTML = '';
	renderFirebaseArray(sortedFirebaseArray);
});

// sort firebase array counts from highest to lowest
sortFirebaseArray = (firebaseArray) => {
	return firebaseArray.sort((a, b) => (a.count < b.count ? 1 : -1));
};

renderFirebaseArray = (sortedFirebaseArray) => {
	sortedFirebaseArray.map((item) => {
		listOfSkills.innerHTML += `
	<tr>
		<td class="text-left skillName">${item.skill}</td>
		<td class="text-left count">${item.count}</td>
		<td class="text-left plus"><i class="fas fa-plus"></i></td>
		<td class="text-left minus"><i class="fas fa-minus"></i></td>
	</tr>
	`;
	});
};

// create array of highlighted words from text area
createArrayOfHightlightedWords = ({ target }) => {
	const userInput = target.value;
	arrayOfHighlightedWords = [];
	findMatches(userInput);
};

// returns matches
function findMatches(userInput) {
	let stringOfUserInput = removePunctation(userInput);
	compareUserInput(hugeListOfKeywords, stringOfUserInput);
}

// compares hugeListOfKeywords with userInput
function compareUserInput(hugeListOfKeywords, stringOfUserInput) {
	let arrayOfUserInput = stringOfUserInput.split(' ');
	arrayOfUserInput.map((word) => {
		hugeListOfKeywords.map((keyword) => {
			if (
				keyword.toLowerCase() === word.toLowerCase() &&
				!arrayOfHighlightedWords.includes(keyword)
			) {
				arrayOfHighlightedWords.push(keyword);
			}
		});
	});
}

// remove punctation and extra spaces from userInput
function removePunctation(userInput) {
	let punctuationless = userInput.replace(
		/[.,\/?!$%\^&\*;:{}=\-_`~()]/g,
		' '
	);
	return punctuationless.replace(/\s{2,}/g, ' ');
}

// update counter & delete any skill with a count of 0
function updateCount({ target }) {
	if (target.matches('.minus') || target.matches('.plus')) {
		var count = target.parentElement.querySelector('.count').innerText;
		var skillName = target.parentElement.querySelector('.skillName')
			.innerText;
	} else if (target.matches('.fas')) {
		var count = target.parentElement.parentElement.querySelector('.count')
			.innerText;
		var skillName = target.parentElement.parentElement.querySelector(
			'.skillName'
		).innerText;
	}
	const userRef = dbRef.child(`${btoa(skillName)}`);

	if (target.matches('.minus') || target.matches('.fa-minus')) {
		count = Number(count) - 1;
	} else if (target.matches('.plus') || target.matches('.fa-plus')) {
		count = Number(count) + 1;
	}
	updateCountOnFirebase(count, userRef);
}

// update count on firebase
function updateCountOnFirebase(count, userRef) {
	if (count == 0) {
		userRef.remove();
	} else {
		userRef.update({
			count: count
		});
	}
}

// jQuery function that handles highlighting the keywords in textarea
$('.array-example').highlightWithinTextarea({
	highlight: hugeListOfKeywords
});

textAreaUserInput.addEventListener('change', createArrayOfHightlightedWords);
textAreaUserInput.addEventListener('keyup', createArrayOfHightlightedWords);
textAreaUserInput.addEventListener('input', createArrayOfHightlightedWords);
window.addEventListener('load', renderFromFirebase);
entireForm.addEventListener('submit', addItemToList);
listOfSkills.addEventListener('click', updateCount);
