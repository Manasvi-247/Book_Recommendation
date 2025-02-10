window.searchBooks = searchBooks
window.addToReadingList = addToReadingList
window.toggleLibrary =toggleLibrary 
window.filterBooksByGenre = filterBooksByGenre
window.closeModal  = closeModal 
const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("search");
const savedBooksList = document.getElementById("saved-books");
// Default books with available covers and descriptions
const defaultBooks = [
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      image: "https://m.media-amazon.com/images/I/81af+MCATTL._AC_UF1000,1000_QL80_.jpg",
      rating: "4.3",
      id: "zyTCAlFPjgYC",
      description: "A novel set in the Roaring Twenties, exploring themes of wealth, love, and the American Dream.",
      categories: ["Classic", "Fiction"]  // Example genres
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      image: "https://m.media-amazon.com/images/I/51+t8ZuYhFL._SX342_SY445_.jpg",
      rating: "4.6",
      id: "e3g5xAEACAAJ",
      description: "A classic tale of manners, marriage, and society in early 19th century England.",
      categories: ["Classic", "Romance"]  // Example genres
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      image: "https://m.media-amazon.com/images/I/91b0C2YNSrL.jpg",
      rating: "4.9",
      id: "jBfJcQAACAAJ",
      description: "A fantasy adventure following Bilbo Baggins as he embarks on a journey to reclaim a treasure guarded by a dragon.",
      categories: ["Fantasy", "Adventure"]  // Example genres
    },
    {
      title: "Harry Potter and the Sorcerer’s Stone",
      author: "J.K. Rowling",
      image: "https://m.media-amazon.com/images/I/81YOuOGFCJL.jpg",
      rating: "4.8",
      id: "3r3c6K0V7FwC",
      description: "The first book in the Harry Potter series, introducing a young wizard’s magical world at Hogwarts.",
      categories: ["Fantasy", "Young Adult"]  // Example genres
    },
    {
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      image: "https://m.media-amazon.com/images/I/714SfixnXZL._SL1500_.jpg",
      rating: "4.2",
      id: "Bn7wDQAAQBAJ",
      description: "A story capturing teenage angst and alienation, narrated by Holden Caulfield.",
      categories: ["Classic", "Literature"]  // Example genres
    },
];

// Utility to create a book element
function createBookElement(book) {
  const bookItem = document.createElement("div");
  bookItem.classList.add("book");

  // When clicking the book (except on the add button), show its details
  bookItem.onclick = (e) => {
    if (!e.target.classList.contains("add-button")) {
      showBookDetails(book.title, book.author, book.image, book.description, book.categories);
    }
  };
  const genres = book.categories.join(", ");
  bookItem.innerHTML = `
    <img src="${book.image}" alt="Book Cover">
    <h3>${book.title}</h3>
    <p>Author: ${book.author}</p>
    <p>Genre: ${genres}</p>  <!-- Displaying genres -->
    <p>Rating: ⭐ ${book.rating}</p>
    <button class="add-button" aria-label="Add ${book.title} to library" onclick="addToReadingList(event, '${book.title}')">Add to Library</button>
  `;
  return bookItem;
}

// Display books (either default or search results)
// function displayBooks(books) {
//   bookList.innerHTML = "";
//   books.forEach((book) => {
//     if (book.image) bookList.appendChild(createBookElement(book));
//   });
// }

// Fetch books from the Google Books API
async function searchBooks() {
  const query = searchInput.value.trim();
  if (query.length === 0) {
    displayBooks(defaultBooks);
    return;
  }

  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch data.");
    const data = await response.json();
    const books = data.items
      .map((book) => ({
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors?.join(", ") || "Unknown",
        image: book.volumeInfo.imageLinks?.thumbnail || "",
        rating: book.volumeInfo.averageRating || "N/A",
        id: book.id,
        description: book.volumeInfo.description || "No description available.",
        categories: book.volumeInfo.categories || ["Uncategorized"]
      }))
      .filter((book) => book.image);

    displayBooks(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    alert("Unable to fetch books. Please try again later.");
  }
}

// Show book details in a modal pop-up using a CSS class
function showBookDetails(title, author, image, description) {
  // Update modal content
  document.getElementById("modal-title").innerText = title;
  document.getElementById("modal-author").innerText = `By: ${author}`;
  document.getElementById("modal-image").src = image;
  document.getElementById("modal-description").innerText = description || "No description available.";
  document.getElementById("modal-reviews").innerText = "";
  
  // Show the modal by adding the "open" class
  const modal = document.getElementById("book-modal");
  modal.classList.add("open");
}

// Close the modal pop-up by removing the CSS class
// function closeModal() {
//   document.getElementById("book-modal").classList.remove("open");
// }

