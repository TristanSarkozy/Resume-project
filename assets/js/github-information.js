// Add function to return the user from Github API in a html string
function userInformationHTML(user) {
    return `
        <h2>${user.name}
            <span class="small-name">
                (@<a href="${user.html_url}" target="_blank">${user.login}</a>)
            </span>
        </h2>
        <div class="gh-content">
            <div class="gh-avatar">
                <a href="${user.html_url}" target="_blank">
                    <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
                </a>
            </div>
            <p>Followers: ${user.followers} - Following ${user.following} <br> Repos: ${user.public_repos}</p>
        </div>`;
}

// Add repo function
function repoInformationHTML(repos) {
    if (repos.length == 0) {
        return `<div class="clearfix repo-list">No repos!</div>`;
    }

    // Add variable to take us to the actual repo with target _blank to open in a new window
    var listItemsHTML = repos.map(function(repo) {
        return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>`;
    });
    // Add join methon to join all with a new line and stop iterating through the new array
    return `<div class="clearfix repo-list">
                <p>
                    <strong>Repo List:</strong>
                </p>
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`
}

// Add debounce function to limit the rate of API calls
function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// Add function to respond to a users input
function fetchGitHubInformation(event) {
    // Add code to clear whean there's an empty text box
    $("#gh-user-data").html("");
    $("#gh-repo-data").html("");

    var username = $("#gh-username").val();
    if (!username) {
        $("#gh-user-data").html(`<h2>Please enter a GitHub username</h2>`);
        return;
    }

    // Add an animated loader
    $("#gh-user-data").html(
        `<div id="loader">
            <img src="assets/css/loader.gif" alt="loading..." />
        </div>`);

    // Add a promise to find a user and release an error message if not found
    $.when(
        $.getJSON(`https://api.github.com/users/${username}`),
        // Add another method call to list the repos for the individual user
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then(
        // Add another response and variable and put the indexes for them
        function(firstResponse, secondResponse) {
            var userData = firstResponse[0];
            var repoData = secondResponse[0];
            $("#gh-user-data").html(userInformationHTML(userData));
            $("#gh-repo-data").html(repoInformationHTML(repoData));
        }, 
        function(errorResponse) {
            if (errorResponse.status === 404) {
                $("#gh-user-data").html(
                    `<h2>No info found for user ${username}</h2>`);
            } else if(errorResponse.status === 403) {
                var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset')*1000);
                $("#gh-user-data").html(`<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`);
            } else {
                console.log(errorResponse);
                $("#gh-user-data").html(
                    `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
            }
        });
}

// Add event listener for the input with debounce
$("#gh-username").on("input", debounce(fetchGitHubInformation, 800));

// Add code to display profile when the page is loaded
$(document).ready(fetchGitHubInformation);



