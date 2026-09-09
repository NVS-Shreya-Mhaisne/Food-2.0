import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import RestaurantModel from "./models/RestaurantModel.js";
import FoodModel from "./models/foodModels.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log("🌱 Clearing old restaurant and food catalog data...");
    await RestaurantModel.deleteMany({});
    await FoodModel.deleteMany({});

    console.log("🏪 Creating all requested restaurants...");

    // 1. Cravely Flagship Kitchen
    const rCravely = await RestaurantModel.create({
      name: "Cravely (creave.ly) Flagship Hub",
      ownerName: "Cravely Founders Team",
      establishedYear: "2024",
      rating: 4.9,
      priceRange: "Budget to Premium (₹49 - ₹699)",
      deliveryTime: "15-25 mins",
      location: "Koramangala 5th Block, Bangalore",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80"
    });

    // 2. Kwality Refreshments
    const rKwality = await RestaurantModel.create({
      name: "Kwality Refreshments",
      ownerName: "Suresh Agarwal",
      establishedYear: "2011",
      rating: 4.4,
      priceRange: "North Indian, Pav Bhaji, Fast Food",
      deliveryTime: "35-40 mins",
      location: "Nigdi (2.4 km)",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80"
    });

    // 3. Mr & Mrs Idly
    const rMrMrsIdly = await RestaurantModel.create({
      name: "Mr & Mrs Idly",
      ownerName: "Murugan & Lakshmi",
      establishedYear: "2015",
      rating: 4.3,
      priceRange: "South Indian, Thali, Kerala",
      deliveryTime: "20-25 mins",
      location: "Pimple Saudagar (1.2 km)",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80"
    });

    // 4. Gayatri Bhel
    const rGayatri = await RestaurantModel.create({
      name: "Gayatri Bhel",
      ownerName: "Gayatri Family Trust",
      establishedYear: "2005",
      rating: 4.1,
      priceRange: "South Indian, Fast Food, Snacks",
      deliveryTime: "35-40 mins",
      location: "Pimple Gurav (3.1 km)",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80"
    });

    // 5. Upsouth
    const rUpsouth = await RestaurantModel.create({
      name: "Upsouth",
      ownerName: "Upsouth Foods Pvt Ltd",
      establishedYear: "2017",
      rating: 4.3,
      priceRange: "South Indian, Snacks, Beverages",
      deliveryTime: "35-45 mins",
      location: "Wakad (2.8 km)",
      image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&auto=format&fit=crop&q=80"
    });

    // 6. Wok & Roll Chinese
    const rWokRoll = await RestaurantModel.create({
      name: "Wok & Roll Chinese",
      ownerName: "Kenji Takahashi",
      establishedYear: "2018",
      rating: 4.5,
      priceRange: "Chinese, Asian, Noodles, Dim Sum",
      deliveryTime: "15-20 mins",
      location: "Wakad (1.5 km)",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80"
    });

    // 7. Golden Dragon
    const rGoldenDragon = await RestaurantModel.create({
      name: "Golden Dragon",
      ownerName: "David Chen",
      establishedYear: "2014",
      rating: 4.2,
      priceRange: "Chinese, Thai, Asian",
      deliveryTime: "25-30 mins",
      location: "Pimple Saudagar (2.2 km)",
      image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80"
    });

    // 8. The Chow Mein Place
    const rChowMein = await RestaurantModel.create({
      name: "The Chow Mein Place",
      ownerName: "Rohan Sharma",
      establishedYear: "2021",
      rating: 3.9,
      priceRange: "Chinese, Fast Food",
      deliveryTime: "10-15 mins",
      location: "Nigdi (0.8 km)",
      image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&auto=format&fit=crop&q=80"
    });

    // 9. Truffle Pizza Presto
    const rTrufflePizza = await RestaurantModel.create({
      name: "Truffle Pizza Presto",
      ownerName: "Chef Luigi Romano",
      establishedYear: "2019",
      rating: 4.6,
      priceRange: "Italian, Pizza, Gourmet",
      deliveryTime: "25-30 mins",
      location: "Wakad (2.0 km)",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80"
    });

    // 10. Pasta Palace & Pizza
    const rPastaPalace = await RestaurantModel.create({
      name: "Pasta Palace & Pizza",
      ownerName: "Marco Rossi & Sons",
      establishedYear: "2018",
      rating: 4.5,
      priceRange: "Italian, Pasta, Pizza",
      deliveryTime: "20-25 mins",
      location: "Pimple Saudagar (1.8 km)",
      image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&auto=format&fit=crop&q=80"
    });

    // 11. Biryani House
    const rBiryaniHouse = await RestaurantModel.create({
      name: "Biryani House",
      ownerName: "Ustad Rahim Khan",
      establishedYear: "2010",
      rating: 4.4,
      priceRange: "Indian, Biryani, Mughlai",
      deliveryTime: "25-30 mins",
      location: "Nigdi (2.5 km)",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
    });

    // 12. Behrouz Biryani
    const rBehrouz = await RestaurantModel.create({
      name: "Behrouz Biryani",
      ownerName: "Royal Kitchens Group",
      establishedYear: "2016",
      rating: 4.7,
      priceRange: "Royal Indian, Biryani, Kebabs",
      deliveryTime: "30-35 mins",
      location: "Wakad (3.5 km)",
      image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80"
    });

    // 13. Burger Bistro
    const rBurgerBistro = await RestaurantModel.create({
      name: "Burger Bistro",
      ownerName: "Kevin & Sarah Vance",
      establishedYear: "2020",
      rating: 4.5,
      priceRange: "American, Burgers, Fast Food",
      deliveryTime: "15-20 mins",
      location: "Pimple Saudagar (1.0 km)",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80"
    });

    // 14. Sandwich Express
    const rSandwichExp = await RestaurantModel.create({
      name: "Sandwich Express",
      ownerName: "Priya & Vikram Kulkarni",
      establishedYear: "2021",
      rating: 4.1,
      priceRange: "Sandwiches, Fast Food, Salads",
      deliveryTime: "10-15 mins",
      location: "Wakad (0.5 km)",
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80"
    });

    // 15. Dessert Junction
    const rDessertJunction = await RestaurantModel.create({
      name: "Dessert Junction",
      ownerName: "Chef Ananya Deshmukh",
      establishedYear: "2019",
      rating: 4.6,
      priceRange: "Desserts, Ice Cream, Waffles",
      deliveryTime: "15-20 mins",
      location: "Pimple Saudagar (1.3 km)",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80"
    });

    // 16. Baskin Robbins
    const rBaskinRobbins = await RestaurantModel.create({
      name: "Baskin Robbins",
      ownerName: "Baskin Robbins Franchise",
      establishedYear: "2015",
      rating: 4.5,
      priceRange: "Ice Cream, Desserts",
      deliveryTime: "10-15 mins",
      location: "Wakad (1.1 km)",
      image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80"
    });

    // 17. Anna's South Indian
    const rAnnas = await RestaurantModel.create({
      name: "Anna's South Indian",
      ownerName: "Anna Subramaniam",
      establishedYear: "2013",
      rating: 4.2,
      priceRange: "South Indian, Breakfast",
      deliveryTime: "15-20 mins",
      location: "Ravet (1.4 km)",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80"
    });

    // 18. Gourmet Rolls & Wraps
    const rGourmetRolls = await RestaurantModel.create({
      name: "Gourmet Rolls & Wraps",
      ownerName: "Tariq & Zoya Merchant",
      establishedYear: "2020",
      rating: 4.3,
      priceRange: "Rolls & Wraps, Fast Food",
      deliveryTime: "25-30 mins",
      location: "Wakad (2.5 km)",
      image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80"
    });

    // 19. Khichdi Express
    const rKhichdiExp = await RestaurantModel.create({
      name: "Khichdi Express",
      ownerName: "Healthy Bowls India",
      establishedYear: "2022",
      rating: 4.6,
      priceRange: "Indian, Comfort Food, Healthy",
      deliveryTime: "20-25 mins",
      location: "Wakad (2.0 km)",
      image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80"
    });

    console.log("✅ All 19 Restaurants created successfully!");

    console.log("🍲 Creating food menu items for all restaurants...");

    const foodItems = [
      // ==========================================
      // 1. Cravely Flagship Hub - 16 Dishes (Ordered ₹49 -> ₹699)
      // ==========================================
      {
        name: "Crispy Peri Peri French Fries",
        description: "Golden crispy potatoes tossed in signature Cravely peri peri spice blend.",
        ingredients: "Golden Potatoes, Peri Peri Seasoning, Sea Salt",
        price: 49,
        category: "Pure Veg",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80",
        restaurantId: rCravely._id,
        restaurantName: rCravely.name,
        isTopDish: false,
        discount: 0
      },
      {
        name: "Fresh Mint Lemonade Soda",
        description: "Chilled sparkling fizzy soda crushed with fresh mint leaves and key lime juice.",
        ingredients: "Sparkling Water, Fresh Mint, Lime Juice, Sugar Syrup",
        price: 69,
        category: "Beverages, Pure Veg",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80",
        restaurantId: rCravely._id,
        restaurantName: rCravely.name,
        isTopDish: false,
        discount: 0
      },
      {
        name: "South Indian Mini Idli Sambar",
        description: "Bite-sized steamed rice idlis submerged in piping hot authentic spiced lentil sambar.",
        ingredients: "Steamed Rice Idli, Lentil Sambar, Mustard Tempering",
        price: 89,
        category: "Pure Veg",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
        restaurantId: rCravely._id,
        restaurantName: rCravely.name,
        isTopDish: false,
        discount: 5
      },
      {
        name: "Alphonso Mango Lassi",
        description: "Rich thick creamy yogurt smoothie blended with ripe Alphonso mangoes and cardamom.",
        ingredients: "Alphonso Mangoes, Creamy Yogurt, Cardamom, Honey",
        price: 119,
        category: "Beverages, Pure Veg",
        image: "https://images.unsplash.com/photo-1623065422902-30a2d299bcc4?w=800&auto=format&fit=crop&q=80",
        restaurantId: rCravely._id,
        restaurantName: rCravely.name,
        isTopDish: false,
        discount: 10
      },
      {
        name: "Cheesy Garlic Breadsticks",
        description: "Oven-baked breadsticks brushed with garlic butter and topped with melted mozzarella.",
        ingredients: "Fresh Dough, Garlic Butter, Mozzarella Cheese, Herbs",
        price: 149,
        category: "Pizza, Pure Veg",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80",
        restaurantId: rCravely._id,
        restaurantName: rCravely.name,
        isTopDish: false,
        discount: 10
      },
      {
        name: "Classic Veg Cheese Burger",
        description: "Crispy vegetable patty topped with melted cheddar cheese slice and garlic mayo.",
        ingredients: "Sesame Bun, Crispy Veg Patty, Cheddar Cheese, Lettuce, Mayo",
        price: 169,
        category: "Burger, Pure Veg",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80",
        restaurantId: rCravely._id,
        restaurantName: rCravely.name,
        isTopDish: false,
        discount: 10
      },
      {
        name: "Steamed Paneer Tikka Momos (8 Pcs)",
        description: "Soft steamed dumplings stuffed with spiced paneer tikka, served with spicy red chili sauce.",
        ingredients: "Paneer Tikka Filling, Flour Wrapper, Red Chili Dip",
        price: 189,
        category: "Rolls, Pure Veg",
        image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=800&auto=format&fit=crop&q=80",
        restaurantId: rCravely._id,
        restaurantName: rCravely.name,
        isTopDish: false,
        discount: 15
      },
      {
        name: "Chili Garlic Egg Fried Rice",
        description: "Wok-tossed basmati rice with scrambled eggs, burnt garlic, spring onions, and soy sauce.",
        ingredients: "Basmati Rice, Farm Eggs, Burnt Garlic, Soy Sauce, Scallions",
        price: 219,
        category: "Rice, Noodles",
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80",
        restaurantId: rCravely._id,
        restaurantName: rCravely.name,
        isTopDish: false,
        discount: 10
      },
      {
        name: "Deluxe Veggie Supreme Pizza (Medium)",
        description: "Hand-crafted pizza loaded with bell peppers, sweet corn, black olives, jalapenos, and mozzarella.",
        ingredients: "Pizza Crust, Tomato Sauce, Bell Peppers, Olives, Jalapenos, Mozzarella",
        price: 249,
        category: "Pizza, Pure Veg",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
        restaurantId: rCravely._id,
        restaurantName: rCravely.name,
        isTopDish: true,
        discount: 15
      },
      {
        name: "Pan-Seared Hakka Noodles & Paneer Combo",
        description: "Spicy Schezwan Hakka noodles served alongside sizzling chili paneer gravy.",
        ingredients: "Hakka Noodles, Schezwan Chili Paste, Paneer Gravy, Capsicum",
        price: 289,
        category: "Noodles, Pure Veg",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
        restaurantId: rCravely._id,
        restaurantName: rCravely.name,
        isTopDish: true,
        discount: 12
      },
      {
        name: "Gourmet Double Chicken Smash Burger",
        description: "Juicy double chicken patties with smoked bacon jam, caramelized onions, and sharp cheddar.",
        ingredients: "Brioche Bun, Double Chicken Patties, Sharp Cheddar, Onion Jam",
        price: 319,
        category: "Burger",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
        restaurantId: rCravely._id,
        restaurantName: rCravely.name,
        isTopDish: true,
        discount: 10
      },
      {
        name: "Classic Hyderabadi Dum Chicken Biryani",
        description: "Authentic dum biryani slow-cooked with saffron basmati rice, mint, and marinated chicken.",
        ingredients: "Long Grain Basmati, Marinated Chicken, Saffron, Ghee, Mint",
        price: 349,
        category: "Biryani, Rice",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
        restaurantId: rCravely._id,
        restaurantName: rCravely.name,
        isTopDish: true,
        discount: 15
      },
      {
        name: "Royal Shahi Paneer & Butter Naan Thali",
        description: "Grand meal platter with Shahi Paneer, Dal Makhani, Jeera Rice, 2 Butter Naans, and Gulab Jamun.",
        ingredients: "Shahi Paneer, Dal Makhani, Jeera Rice, Garlic Naan, Gulab Jamun",
        price: 389,
        category: "Rice, Pure Veg",
        image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80",
        restaurantId: rCravely._id,
        restaurantName: rCravely.name,
        isTopDish: true,
        discount: 10
      },
      {
        name: "Belgian Chocolate Truffle Celebration Cake",
        description: "Decadent multi-layered sponge cake enveloped in rich dark Belgian chocolate ganache.",
        ingredients: "Belgian Chocolate, Cocoa Butter, Heavy Cream, Sponge Base",
        price: 449,
        category: "Cake, Dessert",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80",
        restaurantId: rCravely._id,
        restaurantName: rCravely.name,
        isTopDish: true,
        discount: 20
      },
      {
        name: "Special Royal Mutton Awadhi Dum Biryani",
        description: "Awadhi slow-cooked mutton biryani with Kewra, Rose water, saffron, and pure Desi Ghee.",
        ingredients: "Mutton Cutlets, Basmati Rice, Desi Ghee, Kewra, Awadhi Spices",
        price: 549,
        category: "Biryani, Rice",
        image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80",
        restaurantId: rCravely._id,
        restaurantName: rCravely.name,
        isTopDish: true,
        discount: 15
      },
      {
        name: "Cravely Deluxe Seafood & Grill Feast Platter",
        description: "Ultimate grilled feast with butter garlic prawns, fish tikka, calamari rings, and lemon butter sauce.",
        ingredients: "Tiger Prawns, Fish Tikka, Calamari, Garlic Butter Sauce, Seasoned Rice",
        price: 699,
        category: "Rice",
        image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
        restaurantId: rCravely._id,
        restaurantName: rCravely.name,
        isTopDish: true,
        discount: 20
      },

      // ==========================================
      // 2. Kwality Refreshments
      // ==========================================
      {
        name: "Special Butter Pav Bhaji",
        description: "Piping hot spiced mashed vegetable bhaji drenched in amul butter, served with 2 toasted pavs.",
        ingredients: "Mashed Vegetables, Amul Butter, Spices, Toasted Pavs",
        price: 139,
        category: "Pure Veg",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80",
        restaurantId: rKwality._id,
        restaurantName: rKwality.name,
        isTopDish: true,
        discount: 10
      },

      // ==========================================
      // 3. Mr & Mrs Idly
      // ==========================================
      {
        name: "Kerala Ghee Roast Masala Dosa",
        description: "Crispy golden crepe roasted in pure ghee, filled with spiced potato masala and served with 3 chutneys.",
        ingredients: "Fermented Batter, Pure Ghee, Spiced Potato, Coconut Chutneys",
        price: 129,
        category: "Pure Veg",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
        restaurantId: rMrMrsIdly._id,
        restaurantName: rMrMrsIdly.name,
        isTopDish: true,
        discount: 10
      },

      // ==========================================
      // 4. Gayatri Bhel
      // ==========================================
      {
        name: "Special Oli Bhel Platter",
        description: "Crispy puffed rice mixed with sweet tangy tamarind chutney, spicy garlic chutney, onions, and sev.",
        ingredients: "Puffed Rice, Tamarind Chutney, Sev, Chopped Onions, Coriander",
        price: 79,
        category: "Pure Veg",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
        restaurantId: rGayatri._id,
        restaurantName: rGayatri.name,
        isTopDish: true,
        discount: 10
      },

      // ==========================================
      // 5. Upsouth
      // ==========================================
      {
        name: "Upsouth Special Uttapam Combo",
        description: "Thick onion tomato uttapam served with podi idlis and fresh filter coffee.",
        ingredients: "Rice Batter, Onions, Tomatoes, Gunpowder Spice, Filter Coffee",
        price: 149,
        category: "Pure Veg",
        image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&auto=format&fit=crop&q=80",
        restaurantId: rUpsouth._id,
        restaurantName: rUpsouth.name,
        isTopDish: true,
        discount: 15
      },

      // ==========================================
      // 6. Wok & Roll Chinese
      // ==========================================
      {
        name: "Schezwan Hakka Noodles",
        description: "Wok-tossed stir-fry noodles with crisp vegetables and spicy Schezwan chili paste.",
        ingredients: "Eggless Noodles, Bell Peppers, Cabbage, Schezwan Sauce, Spring Onion",
        price: 219,
        category: "Noodles",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
        restaurantId: rWokRoll._id,
        restaurantName: rWokRoll.name,
        isTopDish: true,
        discount: 50
      },

      // ==========================================
      // 7. Golden Dragon
      // ==========================================
      {
        name: "Thai Green Curry with Jasmine Rice",
        description: "Authentic Coconut milk Thai green curry infused with lemongrass, kaffir lime, and Jasmine rice.",
        ingredients: "Thai Green Curry Paste, Coconut Milk, Jasmine Rice, Bamboo Shoots",
        price: 299,
        category: "Rice, Pure Veg",
        image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80",
        restaurantId: rGoldenDragon._id,
        restaurantName: rGoldenDragon.name,
        isTopDish: true,
        discount: 10
      },

      // ==========================================
      // 8. The Chow Mein Place
      // ==========================================
      {
        name: "Street Style Veg Chow Mein",
        description: "Desi Indo-Chinese stir fried chow mein noodles tossed in dark soy sauce and green chilies.",
        ingredients: "Chow Mein Noodles, Soy Sauce, Green Chili, Cabbage, Vinegar",
        price: 119,
        category: "Noodles, Pure Veg",
        image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&auto=format&fit=crop&q=80",
        restaurantId: rChowMein._id,
        restaurantName: rChowMein.name,
        isTopDish: true,
        discount: 10
      },

      // ==========================================
      // 9. Truffle Pizza Presto
      // ==========================================
      {
        name: "Truffle Mushroom Artisan Pizza",
        description: "Hand-tossed sourdough base with Italian truffle oil, wild mushrooms, and melted mozzarella.",
        ingredients: "Sourdough Base, Truffle Oil, Wild Mushrooms, Mozzarella Cheese",
        price: 499,
        category: "Pizza",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
        restaurantId: rTrufflePizza._id,
        restaurantName: rTrufflePizza.name,
        isTopDish: true,
        discount: 15
      },

      // ==========================================
      // 10. Pasta Palace & Pizza
      // ==========================================
      {
        name: "Creamy Fettuccine Alfredo Pasta",
        description: "Classic Italian fettuccine tossed in rich Parmesan butter cream sauce.",
        ingredients: "Fettuccine Pasta, Aged Parmesan, Heavy Cream, Garlic, Olive Oil",
        price: 349,
        category: "Pasta",
        image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&auto=format&fit=crop&q=80",
        restaurantId: rPastaPalace._id,
        restaurantName: rPastaPalace.name,
        isTopDish: true,
        discount: 15
      },

      // ==========================================
      // 11. Biryani House
      // ==========================================
      {
        name: "Special Mughlai Dum Biryani",
        description: "Slow-cooked basmati rice with tender chicken marinated in royal Mughlai spices.",
        ingredients: "Basmati Rice, Chicken, Mughlai Spices, Saffron, Ghee",
        price: 329,
        category: "Biryani, Rice",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
        restaurantId: rBiryaniHouse._id,
        restaurantName: rBiryaniHouse.name,
        isTopDish: true,
        discount: 10
      },

      // ==========================================
      // 12. Behrouz Biryani
      // ==========================================
      {
        name: "Royal Lazeez Bhuna Murgh Biryani",
        description: "Juicy chicken bhuna slow-cooked in aromatic royal spices and long basmati grains.",
        ingredients: "Chicken Bhuna, Saffron Basmati, Royal Awadhi Spices, Fried Cashews",
        price: 449,
        category: "Biryani, Rice",
        image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80",
        restaurantId: rBehrouz._id,
        restaurantName: rBehrouz.name,
        isTopDish: true,
        discount: 15
      },

      // ==========================================
      // 13. Burger Bistro
      // ==========================================
      {
        name: "Ultimate Double Smash Cheeseburger",
        description: "Double crispy smash patties layered with melted cheddar cheese and special burger sauce.",
        ingredients: "Brioche Bun, Smash Patties, Sharp Cheddar, Pickles, Secret Sauce",
        price: 199,
        category: "Burger",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
        restaurantId: rBurgerBistro._id,
        restaurantName: rBurgerBistro.name,
        isTopDish: true,
        discount: 10
      },

      // ==========================================
      // 14. Sandwich Express
      // ==========================================
      {
        name: "Grilled Cheese Mayo Club Sandwich",
        description: "3-layer toasted sandwich stuffed with spiced paneer, melted cheese slice, and garlic mayo.",
        ingredients: "Toasted Bread, Paneer, Cheese Slice, Garlic Mayo, Butter",
        price: 129,
        category: "Sandwich, Pure Veg",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80",
        restaurantId: rSandwichExp._id,
        restaurantName: rSandwichExp.name,
        isTopDish: true,
        discount: 10
      },

      // ==========================================
      // 15. Dessert Junction
      // ==========================================
      {
        name: "Belgian Chocolate Waffle with Ice Cream",
        description: "Freshly baked waffle drenched in warm Belgian dark chocolate sauce with vanilla ice cream.",
        ingredients: "Waffle Batter, Belgian Chocolate Sauce, Vanilla Ice Cream",
        price: 179,
        category: "Dessert, Cake",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80",
        restaurantId: rDessertJunction._id,
        restaurantName: rDessertJunction.name,
        isTopDish: true,
        discount: 20
      },

      // ==========================================
      // 16. Baskin Robbins
      // ==========================================
      {
        name: "Mississippi Mud Fudge Ice Cream Sundae",
        description: "Decadent dark chocolate ice cream layered with hot fudge sauce and chocolate chips.",
        ingredients: "Dark Chocolate Ice Cream, Hot Fudge Sauce, Chocolate Chips",
        price: 189,
        category: "Dessert, Beverages",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80",
        restaurantId: rBaskinRobbins._id,
        restaurantName: rBaskinRobbins.name,
        isTopDish: true,
        discount: 10
      },

      // ==========================================
      // 17. Anna's South Indian
      // ==========================================
      {
        name: "Crispy Medu Vada Sambar Combo",
        description: "Deep fried crispy lentil donuts served with piping hot sambar and coconut chutney.",
        ingredients: "Urad Dal Batter, Pepper, Curry Leaves, Sambar, Coconut Chutney",
        price: 99,
        category: "Pure Veg",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
        restaurantId: rAnnas._id,
        restaurantName: rAnnas.name,
        isTopDish: true,
        discount: 10
      },

      // ==========================================
      // 18. Gourmet Rolls & Wraps
      // ==========================================
      {
        name: "Fiery Peri Peri Chicken Kathi Roll",
        description: "Flaky paratha roll filled with grilled peri peri chicken, sliced onions, and mint chutney.",
        ingredients: "Flaky Paratha, Peri Peri Chicken, Onions, Mint Chutney",
        price: 159,
        category: "Rolls",
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80",
        restaurantId: rGourmetRolls._id,
        restaurantName: rGourmetRolls.name,
        isTopDish: true,
        discount: 10
      },

      // ==========================================
      // 19. Khichdi Express
      // ==========================================
      {
        name: "Special Moong Dal Desi Ghee Khichdi",
        description: "Comforting moong dal and rice slow cooked in pure Desi Ghee, served with papad and pickle.",
        ingredients: "Moong Dal, Basmati Rice, Pure Desi Ghee, Cumin Tempering, Papad",
        price: 169,
        category: "Rice, Pure Veg",
        image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80",
        restaurantId: rKhichdiExp._id,
        restaurantName: rKhichdiExp.name,
        isTopDish: true,
        discount: 15
      }
    ];

    await FoodModel.insertMany(foodItems);
    console.log(`✅ ${foodItems.length} Food menu items created across all 19 restaurants!`);

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding error:", error);
    process.exit(1);
  }
};

seedData();
