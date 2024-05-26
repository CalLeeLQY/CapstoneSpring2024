document.getElementById('saveBtn').addEventListener('click', function() {
    const textContainer = document.getElementById('textContainer');
    var textcontent = textContainer.innerText;

    // 发送POST请求到服务器
    fetch('/save-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: textcontent, type: 'text' })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/home'; // 替换为你的 Home 页面 URL
        } else {
            console.error('Failed to save data');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('discardBtn').addEventListener('click', function() {
    window.location.href = '/home';
});

document.addEventListener('DOMContentLoaded', function() {
    const selectedText = sessionStorage.getItem('selectedCaption'); // 从 sessionStorage 获取文本
    const textContainer = document.getElementById('textContainer');
    const loading = document.getElementById('loading');
    console.log(selectedText);
    if (selectedText) {
        textContainer.querySelector('p').textContent = selectedText; // 将选择的文本显示在页面上
    }

    const renewBtn = document.getElementById('renewBtn');

    renewBtn.addEventListener('click', function() {
        const toneValue = document.getElementById('toneValue').value; // 获取滑动条的值
        const keywordInputValue = document.getElementById('keywordInput').value; // 获取关键词输入框的值
        const otherInputValue = document.getElementById('otherInput').value; // 获取另一个输入框的值
        var textcontent = textContainer.querySelector('p').innerText;

        console.log('toneValue:', toneValue);
        console.log('Keyword Input Value:', keywordInputValue);
        console.log('Other Input Value:', otherInputValue);
        console.log('innercontent:', textcontent);

        if (textcontent) {
            const requestData = {
                orginalContent: textcontent,
                tone: toneValue,
                keyword: keywordInputValue,
                other: otherInputValue
            };

            textContainer.querySelector('p').style.display = 'none'; // Hide current text
            loading.style.display = 'block'; // 显示加载动画

            fetch('/api/renew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            })
            .then(response => response.json())
            .then(data => {
                loading.style.display = 'none'; // 隐藏加载动画
                textContainer.querySelector('p').style.display = 'block';
                textContainer.querySelector('p').innerText = data.message;
            })
            .catch(error => {
                loading.style.display = 'none'; // 隐藏加载动画
                textContainer.querySelector('p').style.display = 'block';
                console.error('Error:', error);
            });
        }
    });

    document.getElementById('saveBtn').addEventListener('click', function() {
        var textcontent = textContainer.querySelector('p').innerText;

        // 发送POST请求到服务器
        fetch('/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: textcontent, type: 'text' })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/home'; // 替换为你的 Home 页面 URL
            } else {
                console.error('Failed to save data');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    document.getElementById('discardBtn').addEventListener('click', function() {
        window.location.href = '/home';
    });
});
