<template>
    <!-- Shows lessons if 'showLesson' is True -->
    <div class="lessons-container">
        <!-- FILTER CONTAINER -->
        <div class="filter-container">
            <!-- SEARCH BAR -->
            <div class="search-container">
                <h1>Search</h1>
                <p>
                    <!-- Search input using v-model -->
                    <input type="text" v-model.trim="searchQuery" placeholder="Search here!">
                </p>
            </div>
            <!-- SORT CONTAINER -->
            <div class="sort-container">
                <h1>Sort</h1>
                <p>
                    <!-- Radio buttons for each sort type using v-model -->
                    <input type="radio" id="subject" value="subject" v-model="sortType">
                    <label for="subject">Subject</label><br>
                    <input type="radio" id="location" value="location" v-model="sortType">
                    <label for="location">Location</label><br>
                    <input type="radio" id="price" value="price" v-model="sortType">
                    <label for="price">Price</label><br>
                    <input type="radio" id="availableInventory" value="availableInventory" v-model="sortType">
                    <label for="availableInventory">Available Inventory</label><br>
                    <input type="radio" id="rating" value="rating" v-model="sortType">
                    <label for="rating">Rating</label><br>
                </p>
                <h1>Order</h1>
                <!-- Radio buttons for sort order using v-model -->
                <input type="radio" id="asc" value="ascending" v-model="sortOrder">
                <label for="asc">Ascending</label><br>
                <input type="radio" id="desc" value="descending" v-model="sortOrder">
                <label for="desc">Descending</label><br><br>
            </div>
        </div>
        <!-- LESSONS CONTAINER -->
        <div class="all-lessons-container">
            <!-- v-for used to display lessons from sortedLessons array -->
            <div class="lesson-box" v-for="lesson in sortedLessons" :key="lesson.id">
                <figure>
                    <!--bind 'src' attr to 'lesson.image' in 'data'-->
                    <img v-bind:src="lesson.image" style="height: 200px; width: 200px;">
                </figure>
                <p>
                    <span id="subject-title">{{ lesson.subject }}</span> <br><br><br>
                    Location: {{ lesson.location }} <br><br>
                    Price: {{ lesson.price }} <br><br>
                    Available Inventory: {{ lesson.availableInventory }} <br><br><br>

                    <!-- Add to Cart Button will be displayed if availableInventory is more than 0 -->
                    <button v-on:click="add(lesson)" v-if="lesson.availableInventory > 0">
                        Add To Cart
                    </button>

                    <!--This button will be displayed otherwise-->
                    <button disabled="disabled" v-else style="opacity: 0.5;">
                        Add To Cart
                    </button>
                    <!-- Message is displayed is availableInventory is 0 -->
                    <span v-if="lesson.availableInventory === 0">All out!</span>
                    <span v-else-if="lesson.availableInventory < 5">Only
                        {{ lesson.availableInventory }} left!</span>
                    <span v-else>Buy now!</span> <br>
                    <!-- Rating styles -->
                    <span v-for="n in lesson.rating" :key="n">★</span>
                    <span v-for="n in 5 - lesson.rating" :key="n">☆</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
