let listOfMeals;
let weeklyMeals = [];

const mealCardList = document.getElementsByClassName("mealCardList");
const getWeekData = document.getElementById("weekly-plan");
const getDinnerData = document.getElementById("dinner-tonight");
const getSundayDinnerData = document.getElementById("sunday-dinner");
const getLunchData = document.getElementById("lunch");


getWeekData.addEventListener("click", generateWeeklyMeal)
getDinnerData.addEventListener("click", generateTonightDinner)
getSundayDinnerData.addEventListener("click", generateSundayDinner)
getLunchData.addEventListener("click", generateLunchMeals)

//API CALL
async function fetchMeals() {
  const response = await fetch(" http://localhost:3000/meals");
  listOfMeals = await response.json();
}

await fetchMeals();

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getMultipleRandom(arr, num) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, num);
}


function createMealCard(meal) {
  const mealCardList = document.querySelector(".mealCardList");
  const mealCard = document.createElement("div");
  mealCard.classList.add("mealCard");

  mealCard.innerHTML = `
    <div class="mealCard-brief">
        <span class="mealCard-name pill">🍽️ ${meal.meal_title || 'Dish'}</span>
        <span class="mealCard-ethnicity pill">📍Origin : ${meal.ethnicity}</span>
        <span class="mealCard-served pill">Served: ${meal.temp == 'Room' ? `${meal.temp} ☕` : meal.temp == 'Cold' ? `${meal.temp} 🥶` : 'Hot ♨️'} </span>
        <span class="mealCard-category pill">${meal.type == 'Lunch' ? 'Lunch 🌞' : 'Dinner 🌛'} </span>
    </div>
    <div class="mealCard-ingredient">
        <p>Ingredients 📃</p>
        <ul class="mealCard-ingredient__list">
        ${meal.fresh_ingredients
      .map((ingredient) => `<li class="primary pill">${ingredient}</li>`)
      .join("")}
            ${meal.ingredients
      .map((ingredient) => `<li class="secondary pill">${ingredient}</li>`)
      .join("")}
        </ul>
    </div>
    <div class="mealCard-detailed">
        <p class="duration">⌚ ${meal.prep_time} Minutes</p>
        <p class="availability">Available on Sunday : ${meal.sunday_ok ? "😀 Yes" : "😪 No"
    }</p>
    </div>
  `;

  mealCardList.appendChild(mealCard);
}


function generateLunchMeals() {
  clearMealCardList()
  const lunchMeals = listOfMeals.filter((item) => {
    if (item.type.includes("Lunch")) return item;
  });
  const randomIndex = getRandomNumber(0, lunchMeals.length - 1);
  createMealCard(lunchMeals[randomIndex]);
}


function generateSundayDinner() {
  clearMealCardList()
  const sundayMeals = listOfMeals.filter((item) => { if (item.sunday_ok === true) return item; });
  const randomIndex = getRandomNumber(0, sundayMeals.length - 1);
  createMealCard(sundayMeals[randomIndex]);
}

function generateTonightDinner() {
  clearMealCardList()
  const tonightDinnerMeals = listOfMeals.filter((item) => {
    if (
      item.probability_kids_will_eat >= 0.9 &&
      item.prep_time <= 30 &&
      item.requires_fresh === false
    )
      return item;
  });
  const randomIndex = getRandomNumber(0, tonightDinnerMeals.length - 1);
  createMealCard(tonightDinnerMeals[randomIndex]);
}

function generateWeeklyMeal() {
  weeklyMeals = []
  clearMealCardList()

  // meal for sunday
  const sundayMeals = listOfMeals.filter((item) => { if (item.sunday_ok === true) return item; });
  const randomIndex = getRandomNumber(0, sundayMeals.length - 1);
  const sundayItem = sundayMeals[randomIndex];

  weeklyMeals.push(sundayItem);

  //  1 meal with prep time = 60
  const prepSixty = listOfMeals.filter((item) => { if (item.prep_time == 60) return item; })
  const randomIndex2 = getRandomNumber(0, prepSixty.length - 1);
  const prepSixtyItem = prepSixty[randomIndex2];

  weeklyMeals.push(prepSixtyItem);

  // 5 meals with prep_time <= 30
  const prepThirty = listOfMeals.filter((item) => {
    if (item.prep_time <= 30) return item;
  })

  // selecting 5 random meals
  const thirtyMinMeals = getMultipleRandom(prepThirty, 5);

  // combining the arrays
  weeklyMeals = [...weeklyMeals, ...thirtyMinMeals];
  weeklyMeals.forEach((meal) => {
    createMealCard(meal);
  });
}




function clearMealCardList() {
  const mealCardList = document.querySelector(".mealCardList");
  mealCardList.innerHTML = ''; // Remove all child elements
}






