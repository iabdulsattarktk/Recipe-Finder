// ===== RECIPE FINDER - script.js =====
// Author: [Apna naam likho]
// Purpose: Handle all interactivity and DOM manipulation for Recipe Finder

// ===== RECIPE DATA ARRAY =====
// Har object ek recipe represent karta hai
// Properties: name, category, ingredients (array), instructions, image (URL)
const recipes = [
    {
        name: "Scrambled Eggs",
        category: "Breakfast",
        ingredients: ["eggs", "butter", "milk", "salt", "pepper"],
        instructions: "Beat eggs with milk and salt. Melt butter in pan on low heat. Pour egg mixture and stir slowly until soft and creamy. Serve hot.",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=180&fit=crop"
    },
    {
        name: "Chicken Sandwich",
        category: "Lunch",
        ingredients: ["chicken", "bread", "lettuce", "tomato", "mayonnaise"],
        instructions: "Grill chicken breast with salt and pepper. Toast bread slices. Spread mayonnaise, add lettuce, tomato and chicken. Serve immediately.",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=180&fit=crop"
    },
    {
        name: "Vegetable Pasta",
        category: "Dinner",
        ingredients: ["pasta", "tomato", "garlic", "onion", "olive oil", "basil"],
        instructions: "Boil pasta until al dente. Saute garlic and onion in olive oil. Add chopped tomatoes and cook 10 minutes. Mix with pasta and top with basil.",
        image: "https://images.unsplash.com/photo-1551183053-bf91798d9c83?w=400&h=180&fit=crop"
    },
    {
        name: "Chocolate Brownie",
        category: "Dessert",
        ingredients: ["chocolate", "butter", "sugar", "eggs", "flour", "cocoa powder"],
        instructions: "Melt chocolate and butter together. Mix in sugar and eggs. Fold in flour and cocoa. Pour in greased pan and bake at 180C for 25 minutes.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=180&fit=crop"
    },
    {
        name: "Chicken Karahi",
        category: "Dinner",
        ingredients: ["chicken", "tomato", "ginger", "garlic", "green chili", "oil", "spices"],
        instructions: "Heat oil in wok. Add chicken and fry until golden. Add tomatoes, ginger, garlic and spices. Cook on high heat 20 minutes until oil separates.",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=180&fit=crop"
    },
    {
        name: "Pancakes",
        category: "Breakfast",
        ingredients: ["flour", "eggs", "milk", "butter", "sugar", "baking powder"],
        instructions: "Mix flour, sugar and baking powder. Beat eggs with milk and melted butter. Combine wet and dry ingredients. Cook on hot griddle 2 min each side.",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=180&fit=crop"
    }
];

// ===== DOM ELEMENTS =====
// HTML elements ko JS variables mein store karo taake baar baar dhundhna na pare
const searchInput = document.getElementById('searchInput');   // Search text box
const searchBtn = document.getElementById('searchBtn');       // Search button
const recipeContainer = document.getElementById('recipeContainer'); // Results container
const favoritesList = document.getElementById('favoritesList');     // Favorites list

// ===== FAVORITES ARRAY =====
// localStorage se pehle saved favorites load karo
// Agar kuch nahi mila toh khali array se shuru karo
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// ===== SEARCH BUTTON: CLICK EVENT LISTENER =====
// Jab user Search button dabaye toh ye function chale
searchBtn.addEventListener('click', function() {

    // Input value lo, extra spaces hatao, lowercase karo
    const query = searchInput.value.trim().toLowerCase();

    // Validation: khali search allow nahi
    if (query === '') {
        alert('Please enter an ingredient or category to search!');
        return; // Function yahan rok do
    }

    // Checked checkboxes collect karo
    const checkedCategories = [];
    document.querySelectorAll('#categoryFilters input[type="checkbox"]').forEach(function(checkbox) {
        if (checkbox.checked) {
            checkedCategories.push(checkbox.value); // Checked wali category array mein daalo
        }
    });

    // Filter function call karo query aur categories ke saath
    filterRecipes(query, checkedCategories);
});

