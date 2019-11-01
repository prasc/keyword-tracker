// TODO: create/find array of all the keywords
// * eg. const arrayOfKeyword = [];
// TODO: replace input type text with textarea and add an event listener to the text area, which calls displayMatches
// * eg: const searchInput = document.querySelector('.search');
// * searchInput.addEventListener('change', displayMatches);
// * searchInput.addEventListener('keyup', displayMatches);
// TODO: displayMatches will take the value of the text area and call a function that function that takes the text the user adds and compares it to the arrayOfKeywords and only returns the characters that do match the keyword
// TODO: the displayMatches function will then filter through the textarea and replace all the values that matched with a highlighted value using a RegExp
// TODO: So now we have a textarea with text, and it highlights the words in the text which match our predetermined keywords
// TODO: Once we click send, we call another function called checkIfFunctionExists which will map through the matching keywords array and check this:
// ? 	matchingKeyWords.map(word => {
// ?	1. word exists in arrayOfSkills? then add +1 to it's count and 			send to firebase
// ?	2. word does not exist in arrayOfSkills but exist in 					arrayOfKeyword, then push {word, count} object to firebase
// ?	)}
// TODO: Sending to firebase just re-renders our list with the values which should work!

// TODO: Error handling: adding rules to textarea for example a counte that tells you how many characters you are at and also a note that tells you maximum characters

const arrayOfKeyword = [
	'Git',
	'Terminal',
	'Data Structures',
	'Algorithms',
	'Github',
	'Version Control',
	'SSH',
	'HTTP',
	'HTTPS',
	'API',
	'SEO',
	'Accessibility',
	'HTML',
	'CSS',
	'Javascript',
	'Responsive',
	'CSS3',
	'HTML5',
	'ES6',
	'XHR',
	'SASS',
	'npm',
	'Boostrap',
	'BEM',
	'gulp',
	'Redux',
	'Prettier',
	'ESLint',
	'Webpack',
	'React',
	'Angular',
	'Vue.js',
	'Vuex',
	'RxJS',
	'ngrx',
	'Styled Components',
	'CSS Modules',
	'Jest',
	'Enzyme',
	'Mocha',
	'Chai',
	'Karma',
	'Jasmine',
	'Ava',
	'Protractor',
	'Storage',
	'Web Sockets',
	'Service Workeres',
	'Location',
	'DevTools',
	'Flow',
	'TypeScript',
	'React.js',
	'Next.js',
	'After.js',
	'Nuxt.js',
	'Gatsby',
	'Electron',
	'React Native',
	'NativeScript',
	'Web Assembly',
	'Java',
	'.NET',
	'Haskell',
	'Clojure',
	'Erlang',
	'Python',
	'Ruby',
	'PHP',
	'Node.js',
	'Go',
	'Rust',
	'Package Manager',
	'Oracle',
	'MySQL',
	'MariaDB',
	'PostgreSQL',
	'MSSQL',
	'MongoDB',
	'Cassandra',
	'Memcached',
	'Redis',
	'OAuth',
	'Basic Authentification',
	'Token Authentification',
	'JWT',
	'OpenID',
	'Apache',
	'Nginx',
	'C',
	'C++',
	'C#',
	'I/O Management',
	'Memory',
	'Storage',
	'File Systems',
	'Linux',
	'Unix',
	'Windows',
	'DNS',
	'FTP',
	'SSL',
	'Tomcat',
	'Caddy',
	'VIM',
	'Nano',
	'Emacs',
	'Docker',
	'Kubernates',
	'Terraform',
	'Cloud',
	'Jenkins',
	'AWS',
	'Google Cloud',
	'Azure',
	'Heroku',
	'Cloud Providors'
];

function findMatches(wordToMatch, cities) {
	return cities.filter((place) => {
		// here we need to figure out if the city or state matches what was searched
		const regex = new RegExp(wordToMatch, 'gi');
		return place.city.match(regex) || place.state.match(regex);
	});
}

// selecting dom elements for manipulation
const dbRef = firebase.database().ref();
const entireForm = document.querySelector('.entireForm');
const listOfSkills = document.querySelector('.listOfSkills');
const textAreaUserInput = document.querySelector('#skill');

// assigning global variables
let count = 1; // change to inital count
const arrayOfSkills = [];

// function to render newly typed skill and call sendToFirebase function
function addItemToList(e) {
	e.preventDefault();
	const skill = this.querySelector('#skill').value;

	if (!skill || skill.length > 30) {
		alert('Type something less than 30 characters but longer than 0');
		entireForm.reset();
		this.querySelector('#skill').focus();
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

function findMatches(wordToMatch, arrayOfKeyword) {
	// console.log('word2match is: ', wordToMatch);
	return arrayOfKeyword.filter((word) => {
		// here we need to figure out if the city or state matches what was searched
	});
}

highlightMatchingWords = (e) => {
	// const userText = e.target.value;
	const arrOfUserInput = e.target.value.split(' ');
	// console.log('arrOfUserInput is: ', arrOfUserInput);
	const matchWordsArray = findMatches(arrOfUserInput, arrayOfKeyword);
	console.log('matchWordsArray is: ', matchWordsArray);
	const html = matchWordsArray
		.map((matchingWord) => {
			const regex = new RegExp(textAreaUserInput.value, 'gi');
			const highlightedText = matchingWord.replace(
				regex,
				`"${this.value}"`
			);
			return `
	 		${highlightedText}
		`;
		})
		.join('');
	// console.log(html);
	// textAreaUserInput.value = html;
};

// Event listeners which will highlight the matching keywords from textarea
textAreaUserInput.addEventListener('change', highlightMatchingWords);
textAreaUserInput.addEventListener('keyup', highlightMatchingWords);

window.addEventListener('load', updateListFromFirebase);
entireForm.addEventListener('submit', addItemToList);
listOfSkills.addEventListener('click', increaseCount);
listOfSkills.addEventListener('click', decreaseCount);
