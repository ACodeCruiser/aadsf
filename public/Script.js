document.addEventListener('DOMContentLoaded', () => {
  // Initialize the order from localStorage
  let order = JSON.parse(localStorage.getItem('order')) || [];

  // 1. Function to update the cart display on the Cart page
  function updateCart() {
    const orderList = document.getElementById('order-list');
    const totalPriceElement = document.getElementById('total-price');
    const clearCartBtn = document.getElementById('clear-cart');

    // Clear the current order list
    orderList.innerHTML = '';

    // If order has items, update the cart
    if (order.length > 0) {
      let totalPrice = 0;
      
      // Add each item to the order list and calculate the total price
      order.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        orderList.appendChild(li);

        totalPrice += item.price;
      });

      // Update total price
      totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
    } else {
      // No items in the cart, show a message
      orderList.innerHTML = '<li>Your cart is empty.</li>';
      totalPriceElement.textContent = 'Total: $0.00';
    }

    // Clear cart functionality
    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', () => {
        localStorage.removeItem('order');
        window.location.reload(); // Reload the page to reflect changes
      });
    }
  }

  // 2. Add event listeners for "Add to Order" buttons
  const addToOrderButtons = document.querySelectorAll('.add-to-order-btn');
  
  addToOrderButtons.forEach(button => {
    button.addEventListener('click', () => {
      const itemName = button.getAttribute('data-name');
      const itemPrice = parseFloat(button.getAttribute('data-price'));

      // Add item to the order array
      order.push({ name: itemName, price: itemPrice });

      // Save the updated order to localStorage
      localStorage.setItem('order', JSON.stringify(order));

      // Show feedback to user
      alert(`${itemName} added to your order!`);

      // Update the cart if the user is on the Cart page
      if (window.location.pathname.includes('Cart.html')) {
        updateCart();
      }
    });
  });

  // 3. Handle the "View Order" button click to redirect to Cart page
  const viewOrderButton = document.getElementById('view-order');
  if (viewOrderButton) {
    viewOrderButton.addEventListener('click', () => {
      // Save the order to localStorage when navigating to Cart
      if (order.length > 0) {
        localStorage.setItem('order', JSON.stringify(order));
      }
      window.location.href = 'Cart.html'; // Redirect to the cart page
    });
  }

  // 4. Update the cart if we're already on the Cart.html page
  if (window.location.pathname.includes('Cart.html')) {
    updateCart();
  }

  // 5. Handle Payment Method Selection
  const paymentForm = document.getElementById('payment-form');
  const creditCardDetails = document.getElementById('credit-card-details');
  const paypalDetails = document.getElementById('paypal-details');
  const submitPaymentButton = document.getElementById('submit-payment');

  // Toggle visibility of payment details based on selected payment method
  paymentForm.addEventListener('change', (e) => {
    const selectedPaymentMethod = e.target.value;
    if (selectedPaymentMethod === 'credit-card') {
      creditCardDetails.style.display = 'block';
      paypalDetails.style.display = 'none';
    } else if (selectedPaymentMethod === 'paypal') {
      creditCardDetails.style.display = 'none';
      paypalDetails.style.display = 'block';
    }
  });

  // Handle payment submission
  submitPaymentButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission

    const selectedPaymentMethod = paymentForm.querySelector('input[name="payment-method"]:checked').value;

    // Handle credit card validation
    if (selectedPaymentMethod === 'credit-card') {
      const cardNumber = document.getElementById('cc-number').value;
      const expiryDate = document.getElementById('cc-expiry').value;
      const cvc = document.getElementById('cc-cvc').value;

      // Simple validation (you can enhance this)
      if (!cardNumber || !expiryDate || !cvc) {
        alert('Please complete your credit card details.');
        return;
      }

      alert('Payment successfully processed via Credit Card!');
    }

    // Handle PayPal validation
    if (selectedPaymentMethod === 'paypal') {
      const paypalEmail = document.getElementById('paypal-email').value;

      if (!paypalEmail) {
        alert('Please enter your PayPal email.');
        return;
      }

      alert('Payment successfully processed via PayPal!');
    }

    // After successful payment, clear the order
    localStorage.removeItem('order');
    alert('Your order has been completed!');
    window.location.href = 'index2.html'; // Redirect to home or thank you page
  });

  // 6. Toggle the hamburger menu in mobile view
  const hamburger = document.querySelector('.hamburger-lines');
  const menuItems = document.querySelector('.menu-items');
  if (hamburger && menuItems) {
    hamburger.addEventListener('click', () => {
      menuItems.classList.toggle('active');
      hamburger.classList.toggle('open');
    });
  }
});


 

  