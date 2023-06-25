const mealsEl = document.getElementById('meals')
const favMeals = document.getElementById('fav-meals')
const searchTerm = document.getElementById('search-term')
const searchBtn = document.getElementById('search')
const mealPopup = document.getElementById('meal-popup')
const popupCloseBtn = document.getElementById('close-popup')
const mealInfoEl = document.getElementById('meal-info')

getRandomMeal();
fetchFavMeals();
async function getRandomMeal() {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const respData = await resp.json();
    const randomMeal = respData.meals[0]
    /*console.log(respData.meals[0].strMeal)*/
    const pork = respData.meals[0].strMeal
    if (pork == 'Tonkatsu pork' || pork ==
        'Pork Cassoulet' || pork == 'Sweet and Sour Pork' || pork ==
        'BBQ Pork Sloppy Joes' || pork == 'Coddled pork with cider' ||
        pork == 'Vietnamese Grilled Pork (bun-thit-nuong)' || pork ==
        'Portuguese barbecued pork (Febras assadas)'
        || pork == 'Skillet Apple Pork Chops with Roasted Sweet Potatoes & Zucchini' ||
        pork == 'Ham hock colcannon' ||
        pork == 'Chicken Ham and Leek Pie'

    ) {
        getRandomMeal()
    } else {
        addMeal(randomMeal, true)
    }
    /*addMeal(randomMeal, true)*/
}

async function getMealById(id) {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id
    )

    const respData = await resp.json()

    const meal = respData.meals[0]

    return meal
}

async function getMealBySearch(term) {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term)
    const respData = await resp.json()
    const meals = respData.meals
    return meals
}

function addMeal(mealData, random = false) {
    const meal = document.createElement('div')
    meal.classList.add('meal')
    meal.innerHTML = `
                <div class="meal-header">
                ${random ? `<span class="random">Random Recipe</span>` : ''}
                    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
                </div>
                <div class="meal-body">
                    <h4>${mealData.strMeal}</h4>
                    <button class="fav-btn"><i class="fa fa-heart"></i></button>
                </div>
`
    const btn = meal.querySelector(".meal-body .fav-btn")
    btn.addEventListener("click", () => {
        if (btn.classList.contains('active')) {
            btn.classList.remove("active")
            removeMealLS(mealData.idMeal)
        } else {
            btn.classList.add("active")
            addMealLS(mealData.idMeal)
        }

        fetchFavMeals()
    })

    const mealHeader = meal.querySelector('.meal-header')

    mealHeader.addEventListener('click', () => {
        showMealInfo(mealData)
    })

    mealsEl.appendChild(meal)
}

function addMealLS(mealId) {
    const mealIds = getMealsLS()
    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]))
}

function removeMealLS(mealId) {
    const mealIds = getMealsLS()
    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter((id) => id !== mealId)))
}

function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"))
    return mealIds === null ? [] : mealIds
}

async function fetchFavMeals() {
    favMeals.innerHTML = ''
    const mealIds = getMealsLS()
    const meals = []
    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        meal = await getMealById(mealId)
        addMealFav(meal)
    }
}



function addMealFav(mealData) {
    const favMeal = document.createElement('li')
    favMeal.innerHTML = `
    <button class="clear"><i class="fa-solid fa-xmark"></i></button>
    <img class="elInfo" src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
                        <span>${mealData.strMeal}</span>
                        </li>
                
`
    const infoEL = favMeal.querySelector('.elInfo')

    const btn = favMeal.querySelector('.clear')

    btn.addEventListener("click", () => {
        removeMealLS(mealData.idMeal)
        fetchFavMeals()
    })

    infoEL.addEventListener('click', () => {
        showMealInfo(mealData)
    })

    favMeals.appendChild(favMeal)
}




function showMealInfo(mealData) {
    mealInfoEl.innerHTML = ''
    const mealEl = document.createElement('div')
    const ingredients = []

    for (let i = 1; i <= 20; i++) {
        if (mealData['strIngredient' + i]) {
            ingredients.push(`${mealData['strIngredient' + i]} - ${mealData['strMeasure' + i]}`)
        } else {
            break
        }
    }
    mealEl.innerHTML = `
                <h1>${mealData.strMeal}</h1>
                    <img src="${mealData.strMealThumb}" alt="">
                    <p>
                        ${mealData.strInstructions}
                    </p>
                    <h3> Ingredients: </h3>
                    <ul>
                    ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
                    </ul>
    `
    mealInfoEl.appendChild(mealEl)

    mealPopup.classList.remove('hidden')
}

searchBtn.addEventListener('click', async () => {
    mealsEl.innerHTML = ''
    const search = searchTerm.value
    if (search == 'pork' || search == 'ham' || search == 'Ham' || search == 'Pork') {
        alert('انها حرام يا صديقي')
    } else {
        const meals = await getMealBySearch(search)
        if (meals) {
            meals.forEach(meal => {
                addMeal(meal)
            });
        }
    }

})

popupCloseBtn.addEventListener('click', () => {
    mealPopup.classList.add('hidden')
})






/* 
3/17
 */

