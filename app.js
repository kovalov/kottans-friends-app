const url =
  'https://randomuser.me/api/?results=20&nat=us,dk,fr,gb&inc=gender,name,email,dob,phone,picture';

const userListElement = document.querySelector('.user-list');
const filterFormElement = document.querySelector('.filter-options');
const nameSearchElement = document.querySelector(
  '.name-search-control'
);
const ageSortElement = document.querySelector('.age-sort');
const nameSortElement = document.querySelector('.name-sort');
const genderFilterElement = document.querySelector('.gender-filter');
const resetButton = document.querySelector('.filter-options__button');

let userData = [];

// const filterState = {
//   search: null,
//   gender: 'all',
//   sortName: null,
//   sortAge: null,
// };

async function getUserData(url) {
  const response = await fetch(url);
  const { results: userData } = await response.json();
  return userData.map((userDataItem) => ({
    fullName: `${userDataItem.name.first} ${userDataItem.name.last}`,
    gender: userDataItem.gender,
    email: userDataItem.email,
    age: userDataItem.dob.age,
    phone: userDataItem.phone,
    imageUrl: userDataItem.picture.large,
  }));
}

function createUserItem({ fullName, email, age, phone, imageUrl }) {
  const userListItem = document.createElement('li');
  userListItem.classList.add('user-list__item');
  userListItem.innerHTML = `
		<img
			src="${imageUrl}"
			alt="${fullName} Image"
			class="user-list__item-image"
 		/>
 		<div class="user-list__item-details">
			<div class="user-list__item-title">
	  			<span class="user-list__item-name">${fullName}</span>,
	  			<span class="user-list__item-age">${age}</span>
			</div>
			<a
	  			href="mailto:${email}"
	  			class="user-list__item-email"
			>
	  			${email}
			</a>
			<a href="tel:${phone}" class="user-list__item-tel">${phone}</a>
 		</div>
	`;
  return userListItem;
}

function addUserItem(element, listContainer) {
  listContainer.appendChild(element);
}

function renderUserList(userData, listContainer) {
  listContainer.innerHTML = '';
  const userListItems = userData.map((userDataItem) =>
    createUserItem(userDataItem)
  );
  userListItems.forEach((userListItem) =>
    addUserItem(userListItem, listContainer)
  );
}

async function init(url, listElement) {
  userData = await getUserData(url);
  renderUserList(userData, listElement);
}

function filterUsersByName(userData, inputValue) {
  //   filterState.search = inputValue;
  return userData.filter(({ fullName }) =>
    fullName.toLowerCase().includes(inputValue.toLowerCase())
  );
}

function sortUsersByAge(userData, sortOrder) {
  //   filterState.sortAge = sortOrder;
  return [...userData].sort((a, b) => {
    if (sortOrder === 'ascending') return a.age - b.age;
    if (sortOrder === 'descending') return b.age - a.age;
  });
}

function sortUsersByName(userData, sortOrder) {
  //   filterState.sortName = sortOrder;
  return [...userData].sort((a, b) => {
    if (sortOrder === 'ascending')
      return a.fullName > b.fullName ? 1 : -1;
    if (sortOrder === 'descending')
      return b.fullName > a.fullName ? 1 : -1;
  });
}

function filterUsersByGender(userData, genderValue) {
  //   filterState.gender = genderValue;
  if (genderValue === 'all') return userData;

  return userData.filter(({ gender }) => gender === genderValue);
}

function handleNameSearchChange({ target }) {
  const inputValue = target.value.trim();
  const foundUserNames = filterUsersByName(userData, inputValue);
  renderUserList(foundUserNames, userListElement);
}

function handleAgeSortChange({ target }) {
  const { value: sortOrder } = target;

  const sortedUsersByAge = sortUsersByAge(userData, sortOrder);
  renderUserList(sortedUsersByAge, userListElement);
}

function handleNameSortChange({ target }) {
  const { value: sortOrder } = target;

  const sortedUsersByName = sortUsersByName(userData, sortOrder);
  renderUserList(sortedUsersByName, userListElement);
}

function handleGenderFilterChange({ target }) {
  const { value: inputValue } = target;

  const filteredUsersByGender = filterUsersByGender(
    userData,
    inputValue
  );
  renderUserList(filteredUsersByGender, userListElement);
}

function handleFilterResetClick() {
  renderUserList(userData, userListElement);
}

function handleEvents() {
  filterFormElement.addEventListener('submit', (e) =>
    e.preventDefault()
  );
  nameSearchElement.addEventListener('keyup', handleNameSearchChange);
  ageSortElement.addEventListener('change', handleAgeSortChange);
  nameSortElement.addEventListener('change', handleNameSortChange);
  genderFilterElement.addEventListener(
    'change',
    handleGenderFilterChange
  );
  resetButton.addEventListener('click', handleFilterResetClick);
}

handleEvents();
init(url, userListElement);
