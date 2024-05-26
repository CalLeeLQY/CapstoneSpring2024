document.addEventListener('DOMContentLoaded', function() {
    const leftResult = document.getElementById('leftResult');
    const rightResult = document.getElementById('rightResult');
    const continueInput = document.getElementById('continueInput');
    const continueBtn = document.getElementById('continueBtn');
    const inputWrapper = document.getElementById('inputWrapper');

    function selectBox(resultBox) {
        leftResult.style.display = resultBox === leftResult ? 'block' : 'none';
        rightResult.style.display = resultBox === rightResult ? 'block' : 'none';
        resultBox.style.width = '100%'; // Expand selected box
        inputWrapper.classList.remove('hidden'); // Show input area
    }

    leftResult.addEventListener('click', function() {
        selectBox(leftResult);
    });

    rightResult.addEventListener('click', function() {
        selectBox(rightResult);
    });

    continueBtn.addEventListener('click', function() {
        const userInput = continueInput.value.trim();
        if (userInput) {
            const selectedBox = leftResult.style.display === 'none' ? rightResult : leftResult;
            const currentContent = selectedBox.innerText;
            const requestData = {
                currentContent: currentContent,
                userInput: userInput
            };
            fetch('/api/renew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            })
            .then(response => response.json())
            .then(data => {
                selectedBox.innerText = data.message;
                continueInput.value = ''; // Clear input field
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });
});
