// Initial setup to handle navigation between sections

// Event listener for "Enter" button to go from landing page to "What is CCRB" section
document.getElementById('enter-btn').addEventListener('click', () => {
    document.getElementById('landing-page').classList.remove('active');
    document.getElementById('what-is-ccrb').classList.add('active');
});

// Event listener for "View Data" button to go from "What is CCRB" section to "Data" section
document.getElementById('next-to-data').addEventListener('click', () => {
    document.getElementById('what-is-ccrb').classList.remove('active');
    document.getElementById('data-ccrb').classList.add('active');
});

// Event listener for "Back to Information" button to go back from "Data" section to "What is CCRB" section
document.getElementById('back-btn').addEventListener('click', () => {
    document.getElementById('data-ccrb').classList.remove('active');
    document.getElementById('what-is-ccrb').classList.add('active');
});