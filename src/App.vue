<template>
  <div id="app">
    <main>
      <!-- NAVIGATION BAR -->
      <div class="navbar">
        <h1>After School Activities</h1>
        <!-- Shows checkout button only if cart array contains items -->
        <button v-on:click='showCheckout' v-if="cartItemCount > 0">
          <!--Displays number of elements in cart array-->
          {{ cartItemCount }}
          <span class="fas fa-cart-plus"></span>Checkout
        </button>
        <!-- Shows disabled button when cart array is empty -->
        <button disabled="disabled" v-else style="opacity: 0.7;">
          <!--Displays number of elements in cart array-->
          {{ cartItemCount }}
          <span class="fas fa-cart-plus"></span>Checkout
        </button>
      </div>
      <lessons-list :lessons="lessons" @addLesson="addToCart" v-if="showLesson"></lessons-list>
      <checkout-page :cart="cart" @remove-lesson="removeFromCart" v-else></checkout-page>
    </main>
  </div>
</template>

<script>
import lessonsList from './components/Lessons.vue'
import checkoutPage from './components/Checkout.vue'

export default {
  components: {
    lessonsList, checkoutPage
  },
  name: "App",
  data() {
    return {
      showLesson: true,
      cart: [],
      lessons: [],
      sortType: '',
      sortOrder: 'ascending', //to default sorting order to ascending
      searchQuery: '',
    }
  },
  methods: {
    showCheckout() {
      this.showLesson = this.showLesson ? false : true;
      console.log(this.showLesson);
    },
    addToCart: function (lesson) {
      console.log("addLesson event received by the root component.");
      let lessonFound = false;
      //Iterate through cart items
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === lesson.id) {
          // If the product is already in the cart, increment the quantity
          this.cart[i].quantity += 1;
          lessonFound = true;
          break;
        }
      }

      // If the product is not in the cart, add it with quantity 1
      if (!lessonFound) {
        this.cart.push({ "id": lesson.id, "image": lesson.image, "subject": lesson.subject, "location": lesson.location, quantity: 1, "price": lesson.price });
      }

      // Log each element of the cart individually
      this.cart.forEach(item => {
        //To Reduce availableInventory when item added to cart
        if (item.id === lesson.id) {
          if (lesson.availableInventory > 0) {
            lesson.availableInventory = 5;
            lesson.availableInventory -= item.quantity;
          }
        }
      });
      console.log("Cart: ", this.cart)
    },
    removeFromCart(lesson) {
      console.log("remove-lesson event received by the root component.");

      let foundIndex = this.cart.findIndex(item => item.id === lesson.id); // Find index of cart element

      if (foundIndex !== -1) { // If cart element is found (not -1)
        this.cart.splice(foundIndex, 1); // Remove item from cart array

        // Find the lesson corresponding to the removed item and update its availableInventory
        let originalLesson = this.lessons.find(item => item.id === lesson.id);
        if (originalLesson) {
          originalLesson.availableInventory += lesson.quantity; // Add back the quantity to availableInventory
        }
      }
    },

  },
  created:
    //fetch GET to retrieve lessons from lessons collection and display all lessons
    function () {
      // set the url to your server and route
      fetch('http://localhost:3000/collection/lessons', {
        method: 'GET', // set the HTTP method as 'GET'
        headers: {
          'Content-Type': 'application/json', // set the data type as JSON
        }
      })
        .then(res => {
          return res.json();
        })
        .then(data => {
          this.lessons = data;
        })
    },
  computed: {
    cartItemCount: function () {  //the property name
      //its value when calculated
      return this.cart.length || '';
    },
  },
};
</script>