// ===== ENTER KEY: EVENT LISTENER =====
// User Enter dabaye toh bhi search button click ho
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// ===== FILTER RECIPES FUNCTION =====
// query: user ka search text
// checkedCategories: checked checkboxes ki values ka array
function filterRecipes(query, checkedCategories) {

    // Pehle purane results saaf karo
    recipeContainer.innerHTML = '';

    // Array.filter() se matching recipes nikalo
    const filtered = recipes.filter(function(recipe) {

        // Ingredient match: koi bhi ingredient query se match kare
        const ingredientMatch = recipe.ingredients.some(function(ing) {
            return ing.toLowerCase().includes(query);
        });

        // Name ya category match check
        const nameMatch = recipe.name.toLowerCase().includes(query);
        const categoryMatch = recipe.category.toLowerCase().includes(query);

        // Koi bhi text match kare toh recipe include karo
        const textMatch = ingredientMatch || nameMatch || categoryMatch;

        // Checkbox filter: agar koi checkbox checked nahi toh sab dikhao
        // Checked hain toh sirf unhi categories ke recipes
        const categoryFilterMatch = checkedCategories.length === 0 ||
            checkedCategories.includes(recipe.category);

        // Dono conditions true honi chahiye
        return textMatch && categoryFilterMatch;
    });

    // Agar koi result nahi mila toh friendly message dikhao
    if (filtered.length === 0) {
        recipeContainer.innerHTML = '<p class="no-result">😔 No recipes found. Try a different ingredient or category!</p>';
        return;
    }

    // Har matching recipe ka card banao
    filtered.forEach(function(recipe) {
        displayRecipeCard(recipe);
    });
}

// ===== DISPLAY RECIPE CARD FUNCTION =====
// DOM Creation: createElement aur appendChild use ho raha hai yahan
function displayRecipeCard(recipe) {

    // Naya div element banao — createElement (DOM creation method)
    const card = document.createElement('div');
    card.className = 'recipe-card';

    // Card ke andar HTML content inject karo
    card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}" 
             style="width:100%; height:180px; object-fit:cover; border-radius:8px; margin-bottom:10px;"
             onerror="this.src='https://via.placeholder.com/400x180?text=Recipe+Image'">
        <h3>${recipe.name}</h3>
        <p><strong>Category:</strong> ${recipe.category}</p>
        <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
        
        <button class="toggle-btn" onclick="toggleInstructions(this)">
            📖 Show Instructions
        </button>
        <p class="instructions">${recipe.instructions}</p>
        
        <button class="fav-btn" onclick="addToFavorites('${recipe.name}')">
            ❤️ Add to Favorites
        </button>
    `;

    // Card ko container mein add karo — appendChild (DOM creation method)
    recipeContainer.appendChild(card);
}

// ===== TOGGLE INSTRUCTIONS FUNCTION =====
// Collapsible instructions: show/hide toggle
// DOM Traversal: parentNode aur querySelector use ho raha hai
function toggleInstructions(btn) {

    // btn ke parent card se instructions paragraph dhundo — parentNode (DOM traversal)
    const instructions = btn.parentNode.querySelector('.instructions');

    // Agar dikh rahi hain toh chhupao, nahi toh dikhao
    if (instructions.style.display === 'block') {
        instructions.style.display = 'none';
        btn.textContent = '📖 Show Instructions';
    } else {
        instructions.style.display = 'block';
        btn.textContent = '🔼 Hide Instructions';
    }
}

// ===== ADD TO FAVORITES FUNCTION =====
// Recipe ko favorites array mein add karo aur localStorage mein save karo
function addToFavorites(recipeName) {

    // Duplicate check: pehle se favorites mein hai?
    if (favorites.includes(recipeName)) {
        alert(`"${recipeName}" is already in your favorites!`);
        return; // Dobara add mat karo
    }

    // Favorites array mein push karo
    favorites.push(recipeName);

    // localStorage mein save karo — page reload pe bhi rahega
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Favorites section update karo
    renderFavorites();

    alert(`"${recipeName}" added to favorites! ❤️`);
}

// ===== RENDER FAVORITES FUNCTION =====
// Favorites array ke basis pe HTML list render karo
function renderFavorites() {

    // Pehle list khali karo
    favoritesList.innerHTML = '';

    // Agar favorites khali hain toh message dikhao
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<li class="no-result">No favorites yet. Search and add some! 🍽️</li>';
        return;
    }

    // Har favorite ke liye list item banao
    favorites.forEach(function(name) {
        const li = document.createElement('li'); // createElement (DOM creation)
        li.innerHTML = `
            <span>❤️ ${name}</span>
            <button class="remove-btn" onclick="removeFromFavorites('${name}')">
                🗑️ Remove
            </button>
        `;
        favoritesList.appendChild(li); // appendChild (DOM creation)
    });
}

// ===== REMOVE FROM FAVORITES FUNCTION =====
// Favorites array se recipe hata do aur localStorage update karo
function removeFromFavorites(recipeName) {

    // Filter se wo item remove karo jiska naam match kare
    favorites = favorites.filter(function(name) {
        return name !== recipeName;
    });

    // localStorage update karo
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Display update karo
    renderFavorites();
}

// ===== PAGE LOAD: FAVORITES RENDER =====
// Page khulte hi localStorage se favorites load karke dikhao
renderFavorites();

