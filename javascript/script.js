// Select the element that displays the month and year text
// document → represents the whole HTML page
// querySelector() → finds the FIRST element that matches the CSS selector
// ".current-date" → class selector
const currentDate = document.querySelector(".current-date");

// Select the container where all the calendar days (<li>) will be inserted
const daysTag = document.querySelector(".days");

// Select BOTH previous and next icons
// querySelectorAll() → returns ALL matching elements as a NodeList
// ".icons span" → selects span elements inside .icons container
const prevNextIcon = document.querySelectorAll(".icons span");

// Create a new Date object representing the current date and time
let date = new Date(),
  // getFullYear() → returns the current year (example: 2026)
  currentYear = date.getFullYear(),
  // getMonth() → returns month index (0 = January, 11 = December)
  currentMonth = date.getMonth();

// Array containing month names
// We use this so we can display the month name instead of number
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Object used to store events
// Example structure:
// events = {
//   "15-March-2026": ["Meeting", "Gym"]
// }
let events = {};

// Variable that stores the date user clicks
// Example: "15-March-2026"
let selectedFullDate = "";
// Function that creates the entire calendar layout
const renderCalendar = () => {

  // Get the weekday of the first day of the current month
  // Example: if the month starts on Wednesday → result = 3
  let firstDayMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Get the last date of the current month
  // Trick: day = 0 of next month gives the last day of current month
  let lastDateMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Get the weekday of the last date of the month
  let lastDayMonth = new Date(
    currentYear,
    currentMonth,
    lastDateMonth,
  ).getDay();

  // Get the last date of the previous month
  let lastDatePreviousMonth = new Date(currentYear, currentMonth, 0).getDate();

  // This string will store all <li> elements for calendar days
  let liTag = "";


  // Create inactive days from the previous month
  for (let i = firstDayMonth; i > 0; i--) {

    // Add list item for previous month days
    // class="inactive" → used to style them differently
    liTag += `<li class="inactive">${lastDatePreviousMonth - i + 1}</li>`;
  }


  // Create list items for the current month days
  for (let i = 1; i <= lastDateMonth; i++) {

    // Build full date string
    // Example: "15-March-2026"
    let fullDate = `${i}-${months[currentMonth]}-${currentYear}`;

    // Check if the current loop day is today's date
    let isToday =
      i === date.getDate() &&               // day matches today
      currentMonth === new Date().getMonth() && // month matches today
      currentYear === new Date().getFullYear()  // year matches today
        ? "active" // if true → add active class
        : "";      // if false → empty class

    // Check if the day has an event
    // events[fullDate] → check if the date exists in events object
    let hasEvent =
      events[fullDate] && events[fullDate].length > 0
        ? `<span class="event-dot"></span>` // add a small dot indicator
        : "";

    // Create the day list item
    liTag += `<li class="${isToday}">${i}${hasEvent}</li>`;
  }


  // Fill remaining days with next month dates
  for (let i = lastDayMonth; i < 6; i++) {

    // Add next month days as inactive
    liTag += `<li class="inactive">${i - lastDayMonth + 1}</li>`;
  }

  // Display the current month and year
  currentDate.innerText = `${months[currentMonth]} ${currentYear}`;

  // Insert all generated <li> elements into the calendar
  daysTag.innerHTML = liTag;
};


// Run the function immediately when page loads
renderCalendar();
// Loop through both icons (prev and next buttons)
prevNextIcon.forEach((icon) => {

  // Add click event listener to each icon
  icon.addEventListener("click", () => {

    // Check if clicked icon is "prev"
    // If true → decrease month
    // If false → increase month
    currentMonth = icon.id === "prev" ? currentMonth - 1 : currentMonth + 1;


    // If month becomes less than 0
    if (currentMonth < 0) {

      // Set month to December
      currentMonth = 11;

      // Move to previous year
      currentYear--;
    }

    // If month becomes greater than 11
    if (currentMonth > 11) {

      // Set month to January
      currentMonth = 0;

      // Move to next year
      currentYear++;
    }

    // Re-render the calendar with new month
    renderCalendar();
  });
});
// Listen for clicks on the days container
daysTag.addEventListener("click", (e) => {

  // Ignore inactive days (previous/next month)
  if (!e.target.classList.contains("inactive")) {

    // Get clicked date number
    let selectedDate = e.target.innerText;

    // Get current month name
    let selectedMonth = months[currentMonth];

    // Get current year
    let selectedYear = currentYear;

    // Create full date string
    selectedFullDate = `${selectedDate}-${selectedMonth}-${selectedYear}`;

    // Display selected date in popup
    document.getElementById("selectedDateText").innerText = selectedFullDate;

    // Show popup event window
    document.getElementById("pop-up-event").style.display = "flex";

    // Load existing events for this date
    loadEvents();
  }
});


// Function to close popup window
function closepopupevent() {

  // Hide popup
  document.getElementById("pop-up-event").style.display = "none";
}


// Function to add event
function addEvent() {

  // Get input element
  let input = document.getElementById("eventInput");

  // Get text and remove extra spaces
  let eventText = input.value.trim();

  // Prevent empty event
  if (eventText === "") return;

  // If this date doesn't exist in events object
  if (!events[selectedFullDate]) {

    // Create new array for this date
    events[selectedFullDate] = [];
  }

  // Add event text into the array
  events[selectedFullDate].push(eventText);

  // Clear input box
  input.value = "";

  // Reload events
  loadEvents();

  // Update calendar event dot
  renderCalendar();
}

// Function that loads events into popup list
function loadEvents() {

  // Select event list container
  let eventList = document.getElementById("eventList");

  // Clear previous events
  eventList.innerHTML = "";

  // If no events exist for this date → stop
  if (!events[selectedFullDate]) return;


  // Loop through events for this date
  events[selectedFullDate].forEach((eventText, index) => {

    // Create event container
    let div = document.createElement("div");

    // Add CSS class
    div.classList.add("event-item");

    // Create span to display text
    let textSpan = document.createElement("span");

    // Set event text
    textSpan.innerText = eventText;

    // Create delete button
    let deleteBtn = document.createElement("button");

    // Add delete icon HTML
    deleteBtn.innerHTML =
      "<span class='material-symbols-outlined'>delete</span>";

    // Add CSS class
    deleteBtn.classList.add("delete-btn");


    // Add click event to delete button
    deleteBtn.addEventListener("click", function () {

      // Remove event from array
      events[selectedFullDate].splice(index, 1);

      // If no events left → remove the date key
      if (events[selectedFullDate].length === 0) {

        delete events[selectedFullDate];
      }

      // Reload events list
      loadEvents();

      // Update calendar dot
      renderCalendar();
    });

    // Add text to event container
    div.appendChild(textSpan);

    // Add delete button
    div.appendChild(deleteBtn);

    // Add event to list
    eventList.appendChild(div);
  });
}


// Close popup if user clicks outside it
window.addEventListener("click", (e) => {

  // Get popup element
  let popup = document.getElementById("pop-up-event");

  // If clicked element is popup background
  if (e.target === popup) {

    // Hide popup
    popup.style.display = "none";
  }
});