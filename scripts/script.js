// list of keywords that is used to compare to user input.
const hugeListOfKeywords = [
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
const arrayOfSkills = [];
let arrayOfMatchedWords = [];
let arrayOfHighlightedWords = [];

// function to render newly typed skill and call sendToFirebase function
function addItemToList(e) {
	let count = 1; // change to inital count

	e.preventDefault();
	arrayOfHighlightedWords.map((highlightedWord) => {
		console.log(highlightedWord);

		arrayOfSkills.push(highlightedWord);
		sendToFirebase(e, highlightedWord, count);
		entireForm.reset();
	});
}

// function to send new item to firebase
sendToFirebase = (event, skill, count) => {
	event.preventDefault();
	const newSkill = { skill, count };
	dbRef.update({
		[skill]: newSkill
	});
};

// function to listen to changes in firebase database and render UI on change
updateListFromFirebase = dbRef.on('value', (response) => {
	const firebaseArray = Object.values(response.val());
	const sortedFirebaseArray = firebaseArray.sort((a, b) =>
		a.count < b.count ? 1 : -1
	);

	listOfSkills.innerHTML = '';

	sortedFirebaseArray.map((item) => {
		listOfSkills.innerHTML += `
	<div class="skillContainer">
		<li class="skillName">${item.skill}</li>
		<p class="count">${item.count}</p>
		<button class="plus">+</button>
		<button class="minus">-</button>
	</div>
	`;
	});
});

// create array of highlighted words from text area
createArrayOfHightlightedWords = ({ target }) => {
	const userInput = target.value;
	let matchingWords = findMatches(userInput);
	arrayOfHighlightedWords = [...matchingWords];
};

// returns matches
function findMatches(userInput) {
	let finalString = removePunctation(userInput);
	let arrayOfWordsFromUserInput = finalString.split(' ');

	compareUserInput(hugeListOfKeywords, arrayOfWordsFromUserInput);

	return arrayOfMatchedWords;
}

// compares hugeListOfKeywords with userInput

function compareUserInput(hugeListOfKeywords, arrayOfWordsFromUserInput) {
	hugeListOfKeywords.filter((keyword) => {
		arrayOfWordsFromUserInput.map((currentWord) => {
			if (keyword === currentWord && currentWord != '') {
				arrayOfMatchedWords.push(keyword);
			}
		});
	});
}

// remove punctation and extra spaces from userInput
function removePunctation(userInput) {
	let punctuationless = userInput.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
	return punctuationless.replace(/\s{2,}/g, ' ');
}

// update counter & delete any skill with a count of 0
function updateCount({ target }) {
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

// jQuery function that handles highlighting the keywords in textarea
$('.array-example').highlightWithinTextarea({
	highlight: hugeListOfKeywords
});

textAreaUserInput.addEventListener('change', createArrayOfHightlightedWords);
textAreaUserInput.addEventListener('keyup', createArrayOfHightlightedWords);
window.addEventListener('load', updateListFromFirebase);
entireForm.addEventListener('submit', addItemToList);
listOfSkills.addEventListener('click', updateCount);
