const form = document.getElementById("lead-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
        athleteName: document.getElementById("athlete-name").value,
        athleteAge: document.getElementById("athlete-age").value,
        primarySport: document.getElementById("primary-sport").value,
        parentName: document.getElementById("parent-name").value,
        parentEmail: document.getElementById("parent-email").value,
        parentPhone: document.getElementById("parent-phone").value,
        athleteGoals: document.getElementById("athlete-goals").value,
        injuryHistory: document.getElementById("injury-history").value,
        trainingHistory: document.getElementById("training-history").value,
        otherInterests: document.getElementById("other-interests").value
    };

    try {
        const response = await fetch(
            "https://u2pdp8c394.execute-api.us-east-1.amazonaws.com/prod/lead",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            }
        );

        const result = await response.json();

        alert("Thanks! Your information has been submitted.");
        console.log(result);

    } catch (error) {
        console.error(error);
        alert("Something went wrong. Please try again.");
    }
});