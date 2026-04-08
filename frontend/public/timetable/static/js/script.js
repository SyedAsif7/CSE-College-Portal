const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll("nav ul li a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
    }
});

// ------- Home Page: Search Box -------
function searchTimetable() {
    const value = document.getElementById("searchBox").value;
    if (value.trim() === "") {
        alert("Please type something to search.");
        return;
    }
    alert("Search results for: " + value);
}

// ------- About Page: Year Buttons -------
function openYear(year) {
    alert("You clicked: " + year + " (This can open a special page)");
}

// ------- Timetable Page: Open Final Year Timetable -------
function openTable() {
    let year = document.getElementById("year").value;
    if (year === "final") {
        window.location.href = "finalyear.html";
    } else if (year !== "") {
        alert("Timetable for " + year.toUpperCase() + " is not added yet.");
    }
}

// ------- Smooth Fade Animation -------
document.body.style.opacity = 0;
window.onload = () => {
    document.body.style.transition = "opacity 0.8s";
    document.body.style.opacity = 1;
};