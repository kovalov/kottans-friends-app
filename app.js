const URL =
  'https://randomuser.me/api/?results=20&nat=us,dk,fr,gb&inc=gender,name,email,dob,phone,picture';
const userListElement = document.querySelector('.user-list');
const searchInputElement = document.querySelector(
  '.filter-options__search-input'
);
const genderInputElement = document.querySelector('.gender-sort');
const genderAllInputElement = document.querySelector(
  '.gender-sort__input--all'
);
const nameSortElement = document.querySelector('.name-sort');
const resetButtonElement = document.querySelector(
  '.filter-options__reset-button '
);

let userData = [];
let isSortedByName = '';
let isFilteredByGender = '';

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
  const { fullName, gender, email, age, phone, imageUrl } = data;
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

async function init(url, container) {
  userData = await getUserData(url);
  renderUserElements([...userData], container);
}

function handleSearch(e) {
  const { value: filterValue } = e.target;

  if (isFilteredByGender !== 'all') {
    const arrayByGender = filterUsersByGender(
      userData,
      isFilteredByGender
    );
    const arrayByName = filterUsersByName(arrayByGender, filterValue);
    renderUserElements(arrayByName, userListElement);
  }

  if (isFilteredByGender === 'all' || !isFilteredByGender) {
    const filteredUserData = filterUsersByName(userData, filterValue);
    renderUserElements(filteredUserData, userListElement);
  }
}

function filterUsersByGender(data, filterValue) {
  return data.filter((userItem) => userItem.gender === filterValue);
}

function sortUsersByName(data, filterValue) {
  if (filterValue === 'az')
    return [...data].sort((a, b) =>
      a.fullName < b.fullName ? -1 : 1
    );

  return [...data].sort((a, b) => (a.fullName > b.fullname ? -1 : 1));
}

function handleGenderSort(e) {
  const { value: filterValue } = e.target;
  isFilteredByGender = filterValue;

  searchInputElement.value = '';

  if (filterValue !== 'all') {
    const filteredUserData = filterUsersByGender(
      userData,
      filterValue
    );
    renderUserElements(filteredUserData, userListElement);
    return;
  }

  if (filterValue === 'all') {
    renderUserElements(userData, userListElement);
    return;
  }
}

function handleNameSort(e) {
  const { value: filterValue } = e.target;
  const filteredUserData = sortUsersByName(userData, filterValue);
  searchInputElement.value = '';
  renderUserElements(filteredUserData, userListElement);
  return;
}

function resetFilters() {
  genderAllInputElement.checked = true;
  isFilteredByGender = '';
  renderUserElements(userData, userListElement);
}

searchInputElement.addEventListener('keyup', handleSearch);
genderInputElement.addEventListener('change', handleGenderSort);
nameSortElement.addEventListener('change', handleNameSort);
resetButtonElement.addEventListener('click', resetFilters);

init(URL, userListElement);
