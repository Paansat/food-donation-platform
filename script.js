document.addEventListener("DOMContentLoaded", () => {
    const foodForm = document.getElementById("food-form");
    const foodList = document.getElementById("food-list");
    const messageBox = document.getElementById("message-box"); // Get the message div

    // Load existing food items from localStorage
    function getFoodItems() {
        return JSON.parse(localStorage.getItem("foodItems")) || [];
    }

    function saveFoodItems(items) {
        localStorage.setItem("foodItems", JSON.stringify(items));
    }

    function displayFoodItems() {
        foodList.innerHTML = "";
        const foodItems = getFoodItems();

        foodItems.forEach((item, index) => {
            const foodItem = document.createElement("div");
            foodItem.classList.add("food-item");
            foodItem.innerHTML = `
                <h3>${item.name}</h3>
                <p>Quantity: ${item.quantity}</p>
                <p>Expiry Date: ${item.expiryDate}</p>
                <p>Pickup Location: ${item.location}</p>
                <button class="claim-btn" data-index="${index}">Claim</button>
            `;
            foodList.appendChild(foodItem);
        });
    }

    foodForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const foodName = document.getElementById("food-name").value.trim();
        const quantity = document.getElementById("quantity").value.trim();
        const expiryDate = document.getElementById("expiry-date").value;
        const location = document.getElementById("location").value.trim();

        if (!foodName || !quantity || !expiryDate || !location) {
            showMessage("All fields are required!", "error");
            return;
        }

        const today = new Date().toISOString().split("T")[0];
        if (expiryDate < today) {
            showMessage("Expiry date must be in the future!", "error");
            return;
        }

        const newFoodItem = { name: foodName, quantity, expiryDate, location };
        const foodItems = getFoodItems();
        foodItems.push(newFoodItem);
        saveFoodItems(foodItems);

        displayFoodItems();
        foodForm.reset();
        showMessage("Food item added successfully!", "success");
    });

    foodList.addEventListener("click", (event) => {
        if (event.target.classList.contains("claim-btn")) {
            const index = event.target.getAttribute("data-index");
            const foodItems = getFoodItems();
            const claimedItem = foodItems[index].name;

            foodItems.splice(index, 1);
            saveFoodItems(foodItems);
            displayFoodItems();

            showMessage(`You have claimed "${claimedItem}". Thank you!`, "success");
        }
    });

    function showMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = `message ${type}`;
        messageBox.style.display = "block";

        setTimeout(() => {
            messageBox.style.display = "none";
        }, 3000);
    }

    displayFoodItems();
});
