document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const orderDate = document.getElementById('orderDate');
  const classSelect = document.getElementById('classSelect');
  const childSelect = document.getElementById('childSelect');
  const datePrompt = document.querySelector('.date-prompt');
  const menuContent = document.querySelector('.menu-content');
  const menuHeader = document.getElementById('menuHeader');
  const mainMeals = document.getElementById('mainMeals');
  const extras = document.getElementById('extras');
  const summaryDate = document.getElementById('summaryDate');
  const summaryClass = document.getElementById('summaryClass');
  const summaryChild = document.getElementById('summaryChild');
  const cartContents = document.getElementById('cartContents');
  const emptyCart = document.getElementById('emptyCart');
  const totalAmount = document.getElementById('totalAmount');
  const subtotalAmount = document.getElementById('subtotalAmount');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  // Navigation elements
  const navMenu = document.getElementById('navMenu');
  const menuBtn = document.getElementById('menuBtn');
  const closeNav = document.getElementById('closeNav');
  const feedbackForm = document.getElementById('feedbackForm');

  // Application State
  let cart = [];
  let selectedDate = '';
  let selectedClass = '';
  let selectedChild = '';

  // Weekly Meal Plan (same for every week)
  const weeklyMealPlan = {
    1: { // Monday
      mainMeals: [
        { 
          id: 'mon-kenkey',
          name: "Kenkey with Fish", 
          price: 18.00, 
          description: "Traditional fermented corn dough with grilled fish and hot pepper",
          image: "kenkey.jpg"
        }
      ],
      extras: [
        { 
          id: 'e1',
          name: "Fried Plantains", 
          price: 8.00, 
          description: "Sweet ripe plantains fried to perfection",
          image: "plantains.jpg"
        }
      ]
    },
    2: { // Tuesday
      mainMeals: [
        { 
          id: 'tue-jollof',
          name: "Jollof Rice With Boiled Eggs", 
          price: 16.00, 
          description: "Famous Ghanaian jollof rice with perfectly seasoned boiled eggs",
          image: "jollof-rice.jpg"
        }
      ],
      extras: [
        { 
          id: 'e2',
          name: "Fruit Juice", 
          price: 3.50, 
          description: "Freshly squeezed fruit juice (orange, pineapple or mango)",
          image: "juice.jpg"
        }
      ]
    },
    3: { // Wednesday
      mainMeals: [
        { 
          id: 'wed-waakye',
          name: "Waakye", 
          price: 14.00, 
          description: "Rice and beans with spaghetti, boiled eggs and stew",
          image: "waakye.jpg"
        }
      ],
      extras: [
        { 
          id: 'e3',
          name: "Bottled Water (500ml)", 
          price: 2.00, 
          description: "Voltic bottled water 500ml",
          image: "water.jpg"
        }
      ]
    },
    4: { // Thursday
      mainMeals: [
        { 
          id: 'thu-friedrice',
          name: "Fried Rice with Chicken", 
          price: 18.00, 
          description: "Flavorful fried rice with pieces of chicken",
          image: "fried-rice.jpg"
        }
      ],
      extras: [
        { 
          id: 'e4',
          name: "Salad", 
          price: 5.00, 
          description: "Fresh garden salad with dressing",
          image: "salad.jpg"
        }
      ]
    },
    5: { // Friday
      mainMeals: [
        { 
          id: 'fri-banku',
          name: "Banku with Tilapia", 
          price: 15.00, 
          description: "Traditional banku served with grilled tilapia and hot pepper",
          image: "banku.jpg"
        }
      ],
      extras: [
        { 
          id: 'e5',
          name: "Apple", 
          price: 3.00, 
          description: "Fresh apple fruit",
          image: "apple.jpg"
        },
        { 
          id: 'e6',
          name: "Mango", 
          price: 4.00, 
          description: "Fresh mango fruit",
          image: "mango.jpg"
        }
      ]
    }
  };

  // Common extras available every day
  const commonExtras = [
    { 
      id: 'e7',
      name: "Voltic Water (500ml)", 
      price: 2.00, 
      description: "500ml bottled water",
      image: "water.jpg"
    },
    { 
      id: 'e8',
      name: "Apple", 
      price: 3.00, 
      description: "Fresh apple fruit",
      image: "apple.jpg"
    },
    { 
      id: 'e9',
      name: "Mango", 
      price: 4.00, 
      description: "Fresh mango fruit",
      image: "mango.jpg"
    }
  ];

  const classChildren = {
    "Class 1A": ["Akua Gyasi", "Kwame Mensah", "Ama Boateng"],
    "Class 1B": ["Kofi Ananse", "Esi Owusu", "Yaw Asante"],
    "Class 2A": ["Adwoa Safo", "Yaa Asantewaa", "Kwabena Darko"],
    "Class 2B": ["Nana Ama", "Kojo Prempeh", "Abena Serwaa"]
  };

  // Initialize the application
  function init() {
    setMinDate();
    populateClassSelect();
    setupEventListeners();
    updateCartDisplay();
    updateCheckoutButton();
    setupDatePlaceholder();
  }

  function setupDatePlaceholder() {
    orderDate.addEventListener('focus', function() {
      if (!this.value) {
        this.setAttribute('placeholder', 'Choose order date');
      }
    });
    
    orderDate.addEventListener('change', function() {
      this.removeAttribute('placeholder');
    });
  }

  function setMinDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    orderDate.min = tomorrow.toISOString().split('T')[0];
    orderDate.setAttribute('placeholder', 'Choose order date');
  }

  function populateClassSelect() {
    classSelect.innerHTML = '<option value="" disabled selected>Select class</option>';
    Object.keys(classChildren).forEach(className => {
      const option = document.createElement('option');
      option.value = className;
      option.textContent = className;
      classSelect.appendChild(option);
    });
  }

  function populateChildSelect(className) {
    childSelect.innerHTML = '<option value="" disabled selected>Select child</option>';
    if (className && classChildren[className]) {
      childSelect.disabled = false;
      classChildren[className].forEach(childName => {
        const option = document.createElement('option');
        option.value = childName;
        option.textContent = childName;
        childSelect.appendChild(option);
      });
    } else {
      childSelect.disabled = true;
    }
  }

  function setupEventListeners() {
    orderDate.addEventListener('change', handleDateChange);
    classSelect.addEventListener('change', handleClassChange);
    childSelect.addEventListener('change', handleChildChange);
    checkoutBtn.addEventListener('click', handleCheckout);
    
    // Navigation menu events
    menuBtn.addEventListener('click', function() {
      navMenu.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
    
    closeNav.addEventListener('click', function() {
      navMenu.classList.remove('show');
      document.body.style.overflow = '';
    });
    
    // Feedback form submission
    feedbackForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('feedbackName').value;
      const email = document.getElementById('feedbackEmail').value;
      const message = document.getElementById('feedbackMessage').value;
      
      console.log('Feedback submitted:', { name, email, message });
      alert(`Thank you for your feedback, ${name}! We will contact you soon.`);
      
      this.reset();
      navMenu.classList.remove('show');
      document.body.style.overflow = '';
    });

    // Call button functionality
    document.querySelector('.call-btn').addEventListener('click', function(e) {
      e.preventDefault();
      const phoneNumber = '+233123456789'; // Replace with your school's number
      window.location.href = `tel:${phoneNumber}`;
    });
  }

  function handleDateChange() {
    selectedDate = orderDate.value;
    
    if (selectedDate) {
      const date = new Date(selectedDate);
      const dayOfWeek = date.getDay();
      
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-US', options);
      
      datePrompt.style.display = 'none';
      menuContent.style.display = 'block';
      menuHeader.textContent = `Menu for ${formattedDate}`;
      summaryDate.textContent = formattedDate;
      
      const dailyMeals = weeklyMealPlan[dayOfWeek] || { mainMeals: [] };
      const dailyExtras = dailyMeals.extras || [];
      const allExtras = [...dailyExtras, ...commonExtras];
      
      const uniqueExtras = allExtras.filter((extra, index, self) =>
        index === self.findIndex((e) => e.id === extra.id)
      );
      
      renderMenu({
        mainMeals: dailyMeals.mainMeals || [],
        extras: uniqueExtras
      });
    } else {
      datePrompt.style.display = 'block';
      menuContent.style.display = 'none';
      summaryDate.textContent = 'Not selected';
    }
    
    updateCheckoutButton();
  }

  function handleClassChange() {
    selectedClass = classSelect.value;
    summaryClass.textContent = selectedClass || 'Not selected';
    populateChildSelect(selectedClass);
    updateCheckoutButton();
  }

  function handleChildChange() {
    selectedChild = childSelect.value;
    summaryChild.textContent = selectedChild || 'Not selected';
    updateCheckoutButton();
  }

  function renderMenu(menuData) {
    mainMeals.innerHTML = '';
    extras.innerHTML = '';

    if (menuData.mainMeals?.length) {
      menuData.mainMeals.forEach(meal => {
        mainMeals.appendChild(createMealCard(meal));
      });
    } else {
      mainMeals.innerHTML = '<p class="no-items">No main meals available for this day</p>';
    }

    if (menuData.extras?.length) {
      menuData.extras.forEach(extra => {
        extras.appendChild(createMealCard(extra));
      });
    } else {
      extras.innerHTML = '<p class="no-items">No extras available for this day</p>';
    }
  }

  function createMealCard(item) {
    const card = document.createElement('div');
    card.className = 'meal-card';
    
    const mealImage = document.createElement('div');
    mealImage.className = 'meal-image';
    mealImage.style.backgroundImage = `url(images/${item.image || 'meal-default.jpg'})`;
    
    const mealInfo = document.createElement('div');
    mealInfo.className = 'meal-info';
    
    const name = document.createElement('h4');
    name.textContent = item.name;
    
    const description = document.createElement('p');
    description.className = 'meal-description';
    description.textContent = item.description;
    
    const price = document.createElement('p');
    price.className = 'meal-price';
    price.textContent = `GHC${item.price.toFixed(2)}`;
    
    mealInfo.appendChild(name);
    mealInfo.appendChild(description);
    mealInfo.appendChild(price);
    
    const addButton = document.createElement('button');
    addButton.className = 'add-to-cart';
    addButton.innerHTML = '<i class="fas fa-plus"></i> Add';
    addButton.addEventListener('click', () => addToCart(item));
    
    card.appendChild(mealImage);
    card.appendChild(mealInfo);
    card.appendChild(addButton);
    
    return card;
  }

  function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({...item, quantity: 1});
    }
    
    updateCartDisplay();
    updateCheckoutButton();
  }

  function updateCartDisplay() {
    if (cart.length === 0) {
      emptyCart.style.display = 'flex';
      cartContents.innerHTML = '';
    } else {
      emptyCart.style.display = 'none';
      cartContents.innerHTML = '';
      
      cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        const itemImage = document.createElement('div');
        itemImage.className = 'item-image';
        itemImage.style.backgroundImage = `url(images/${item.image || 'meal-default.jpg'})`;
        
        const itemInfo = document.createElement('div');
        itemInfo.className = 'item-info';
        itemInfo.innerHTML = `
          <span class="item-name">${item.name}</span>
          <span class="item-price">GHC${(item.price * item.quantity).toFixed(2)}</span>
        `;
        
        const itemControls = document.createElement('div');
        itemControls.className = 'item-controls';
        itemControls.innerHTML = `
          <button class="quantity-btn"><i class="fas fa-minus"></i></button>
          <span class="item-quantity">${item.quantity}</span>
          <button class="quantity-btn"><i class="fas fa-plus"></i></button>
        `;
        
        itemControls.querySelector('.fa-minus').parentNode.addEventListener('click', () => updateQuantity(item.id, -1));
        itemControls.querySelector('.fa-plus').parentNode.addEventListener('click', () => updateQuantity(item.id, 1));
        
        cartItem.appendChild(itemImage);
        cartItem.appendChild(itemInfo);
        cartItem.appendChild(itemControls);
        
        cartContents.appendChild(cartItem);
      });
    }
    
    updateOrderSummary();
  }

  function updateQuantity(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
      cart[itemIndex].quantity += change;
      
      if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
      }
      
      updateCartDisplay();
      updateCheckoutButton();
    }
  }

  function updateOrderSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    subtotalAmount.textContent = `GHC${subtotal.toFixed(2)}`;
    totalAmount.textContent = `GHC${subtotal.toFixed(2)}`;
    
    const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
    document.querySelector('.cart-items h3').textContent = `Items (${itemCount})`;
  }

  function updateCheckoutButton() {
    checkoutBtn.disabled = !(selectedDate && selectedClass && selectedChild && cart.length > 0);
  }

  function handleCheckout() {
    if (!selectedDate || !selectedClass || !selectedChild || cart.length === 0) return;
    
    const order = {
      date: selectedDate,
      class: selectedClass,
      child: selectedChild,
      items: cart,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    console.log('Order submitted:', order);
    alert(`Order placed successfully for ${selectedChild}!\nTotal: GHC${order.total.toFixed(2)}`);
    
    cart = [];
    updateCartDisplay();
    updateCheckoutButton();
  }

  // Start the application
  init();
});