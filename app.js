const URL =
  'https://randomuser.me/api/?results=20&nat=us,dk,fr,gb&inc=gender,name,email,dob,phone,picture';
const userListElement = document.querySelector('.user-list');
const searchInputElement = document.querySelector(
  '.filter-options__search-input'
);
const genderInputElement = document.querySelector('.gender-sort');
// const genderAllInputElement = document.querySelector(
//   '.gender-sort__input--all'
// );
const nameSortInputElement = document.querySelector('.name-sort');
const ageSortInputElement = document.querySelector('.age-sort');
// const resetButtonElement = document.querySelector(
//   '.filter-options__reset-button '
// );

let userData = [];
let isFilteredByGender = '';
let isSortedByNameOrder = '';
let isSortedByAgeOrder = '';

async function getData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

async function getUserData(url) {
  const data = await getData(url);
  return data.map((item) => ({
    fullName: `${item.name.first} ${item.name.last}`,
    gender: item.gender,
    email: item.email,
    age: item.dob.age,
    phone: item.phone,
    imageUrl: item.picture.large,
  }));
}

function createUserElement(data) {
  const { fullName, email, age, phone, imageUrl } = data;
  const element = document.createElement('li');
  element.classList.add('user-list__user-item', 'user-item');
  element.innerHTML = `
		<img
			src="${imageUrl}"
			alt=""
			class="user-item__image"
 		/>
 		<div class="user-item__details">
			<h2 class="user-item__title">
	  			<span class="user-item__title-name">${fullName}</span>,
	  			<span class="user-item__title-age">${age}</span>
			</h2>
			<a href="mailto:${email}" class="user-item__email">
				${email}
			</a>
			<a href="tel:${phone}" class="user-item__tel">
				${phone}
			</a>
 		</div>
	`;
  return element;
}

function appendUserElement(element, container) {
  container.appendChild(element);
}

function renderUserElements(data, container) {
  container.innerHTML = '';
  const userDataElements = data.map((item) =>
    createUserElement(item)
  );
  userDataElements.forEach((element) =>
    appendUserElement(element, container)
  );
}

function filterUsersByName(data, filterValue) {
  return data.filter((userItem) =>
    userItem.fullName
      .toLowerCase()
      .includes(filterValue.toLowerCase())
  );
}

function filterUsersByGender(data, filterValue) {
  if (filterValue === 'all') return data;

  return data.filter((userItem) => userItem.gender === filterValue);
}

function sortUsersByName(data, sortOrder) {
  if (sortOrder === 'ascending') {
    return [...data].sort((a, b) =>
      a.fullName < b.fullName ? -1 : 1
    );
  }

  if (sortOrder === 'descending')
    return [...data].sort((a, b) =>
      a.fullName > b.fullname ? -1 : 1
    );
}

function sortUsersByAge(data, sortOrder) {
  if (sortOrder === 'ascending') {
    return [...data].sort((a, b) => (a.age < b.age ? -1 : 1));
  }

  if (sortOrder === 'descending') {
    return [...data].sort((a, b) => (a.age > b.age ? -1 : 1));
  }
}

async function init(url, container) {
  userData = await getUserData(url);
  renderUserElements(userData, container);
}

function handleSearch({ target }) {
  const { value: filterValue } = target;
  let filteredByParamArray = '';

  if (isFilteredByGender) {
    filteredByParamArray = filterUsersByGender(
      userData,
      isFilteredByGender
    );
  }

  if (isSortedByNameOrder) {
    filteredByParamArray = sortUsersByName(
      userData,
      isSortedByNameOrder
    );
  }

  if (isSortedByAgeOrder) {
    filteredByParamArray = sortUsersByAge(
      userData,
      isSortedByAgeOrder
    );
  }

  const filteredUserData = filterUsersByName(
    filteredByParamArray,
    filterValue
  );
  renderUserElements(filteredUserData, userListElement);
  return;
}

function handleGenderSort({ target }) {
  isFilteredByGender = target.value;

  const filteredUserData = filterUsersByGender(
    userData,
    isFilteredByGender
  );
  renderUserElements(filteredUserData, userListElement);
  return;
}

function handleNameSort({ target }) {
  if (!target.closest('.name-sort__button')) return;

  isSortedByNameOrder = target.closest('.name-sort__button').value;

  const filteredUserData = sortUsersByName(
    userData,
    isSortedByNameOrder
  );
  renderUserElements(filteredUserData, userListElement);
  return;
}

function handleAgeSort({ target }) {
  if (!target.closest('.age-sort__button')) return;

  isSortedByAgeOrder = target.closest('.age-sort__button').value;

  const filteredUserData = sortUsersByAge(
    userData,
    isSortedByAgeOrder
  );
  renderUserElements(filteredUserData, userListElement);
  return;
}

// function resetFilters() {
//   genderAllInputElement.checked = true;
//   isFilteredByGender = '';
//   renderUserElements(userData, userListElement);
// }

searchInputElement.addEventListener('keyup', handleSearch);
genderInputElement.addEventListener('change', handleGenderSort);
nameSortInputElement.addEventListener('click', handleNameSort);
ageSortInputElement.addEventListener('click', handleAgeSort);
// resetButtonElement.addEventListener('click', resetFilters);

init(URL, userListElement);
