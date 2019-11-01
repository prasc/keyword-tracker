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
	'Cloud Providors',
	'jQuery',
	'UI',
	'UX',
	'Babel',
	'Webpack'
];

// selecting dom elements for manipulation
const dbRef = firebase.database().ref();
const entireForm = document.querySelector('.entireForm');
const listOfSkills = document.querySelector('.listOfSkills');
const textAreaUserInput = document.querySelector('#skill');

// assigning global variables
let count = 1; // change to inital count
const arrayOfSkills = [];
let arrayOfHighlightedWords = [];

// function to render newly typed skill and call sendToFirebase function
function addItemToList(e) {
	e.preventDefault();
	arrayOfHighlightedWords.map((highlightedWord) => {
		const skill = highlightedWord;

		if (!skill) {
			alert('Type something');
			entireForm.reset();
			this.querySelector('#skill').focus();
			return;
		}

		arrayOfSkills.push(skill);
		sendToFirebase(e, skill);
		entireForm.reset();
	});

	// const skill = this.querySelector('#skill').value;
}

// function to send new item to firebase
sendToFirebase = (event, skill) => {
	event.preventDefault();
	const newSkill = { skill, count };
	dbRef.update({
		[skill]: newSkill
	});
};

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
		<p class="count">${item.count}</p>
		<button class="plus">+</button>
		<button class="minus">-</button>
	</div>
	`;
	});
	console.log('just updated UI');
});

// function to increase/decrease counter by one on button click and delete any skill with a count of 0
function changeCount({ target }) {
	let count = target.parentElement.querySelector('.count').innerText;
	let skillName = target.parentElement.querySelector('.skillName').innerText;
	const userRef = dbRef.child(`${skillName}`);

	if (target.matches('.minus')) {
		count = Number(count) - 1;

		updateCountOnFirebase(count, userRef);
	} else if (target.matches('.plus')) {
		count = Number(count) + 1;

		updateCountOnFirebase(count, userRef);
	}
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

// function that takes userinput and compares it to keyword list and returns the matches
function findMatches(wordToMatch, arrayOfKeyword) {
	let currentWordFromUserInput = wordToMatch.split(' ');
	let arrayOfMatchedWords = [];
	arrayOfKeyword.filter((word) => {
		currentWordFromUserInput.map((item) => {
			if (word.includes(item) && item != '') {
				arrayOfMatchedWords.push(word);
			}
		});
	});
	return arrayOfMatchedWords;
}

// function that creates array of highlighted words in the text area
createArrayOfHightlightedWords = (e) => {
	const userInput = e.target.value;
	let matchingWords = findMatches(userInput, arrayOfKeyword);
	arrayOfHighlightedWords = [...matchingWords];
};

// jQuery function that handles highlighting the keywords in textarea
$('.array-example').highlightWithinTextarea({
	highlight: arrayOfKeyword
});

textAreaUserInput.addEventListener('change', createArrayOfHightlightedWords);
textAreaUserInput.addEventListener('keyup', createArrayOfHightlightedWords);
window.addEventListener('load', updateListFromFirebase);
entireForm.addEventListener('submit', addItemToList);
listOfSkills.addEventListener('click', changeCount);
