document.getElementById('openSidebarBtn').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    sidebar.style.display = 'block'; // 显示侧边栏
    sidebar.classList.add('open'); // 应用展开样式
    this.style.display = 'none'; // 隐藏外部按钮
});

document.getElementById('allfiles').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    sidebar.style.display = 'block'; // 显示侧边栏
    sidebar.classList.add('open'); // 应用展开样式
    // this.style.display = 'none'; // 隐藏外部按钮
});

document.getElementById('closeSidebarBtn').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('open'); // 移除展开样式
    setTimeout(() => {
        sidebar.style.display = 'none'; // 延迟隐藏侧边栏，确保过渡效果完成
    }, 300); // 根据CSS过渡时间设置
    document.getElementById('openSidebarBtn').style.display = 'block'; // 显示外部按钮
});


document.addEventListener('DOMContentLoaded', function() {
    // Get data from server
    fetch('/get-creations')
    .then(response => response.json())
    .then(data => {
        const sidebar = document.getElementById('sidebar'); // 获取侧边栏
        data.forEach(item => {
            // 为每个内容创建一个按钮，并设置点击事件
            const button = document.createElement('button');
            button.textContent = item.content.length > 25 ? item.content.substring(0, 25) + "..." : item.content;// 按钮文本为内容
            button.className = 'sidebar-button'; // 设置按钮类
            button.onclick = function() { // 设置点击事件
                const container = document.getElementById('creations-container');
                container.innerHTML = `<p>${item.content}</p>`; // 显示选中内容的详细信息
                document.getElementById('sidebar').style.display = 'block'; // 确保侧边栏是打开的
                sessionStorage.setItem('selectedCaption', item.content);
                // 重定向到 textstudio.html
                window.location.href = '/textstudio';
            };
            sidebar.appendChild(button); // 将按钮添加到侧边栏
        });
    })
    .catch(error => console.error('Error:', error));
});


// function openModal(option) {
//     document.body.classList.add('modal-open');
//     document.getElementById('upbody').style.filter = 'blur(5px)';
//     document.getElementById('mainContent').style.filter = 'blur(5px)';
//     document.getElementById('modalTitle').textContent = `${option}`;
//     document.getElementById('modalOverlay').style.display = 'flex';
// }

function openModal(option, type) {
    document.body.classList.add('modal-open');
    document.getElementById('upbody').style.filter = 'blur(5px)';
    document.getElementById('mainContent').style.filter = 'blur(5px)';
    document.getElementById('modalTitle').textContent = `${option}`;
    if (type === 'option') {
        document.getElementById('postAboutask').textContent = `what is the ${option} about`
        document.getElementById('modalOverlay').style.display = 'flex';
    } else if (type === 'option-2') {
        document.getElementById('modalTitle').textContent = `${option}`;
        document.getElementById('postAboutask').textContent = `what is the ${option} about`
        document.getElementById('modalOverlay').style.display = 'flex';
        // 这里可以根据需要调整 option-2 的表单样式或内容
    }
}

function closeModal() {
    document.body.classList.remove('modal-open');
    document.getElementById('mainContent').style.filter = 'none';
    document.getElementById('upbody').style.filter = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
}



document.addEventListener('DOMContentLoaded', function() {
    // Get references to all the option buttons
    const twitterOption = document.getElementById('twitterOption');
    const instagramOption = document.getElementById('instagramOption');
    const tiktokOption = document.getElementById('tiktokOption');
    const facebookOption = document.getElementById('facebookOption');
    const youtubeOption = document.getElementById('youtubeOption');
    
    const blogsOption = document.getElementById('blogsOption');
    const emailsOption = document.getElementById('emailsOption');
    const messagesOption = document.getElementById('messagesOption');
    const websitesOption = document.getElementById('websitesOption');
    
    // Event listeners for option buttons
    twitterOption.addEventListener('click', function() {
        openModal('Twitter ads', 'option');
    });
    
    instagramOption.addEventListener('click', function() {
        openModal('Instagram ads', 'option');
    });
    
    tiktokOption.addEventListener('click', function() {
        openModal('TikTok ads', 'option');
    });
    
    facebookOption.addEventListener('click', function() {
        openModal('Facebook ads', 'option');
    });
    
    youtubeOption.addEventListener('click', function() {
        openModal('YouTube ads', 'option');
    });

    // Event listeners for option-2 buttons
    blogsOption.addEventListener('click', function() {
        openModal('Blogs', 'option-2');
    });

    emailsOption.addEventListener('click', function() {
        openModal('Emails', 'option-2');
    });

    messagesOption.addEventListener('click', function() {
        openModal('Messages', 'option-2');
    });

    document.getElementById('closeModalBtn').addEventListener('click', function() {
        window.location.href = '/home';
    });
    
});
