document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('captionForm');
    const leftResult = document.getElementById('leftResult');
    const rightResult = document.getElementById('rightResult');
    const inputWrapper = document.getElementById('inputWrapper');
    const continueInput = document.getElementById('continueInput');
    const continueBtn = document.getElementById('continueBtn');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        document.getElementById('loading').style.display = 'block';

        // 获取表单数据
        const formData = new FormData(form);
        
        // 将表单数据转换为JSON对象
        const formDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });
        
        // 获取checkbox状态并添加到formDataObj
        formDataObj['addHashtag'] = document.getElementById('addHashtag').checked;
        formDataObj['addEmoji'] = document.getElementById('addEmoji').checked;
        formDataObj['platformName'] = document.getElementById('modalTitle').textContent;

        fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObj)
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading').style.display = 'none';
            leftResult.textContent = data.leftbox;
            rightResult.textContent = data.rightbox;
            document.querySelector('.container').style.display = 'none';
            document.getElementById('resultContainer').style.display = 'flex'; // Show results container
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    document.getElementById('leftResult').addEventListener('click', function() {
        console.log(this.textContent);
        handleResultChoice(this.textContent);
    });

    document.getElementById('rightResult').addEventListener('click', function() {
        console.log(this.textContent);
        handleResultChoice(this.textContent);
    });
    
    function handleResultChoice(resultText) {
        // 存储所选文本到 sessionStorage
        sessionStorage.setItem('selectedCaption', resultText);
        // 重定向到 /textstudio 路由
        window.location.href = '/textstudio';
    }
});