// compare Subject in Ascending Order
function compareSubjectAscending(a, b) {
  let sub1 = a.subject.toLowerCase();
  let sub2 = b.subject.toLowerCase();
  if (sub1 > sub2) {
    return 1;
  } else if (sub1 < sub2) {
    return -1;
  } else {
    return 0;
  }
}
// compare Subject in Descending Order
function compareSubjectDescending(a, b) {
  let sub1 = a.subject.toLowerCase();
  let sub2 = b.subject.toLowerCase();
  if (sub1 < sub2) {
    return 1;
  } else if (sub1 > sub2) {
    return -1;
  } else {
    return 0;
  }
}
// compare Location in Ascending Order
function compareLocationAscending(a, b) {
  let loc1 = a.location.toLowerCase();
  let loc2 = b.location.toLowerCase();
  if (loc1 > loc2) {
    return 1;
  } else if (loc1 < loc2) {
    return -1;
  } else {
    return 0;
  }
}
// compare Location in Descending Order
function compareLocationDescending(a, b) {
  let loc1 = a.location.toLowerCase();
  let loc2 = b.location.toLowerCase();
  if (loc1 < loc2) {
    return 1;
  } else if (loc1 > loc2) {
    return -1;
  } else {
    return 0;
  }
}
// compare Price in Ascending Order
function comparePriceAscending(a, b) {
  if (a.price > b.price) {
    return 1;
  } else if (a.price < b.price) {
    return -1;
  } else {
    return 0;
  }
}
// compare Price in Descending Order
function comparePriceDescending(a, b) {
  if (a.price < b.price) {
    return 1;
  } else if (a.price > b.price) {
    return -1;
  } else {
    return 0;
  }
}
// compare Rating in Ascending Order
function compareRatingAscending(a, b) {
  if (a.rating > b.rating) {
    return 1;
  } else if (a.rating < b.rating) {
    return -1;
  } else {
    return 0;
  }
}
// compare Rating in Descending Order
function compareRatingDescending(a, b) {
  if (a.rating < b.rating) {
    return 1;
  } else if (a.rating > b.rating) {
    return -1;
  } else {
    return 0;
  }
}
// compare Avaiable Inventory in Ascending Order
function compareAvailableInventoryAscending(a, b) {
  if (a.availableInventory > b.availableInventory) {
    return 1;
  } else if (a.availableInventory < b.availableInventory) {
    return -1;
  } else {
    return 0;
  }
}
// compare Available Inventory in Descending Order
function compareAvailableInventoryDescending(a, b) {
  if (a.availableInventory < b.availableInventory) {
    return 1;
  } else if (a.availableInventory > b.availableInventory) {
    return -1;
  } else {
    return 0;
  }
}
export default {
    name: "Lessons-List",
    props: ["lessons"],
    data() {
        return {
            searchQuery: '',
            sortType: '',
            sortOrder: 'ascending', //to default sorting order to ascending
        }
    },
    methods: {
        add(lesson) {
            console.log("added lesson", lesson.subject);
            this.$emit('addLesson', lesson);
        },
    },
    computed: {
        //Sorting method
        sortedLessons() {
            let lessonsArray = this.lessons.slice(0);
            let query = this.searchQuery.toLowerCase();

            lessonsArray = lessonsArray.filter(lesson =>
                lesson.subject.toLowerCase().includes(query) || lesson.location.toLowerCase().includes(query)
            );

            // Filter and sort based on sortType and sortOrder

            //Sort Subject
            if (this.sortType === "subject") {
                if (this.sortOrder === "ascending") {
                    return lessonsArray.sort(compareSubjectAscending);
                } else {
                    return lessonsArray.sort(compareSubjectDescending);
                }
            }
            //Sort Location
            if (this.sortType === "location") {
                if (this.sortOrder === "ascending") {
                    return lessonsArray.sort(compareLocationAscending);
                } else {
                    return lessonsArray.sort(compareLocationDescending);
                }
            }
            //Sort Price
            if (this.sortType === "price") {
                if (this.sortOrder === "ascending") {
                    return lessonsArray.sort(comparePriceAscending);
                } else {
                    return lessonsArray.sort(comparePriceDescending);
                }
            }
            //Sort Rating
            if (this.sortType === "rating") {
                if (this.sortOrder === "ascending") {
                    return lessonsArray.sort(compareRatingAscending);
                } else {
                    return lessonsArray.sort(compareRatingDescending);
                }
            }
            //Sort Inventory
            if (this.sortType === "availableInventory") {
                if (this.sortOrder === "ascending") {
                    return lessonsArray.sort(compareAvailableInventoryAscending);
                } else {
                    return lessonsArray.sort(compareAvailableInventoryDescending);
                }
            }

            return lessonsArray;
        }
    }
}
</script>