// Select the element that displays the month and year text
const currentDate = document.querySelector(".current-date");

// Select the container where all the calendar days (<li>) will be inserted
const daysTag = document.querySelector(".days");

// Select BOTH previous and next icons
// querySelectorAll() → returns ALL matching elements as a NodeList
const prevNextIcon = document.querySelectorAll(".icons span");

// Create a new Date object representing the current date and time
let date = new Date(),

currentYear = date.getFullYear(),

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
let events = {};

// Variable that stores the date user clicks
let selectedFullDate = "";

// Function that creates the entire calendar layout
const renderCalendar = () => {

  // Get the weekday of the first day of the current month

  let firstDayMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Get the last date of the current month
 
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

    liTag += `<li class="inactive">${lastDatePreviousMonth - i + 1}</li>`;
  }


  // Create list items for the current month days
  for (let i = 1; i <= lastDateMonth; i++) {

    // Build full date string

    let fullDate = `${i}-${months[currentMonth]}-${currentYear}`;

    // Check if the current loop day is today's date using ternary operator
    let isToday =
      i === date.getDate() &&               
      currentMonth === new Date().getMonth() && 
      currentYear === new Date().getFullYear()  
        ? "active" 
        : "";      

    // Check if the day has an event
    
    let hasEvent =
      events[fullDate] && events[fullDate].length > 0
        ? `<span class="event-dot"></span>`
        : "";

    liTag += `<li class="${isToday}">${i}${hasEvent}</li>`;
  }


  // Fill remaining days with next month dates
  for (let i = lastDayMonth; i < 6; i++) {

    liTag += `<li class="inactive">${i - lastDayMonth + 1}</li>`;
  }

  currentDate.innerText = `${months[currentMonth]} ${currentYear}`;

  daysTag.innerHTML = liTag;
};


// Run the function immediately when page loads
renderCalendar();


// Loop through both previous and next icons
prevNextIcon.forEach((icon) => {

  icon.addEventListener("click", () => {

    currentMonth = icon.id === "prev" ? currentMonth - 1 : currentMonth + 1;


  
    if (currentMonth < 0) {

      currentMonth = 11;

      currentYear--;
    }

    if (currentMonth > 11) {

      currentMonth = 0;

      currentYear++;
    }

    renderCalendar();
  });
});
// Listen for clicks on the days container
daysTag.addEventListener("click", (e) => {

  if (!e.target.classList.contains("inactive")) {

    let selectedDate = e.target.innerText;

    let selectedMonth = months[currentMonth];

    let selectedYear = currentYear;

    selectedFullDate = `${selectedDate}-${selectedMonth}-${selectedYear}`;

    document.getElementById("selectedDateText").innerText = selectedFullDate;

    document.getElementById("pop-up-event").style.display = "flex";

    loadEvents();
  }
});


// Function to close popup window
function closepopupevent() {

  document.getElementById("pop-up-event").style.display = "none";
}


// Function to add event
function addEvent() {

  let input = document.getElementById("eventInput");

  let eventText = input.value.trim();

  if (eventText === "") return;

  if (!events[selectedFullDate]) {

    events[selectedFullDate] = [];
  }

  events[selectedFullDate].push(eventText);

  input.value = "";

  loadEvents();

  renderCalendar();
}

// Function that loads events into popup list
function loadEvents() {

  let eventList = document.getElementById("eventList");

  eventList.innerHTML = "";

  if (!events[selectedFullDate]) return;


  events[selectedFullDate].forEach((eventText, index) => {

    let div = document.createElement("div");

    div.classList.add("event-item");

    let textSpan = document.createElement("span");

    textSpan.innerText = eventText;

    let deleteBtn = document.createElement("button");

    deleteBtn.innerHTML =
      "<span class='material-symbols-outlined'>delete</span>";

    deleteBtn.classList.add("delete-btn");


    deleteBtn.addEventListener("click", function () {

      events[selectedFullDate].splice(index, 1);

      if (events[selectedFullDate].length === 0) {

        delete events[selectedFullDate];
      }

      loadEvents();

      renderCalendar();
    });

    div.appendChild(textSpan);

    div.appendChild(deleteBtn);

    eventList.appendChild(div);
  });
}


// Close popup if user clicks outside it
window.addEventListener("click", (e) => {

  let popup = document.getElementById("pop-up-event");

  if (e.target === popup) {

    popup.style.display = "none";
  }
});