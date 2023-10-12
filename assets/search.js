const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', function(e) {
    let searchVal = searchInput.value.toLowerCase();

    fetch('../search.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            let results = data.filter(post => 
                post.title.toLowerCase().includes(searchVal) || 
                post.content.toLowerCase().includes(searchVal) ||
                post.excerpt.toLowerCase().includes(searchVal) ||
                post.date.includes(searchVal)
            );
            displayResults(results);
        });
});

// Allow the user to press Return or Enter instead of clicking the button
searchInput.addEventListener('keyup', function(event) {
    if (event.key == "Enter") {
        searchButton.click();
    }
})

// Display the results, or display 'no results found'
function displayResults(results) {
    let resultsContainer = document.getElementById('search-results');
    if (results.length > 0) {
        resultsContainer.innerHTML = '<h2>Results found</h2>';
        results.forEach(post => {
            resultsContainer.innerHTML += `<a href="${post.url}">${post.title} - ${post.date}</a><p>"${post.excerpt}"</p>`;
        });
    } else {
        resultsContainer.innerHTML = '<h2>No results found</h2>';
    }
}