// Save the progress of a specific book
function saveProgress(bookId, progress) {
  const progressData = JSON.parse(localStorage.getItem('progress')) || {};
  progressData[bookId] = progress;
  localStorage.setItem('progress', JSON.stringify(progressData));
}

// Load the progress of a specific book
function loadProgress(bookId) {
  const progressData = JSON.parse(localStorage.getItem('progress')) || {};
  return progressData[bookId] || 0;
}

// Apply the saved progress to the slider
function applyProgress(bookId, sliderElement) {
  const progress = loadProgress(bookId);
  sliderElement.value = progress;
}

// Handle slider input changes
document.querySelectorAll('.progress-slider').forEach((slider) => {
  const bookId = slider.dataset.bookId; // Assuming you store bookId in data attribute
  slider.addEventListener('input', (event) => {
      const progress = event.target.value;
      saveProgress(bookId, progress);
  });
});

// Add book to library (reading list)
function addToReadingList(event, title) {
    event.stopPropagation(); // Prevent opening the modal when clicking the add button
    const li = document.createElement("li");
    li.classList.add("book-item");
    
    const bookTitle = document.createElement("span");
    bookTitle.textContent = title;

    // Create reading progress container
    const progressContainer = document.createElement("div");
    progressContainer.classList.add("progress-container");

    // Create SVG Circle Progress
    const progressSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    progressSVG.setAttribute("width", "50");
    progressSVG.setAttribute("height", "50");
    progressSVG.setAttribute("viewBox", "0 0 100 100");

    const circleBackground = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circleBackground.setAttribute("cx", "50");
    circleBackground.setAttribute("cy", "50");
    circleBackground.setAttribute("r", "40");
    circleBackground.setAttribute("stroke", "#ddd");
    circleBackground.setAttribute("stroke-width", "10");
    circleBackground.setAttribute("fill", "none");

    const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    progressCircle.setAttribute("cx", "50");
    progressCircle.setAttribute("cy", "50");
    progressCircle.setAttribute("r", "40");
    progressCircle.setAttribute("stroke", "#4CAF50");
    progressCircle.setAttribute("stroke-width", "10");
    progressCircle.setAttribute("fill", "none");
    progressCircle.setAttribute("stroke-dasharray", "251.2");
    progressCircle.setAttribute("stroke-dashoffset", "251.2");
    progressCircle.setAttribute("transform", "rotate(-90 50 50)");

    progressSVG.appendChild(circleBackground);
    progressSVG.appendChild(progressCircle);

    // Create slider to update progress
    const progressSlider = document.createElement("input");
    progressSlider.setAttribute("type", "range");
    progressSlider.setAttribute("min", "0");
    progressSlider.setAttribute("max", "100");
    progressSlider.setAttribute("value", "0");
    progressSlider.classList.add("progress-slider");

    // Update circle progress on slider change
    progressSlider.addEventListener("input", function () {
        const progress = progressSlider.value;
        const offset = 251.2 - (progress / 100) * 251.2; // Calculate stroke offset
        progressCircle.setAttribute("stroke-dashoffset", offset);
        saveProgress(title, progress);
    });

    // Load saved progress from localStorage
    const savedProgress = loadProgress(title);
    progressSlider.value = savedProgress;
    progressCircle.setAttribute("stroke-dashoffset", 251.2 - (savedProgress / 100) * 251.2);

    progressContainer.appendChild(progressSVG);
    progressContainer.appendChild(progressSlider);

    li.appendChild(bookTitle);
    li.appendChild(progressContainer);

    // Create a remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.classList.add("remove-btn");
    removeBtn.setAttribute("aria-label", `Remove ${title} from library`);

    removeBtn.onclick = function () {
        li.remove();
        updateLibraryInLocalStorage();
        removeProgress(title); // Remove progress from storage
        showPopup(`${title} removed from library!`);
    };

    li.appendChild(removeBtn);
    savedBooksList.appendChild(li);
    updateLibraryInLocalStorage();

    showPopup(`${title} added to library!`);
}

// Function to show the pop-up message
function showPopup(message) {
    const popup = document.getElementById("popup-message");
    popup.textContent = message; // Set custom message
    popup.classList.add("show");

    // Hide the pop-up after 2 seconds
    setTimeout(() => {
      popup.classList.remove("show");
    }, 2000);
}
  
document.getElementById("close-library").addEventListener("click", function () {
    document.getElementById("library-panel").classList.remove("active");
});

function updateLibraryInLocalStorage() {
    const booksInLibrary = [];
    savedBooksList.querySelectorAll("li").forEach((li) => {
      booksInLibrary.push(li.textContent.replace("❌", "").trim());
    });
    localStorage.setItem("savedBooks", JSON.stringify(booksInLibrary));
}

