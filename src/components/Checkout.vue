<template>
    <div class="checkout-container">
        <!-- CHECKOUT CONTAINER -->
        <!-- CART DETAILS -->
        <div class="cart-container">
            <!-- Cart items displayed from cart array using v-for -->
            <div class="cart-items" v-for="item in cart" :key="item.id">
                <!-- Directly access lesson corresponding to the cart item -->
                <div class="lesson-box">
                    <figure>
                        <!--bind 'src' attr to 'item.image' from cart item-->
                        <img v-bind:src="item.image" style="height: 200px; width: 200px;">
                    </figure>
                    <p>
                        <span id="subject-title">{{ item.subject }}</span> <br><br><br>
                        Location: {{ item.location }} <br><br>
                        Quantity: {{ item.quantity }} <br><br>
                        Price: {{ item.price * item.quantity }} <br><br><br>

                        <!-- Remove from Cart Button will be displayed if availableInventory is more than 0 -->
                        <button v-on:click="removeLesson(item)">
                            REMOVE
                        </button>
                    </p>
                </div>
            </div>
        </div>
        <!-- CHECKOUT BOX -->
        <div class="checkout-box">
            <p>
                <span id="subject-title">Checkout Details</span> <br><br>
                <strong>Name:</strong>
                <!--This input field is bound to 'name' in the 'order' object-->
                <input v-model.trim="order.name" placeholder="Enter Name Here" />

                <strong>Contact Number:</strong>
                <!--This input field is bound to 'contactNumber' in the 'order' object-->
                <input v-model.trim="order.contactNumber" placeholder="05X-XXX-XXXX" />

                <!--This button will be displayed only when Name and Contact Number fields are filled-->
                <button v-on:click="submitForm()" v-if="order.name != '' && order.contactNumber != ''">
                    Place Order!
                </button>

                <!--This button will be displayed otherwise-->
                <button disabled="disabled" v-else style="opacity: 0.5;">
                    Place Order!
                </button>&nbsp;&nbsp;<span id="errorMsg" style="color: red;"></span>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: "CheckoutPage",
    props: ["cart"],
    data() {
        return {
            order: {
                name: '',
                contactNumber: '',
                address: '',
            },
        }
    },
    methods: {
        removeLesson(item) {
            // Emit an event to notify the parent component to remove the item
            this.$emit('remove-lesson', item);
        },
        submitForm() {
            let errorMessage = document.getElementById("errorMsg");
            let nameRegex = new RegExp(/^[a-zA-Z ]{2,30}$/); //regular expression for name (alphabets only, 2-30 characters)
            let numberRegex = new RegExp(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/); //regular expression for contact number (length 10)

            if (!nameRegex.test(this.order.name)) { //name validation
                errorMessage.innerHTML = "Please use letters only (2-30 characters)";
                return;
            }

            if (!numberRegex.test(this.order.contactNumber)) { //number validation
                errorMessage.innerHTML = "Please enter a valid phone number";
                return;
            }
            alert('Order Submitted!')
        },
    },
};
</script>
