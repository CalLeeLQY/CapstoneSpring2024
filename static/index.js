document.querySelectorAll('.next').forEach(button => {
    button.addEventListener('click', function() {
        const questionDiv = this.closest('.question');
        questionDiv.classList.add('hidden');
        questionDiv.nextElementSibling.classList.remove('hidden');
    });
});

document.querySelectorAll('.back').forEach(button => {
    button.addEventListener('click', function() {
        const questionDiv = this.closest('.question');
        questionDiv.classList.add('hidden');
        questionDiv.previousElementSibling.classList.remove('hidden');
    });
});

document.getElementById('submit').addEventListener('click', function() {
    const data = {
        brandName: document.getElementById('brandName').value,
        userProfile: document.getElementById('userProfile').value,
        product: document.getElementById('product').value
    };

    document.getElementById('loading').style.display = 'flex'; 
    document.querySelector('.questionnaire').style.display = 'none';

    fetch('/api/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result.message);
        document.getElementById('response').textContent = result.message;
        document.getElementById('response').style.display = 'block'; 
        document.getElementById('register-tooltip').style.display = 'block'; 
        document.getElementById('registerButton').style.display = 'block'; 
        document.getElementById('loading').style.display = 'none';
    }).catch(error => {
        console.log('Error:', error);
        document.getElementById('response').textContent = 'Failed to load data: ' + error.message;
        document.getElementById('response').style.display = 'block'; // Show error message
        document.getElementById('loading').style.display = 'none'; // Ensure loading animation is hidden on error
    });
});

document.getElementById('registerButton').addEventListener('click', function() {
    window.location.href = '/register';
});

function scrollDown() {
    window.scrollBy({
        top: 1300, 
        behavior: 'smooth'
    });
}