function loadLibraryFromLocalStorage() {
  const savedBooks = JSON.parse(localStorage.getItem("savedBooks")) || [];
  savedBooks.forEach((title) => {
      const li = document.createElement("li");
      li.classList.add("book-item");
      
      const bookTitle = document.createElement("span");
      bookTitle.textContent = title;

      // Create reading progress container
      const progressContainer = document.createElement("div");
      progressContainer.classList.add("progress-container");

      // Create SVG Circle Progress
      const progressSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      progressSVG.setAttribute("width", "50");
      progressSVG.setAttribute("height", "50");
      progressSVG.setAttribute("viewBox", "0 0 100 100");

      const circleBackground = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circleBackground.setAttribute("cx", "50");
      circleBackground.setAttribute("cy", "50");
      circleBackground.setAttribute("r", "40");
      circleBackground.setAttribute("stroke", "#ddd");
      circleBackground.setAttribute("stroke-width", "10");
      circleBackground.setAttribute("fill", "none");

      const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      progressCircle.setAttribute("cx", "50");
      progressCircle.setAttribute("cy", "50");
      progressCircle.setAttribute("r", "40");
      progressCircle.setAttribute("stroke", "#4CAF50");
      progressCircle.setAttribute("stroke-width", "10");
      progressCircle.setAttribute("fill", "none");
      progressCircle.setAttribute("stroke-dasharray", "251.2");
      progressCircle.setAttribute("stroke-dashoffset", "251.2");
      progressCircle.setAttribute("transform", "rotate(-90 50 50)");

      progressSVG.appendChild(circleBackground);
      progressSVG.appendChild(progressCircle);

      // Create slider to update progress
      const progressSlider = document.createElement("input");
      progressSlider.setAttribute("type", "range");
      progressSlider.setAttribute("min", "0");
      progressSlider.setAttribute("max", "100");
      progressSlider.setAttribute("value", "0");
      progressSlider.classList.add("progress-slider");

      // Update circle progress on slider change
      progressSlider.addEventListener("input", function () {
          const progress = progressSlider.value;
          const offset = 251.2 - (progress / 100) * 251.2; // Calculate stroke offset
          progressCircle.setAttribute("stroke-dashoffset", offset);
          saveProgress(title, progress);
      });

      // Load saved progress from localStorage
      const savedProgress = loadProgress(title);
      progressSlider.value = savedProgress;
      progressCircle.setAttribute("stroke-dashoffset", 251.2 - (savedProgress / 100) * 251.2);

      progressContainer.appendChild(progressSVG);
      progressContainer.appendChild(progressSlider);

      li.appendChild(bookTitle);
      li.appendChild(progressContainer);

      // Create a remove button
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "❌";
      removeBtn.classList.add("remove-btn");
      removeBtn.setAttribute("aria-label", `Remove ${title} from library`);
      
      removeBtn.onclick = function () {
          li.remove();
          updateLibraryInLocalStorage();
          removeProgress(title); // Remove progress from storage
          showPopup(`${title} removed from library!`);
      };

      li.appendChild(removeBtn);
      savedBooksList.appendChild(li);
  });
}

// Remove the progress of a specific book
function removeProgress(bookId) {
  const progressData = JSON.parse(localStorage.getItem('progress')) || {};
  delete progressData[bookId];
  localStorage.setItem('progress', JSON.stringify(progressData));
}

// Toggle the library panel (open/close)
function toggleLibrary() {
    const panel = document.getElementById("library-panel");
    if (panel.classList.contains("active")) {
      panel.classList.remove("active");
    } else {
      panel.classList.add("active");
    }
}

window.onload = function () {
  displayBooks(defaultBooks);
  loadLibraryFromLocalStorage();
};

const modalOverlay = document.getElementById("modal-overlay");
const bookModal = document.getElementById("book-modal");

function openModal() {
    bookModal.classList.add("open");
    modalOverlay.classList.add("active");
}

function closeModal() {
    bookModal.classList.remove("open");
    modalOverlay.classList.remove("active");
}

modalOverlay.addEventListener("click", closeModal);

// Dark Mode Toggle
const darkModeToggle = document.getElementById("dark-mode-toggle");
const body = document.body;

// Check for saved dark mode preference
if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        darkModeToggle.textContent = "Light Mode";
    }

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            darkModeToggle.textContent = "Light Mode";
        } else {
            localStorage.setItem("darkMode", "disabled");
            darkModeToggle.textContent = "Dark Mode";
        }
    });
});
// Function to filter books by genre


// Listen for changes in genre filter selection
document.getElementById("genre-filter").addEventListener("change", filterBooksByGenre);

// Function to display books (default or after filtering)
function displayBooks(books) {
  bookList.innerHTML = ""; // Clear current book list
  books.forEach((book) => {
    if (book.image) {
      bookList.appendChild(createBookElement(book)); // Create and display each book
    }
  });
}

// Initialize by showing all books on page load
document.addEventListener("DOMContentLoaded", function () {
  displayBooks(defaultBooks);  // Show default books initially
});
// Function to filter and display saved books by genre


