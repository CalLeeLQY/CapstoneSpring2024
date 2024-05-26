document.getElementById('startButton').addEventListener('click', function() {
    document.querySelector('.intro').style.display = 'none';
    document.querySelector('.questionnaire').style.display = 'block';
});

document.querySelectorAll('.next').forEach(button => {
    button.addEventListener('click', function() {
        this.parentElement.classList.add('hidden');
        this.parentElement.nextElementSibling.classList.remove('hidden');
    });
});

document.querySelectorAll('.back').forEach(button => {
    button.addEventListener('click', function() {
        this.parentElement.classList.add('hidden');
        this.parentElement.previousElementSibling.classList.remove('hidden');
    });
});

document.getElementById('submit').addEventListener('click', function() {
    const data = {
        brandName: document.getElementById('brandName').value,
        userProfile: document.getElementById('userProfile').value,
        product: document.getElementById('product').value
    };
    // 显示加载动画
    document.getElementById('loading').style.display = 'flex'; 
    // 隐藏问题部分
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
        document.getElementById('response').textContent = result.message;
        document.getElementById('response').style.display = 'block'; // 显示响应元素
        document.getElementById('registerButton').style.display = 'block'; // 显示注册按钮
        // 隐藏加载动画
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
        top: 1300, // 下滑 500px
        behavior: 'smooth' // 平滑滚动
    });
}