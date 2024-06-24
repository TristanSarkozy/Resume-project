// Add function to send emails
function sendEmail(contactForm) {
    emailjs.send("gmail", "rosie", {
        "from_name": contactForm.name.value,
        "from_email": contactForm.emailaddress.value,
        "project_request": contactForm.projectsummary.value
    })
    // Add then method to our promise
    .then(
        function(response) {
            console.log("SUCCESS", response);
        },
        function(error) {
            console.log("Failed", error);
        });
        return false;
}