// Event listener for genre filter
document.getElementById("genre-filter").addEventListener("change", filterBooksByGenre);

// Function to display saved books
function displaySavedBooks(books) {
  const savedBooksContainer = document.getElementById("saved-books"); // Replace with the correct container ID
  savedBooksContainer.innerHTML = ""; // Clear the list before rendering

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.textContent = book.title || "Untitled Book";
    savedBooksContainer.appendChild(bookElement);
  });
}
// --- Function: Filter Saved Books by Genre ---
function filterBooksByGenre() {
  // Get the selected genre from the dropdown
  const genreFilter = document.getElementById("genre-filter").value;
  
  // Retrieve saved book titles from LocalStorage (as an array of strings)
  const savedBooksTitles = JSON.parse(localStorage.getItem("savedBooks")) || [];
  
  // Use the defaultBooks array to look up full book objects for those titles
  const savedBooks = defaultBooks.filter(book => savedBooksTitles.includes(book.title));
  
  // Filter the saved books based on the selected genre.
  // If no genre is selected (or if "All Genres" is selected), show all saved books.
  const filteredBooks = savedBooks.filter(book => {
    return (genreFilter === "" || genreFilter === "All Genres") 
           ? true 
           : book.categories.includes(genreFilter);
  });
  
  // Get the saved-books container (the <ul> element)
  const savedBooksList = document.getElementById("saved-books");
  savedBooksList.innerHTML = ""; // Clear current list
  
  // For each filtered book, create a list item (similar to how it's done in addToReadingList)
  filteredBooks.forEach(book => {
    const li = document.createElement("li");
    li.classList.add("book-item");
    
    // Create a span for the book title
    const bookTitle = document.createElement("span");
    bookTitle.textContent = book.title;
    
    // Create the reading progress container
    const progressContainer = document.createElement("div");
    progressContainer.classList.add("progress-container");
    
    // Create the SVG circle (for the progress indicator)
    const progressSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    progressSVG.setAttribute("width", "50");
    progressSVG.setAttribute("height", "50");
    progressSVG.setAttribute("viewBox", "0 0 100 100");
    
    const circleBackground = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circleBackground.setAttribute("cx", "50");
    circleBackground.setAttribute("cy", "50");
    circleBackground.setAttribute("r", "40");
    circleBackground.setAttribute("stroke", "#ddd");
    circleBackground.setAttribute("stroke-width", "10");
    circleBackground.setAttribute("fill", "none");
    
    const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    progressCircle.setAttribute("cx", "50");
    progressCircle.setAttribute("cy", "50");
    progressCircle.setAttribute("r", "40");
    progressCircle.setAttribute("stroke", "#4CAF50");
    progressCircle.setAttribute("stroke-width", "10");
    progressCircle.setAttribute("fill", "none");
    progressCircle.setAttribute("stroke-dasharray", "251.2");
    progressCircle.setAttribute("stroke-dashoffset", "251.2");
    progressCircle.setAttribute("transform", "rotate(-90 50 50)");
    
    progressSVG.appendChild(circleBackground);
    progressSVG.appendChild(progressCircle);
    
    // Create the slider to update progress
    const progressSlider = document.createElement("input");
    progressSlider.setAttribute("type", "range");
    progressSlider.setAttribute("min", "0");
    progressSlider.setAttribute("max", "100");
    // Use loadProgress() to set its initial value for this book
    const savedProgress = loadProgress(book.title);
    progressSlider.setAttribute("value", savedProgress);
    progressSlider.classList.add("progress-slider");
    
    // Update circle progress when slider changes
    progressSlider.addEventListener("input", function () {
      const progress = progressSlider.value;
      const offset = 251.2 - (progress / 100) * 251.2; // Calculate new offset
      progressCircle.setAttribute("stroke-dashoffset", offset);
      saveProgress(book.title, progress);
    });
    
    progressContainer.appendChild(progressSVG);
    progressContainer.appendChild(progressSlider);
    
    // Create a remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.classList.add("remove-btn");
    removeBtn.setAttribute("aria-label", `Remove ${book.title} from library`);
    
    removeBtn.onclick = function () {
      li.remove();
      updateLibraryInLocalStorage();
      removeProgress(book.title); // Remove progress from storage
      showPopup(`${book.title} removed from library!`);
      // After removal, reapply the filter so the list stays in sync:
      filterBooksByGenre();
    };
    
    // Append elements to the list item
    li.appendChild(bookTitle);
    li.appendChild(progressContainer);
    li.appendChild(removeBtn);
    
    // Append the list item to the saved-books list
    savedBooksList.appendChild(li);
  });
}

// Add an event listener for changes on the genre filter dropdown:
document.getElementById("genre-filter").addEventListener("change", filterBooksByGenre);


