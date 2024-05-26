from flask import Flask, jsonify, request, send_file, render_template, g, redirect, render_template, url_for, make_response
from flask_cors import CORS
import openai
import ssl
import logging
import string
import traceback
import random
import sqlite3
from functools import wraps
import hashlib

app = Flask(__name__)
CORS(app)  # 启用 CORS 支持
API_key = ""
gpt_client = openai.OpenAI(api_key= API_key,)

def get_db():
    db = getattr(g, '_database', None)

    if db is None:
        db = g._database = sqlite3.connect('db/mai.sqlite3')
        db.row_factory = sqlite3.Row
        setattr(g, '_database', db)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# def query_db(query, args=(), one=False, commit=False):
#     db = get_db()
#     cursor = db.execute(query, args)
#     if commit:
#         db.commit()
#         last_id = cursor.lastrowid
#         cursor.close()
#         return last_id
#     rows = cursor.fetchall()
#     cursor.close()
#     return rows[0] if rows and one else rows if rows else None

def query_db(query, args=(), one=False, commit=False):
    db = get_db()
    db.row_factory = sqlite3.Row  # 设置row_factory
    cursor = db.execute(query, args)
    
    if commit:
        db.commit()
        last_id = cursor.lastrowid
        cursor.close()
        return last_id
    
    rows = cursor.fetchall()
    cursor.close()
    
    if one:
        return dict(rows[0]) if rows else None
    else:
        return [dict(row) for row in rows] if rows else None

def interact_with_gpt(msgs):
    response = gpt_client.chat.completions.create(
        model="gpt-4o",
        messages=msgs
    )
    return response.choices[0].message.content


def get_user_from_cookie(request):
    user_id = request.cookies.get('user_id')
    password = request.cookies.get('user_password')
    if user_id and password:
        return query_db('select * from users where id = ? and password = ?', [user_id, password], one=True)
    return None

@app.route('/get-creations', methods=['GET'])
def get_creations():
    # 这里是模拟的数据获取，实际应该是数据库查询
    user_id = request.cookies.get('user_id')
    print(user_id)
    db_data = query_db('SELECT * FROM creations WHERE user_id = ?', [user_id])
    try:
        creations = [{'type':i['type'],'content':i['content']} for i in db_data]
    except Exception as e:
        # 处理数据库查询中的其他可能错误
        print(f"An error occurred: {e}")
        creations = []
    return jsonify(creations)

# @app.route('/save-data', methods=['POST'])
# def save_data():
#     data = request.get_json()
#     content = data.get('content')
#     type = data.get('type')

#     user_id = request.cookies.get('user_id')
#     print(user_id)
#     query_db('INSERT INTO creations (user_id, type, content) VALUES (?, ?, ?)', (user_id, type, content))
#     data=query_db('SELECT * FROM creations')
#     print(data)
#     return jsonify({'success': True})  # 可以返回成功的状态
@app.route('/save-data', methods=['POST'])
def save_data():
    data = request.get_json()
    content = data.get('content')
    type = data.get('type')

    user_id = request.cookies.get('user_id')
    
    # 插入数据并提交事务
    query_db('INSERT INTO creations (user_id, type, content) VALUES (?, ?, ?)', 
             (user_id, type, content), commit=True)
    
    # 检查插入后的数据
    data = query_db('SELECT * FROM creations')
    
    return jsonify({'success': True})

# ------------------------------ NORMAL PAGE ROUTES ----------------------------------



@app.route('/')
def index():
    return send_file('templates/index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    return send_file('templates/register.html')

@app.route('/textstudio')
def textstudio():
    # 假设你已经有 textstudio.html 页面准备好显示
    return render_template('textstudio.html')

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = data['password']

    # 检查用户名是否已存在
    if query_db('SELECT id FROM users WHERE username = ?', [username], one=True):
        return jsonify({'success': False, 'message': 'Username already exists'})

    # 插入新用户并获取 ID
    user_id = query_db('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
                       [username, email, password], commit=True)
    if user_id:
        resp = make_response(redirect(url_for('home')))
        resp.set_cookie('user_id', str(user_id), httponly=True)  # 更安全的 cookie 设置
        resp.set_cookie('username', str(username), httponly=True) 
        return resp
    else:
        return jsonify({'success': False, 'message': 'Registration failed'})

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        user = query_db('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], one=True)
        if user:
            resp = make_response(jsonify({'success': True}))
            resp.set_cookie('user_id', str(user['id']), httponly=True)
            return resp
        else:
            return jsonify({'success': False, 'message': 'Invalid username or password'})
    return send_file('templates/login.html')



@app.route('/home')
def home():
    user_id = request.cookies.get('user_id')
    # username = request.cookies.get('username')
    # # 打印到控制台以进行调试

    print(f"user id: {user_id}")
    # print(f": {username}")
    
    return send_file('templates/home.html')

@app.route('/form')
def form():
    option = request.args.get('option', 'No option selected')
    return render_template('form.html', option=option)

@app.route('/profile')
def profile():
    user_id = request.cookies.get('user_id')
    data = query_db('select * from users where id = ?', [user_id], one=True)
    print(data)
    
    return render_template('profile.html', username=data['username'],email=data['email'])




def get_user_from_cookie(request):
    username = request.cookies.get('username')
    password = request.cookies.get('user_password')
    if user_id and password:
        return query_db('select * from users where id = ? and password = ?', [username, password], one=True)
    return None

def get_api_key(userid):
    api_key = query_db(f"SELECT api_key FROM users WHERE id = {userid}")
    return api_key[0][0]

def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('Api-Key')
        print(get_api_key(request.cookies.get('user_id')))
        if not api_key or api_key != get_api_key(request.cookies.get('user_id')):  # 确保这里是实际的 API 密钥
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated_function

# @app.route('/generate', methods=['POST'])
# def generate_caption():
#     print(request.form)
#     platform_name = "Twitter"
#     post_about = request.form.get('postAbout')
#     target_audience = request.form.get('target_audience')
#     key_talking_points = "biodegradable packaging, cruelty-free testing, all-natural ingredients"
#     tone_of_voice = request.form.get('toneOfVoice')
#     language = "English"
#     include_hashtag = "Yes"
#     list_of_hashtags = "#EcoFriendly #GreenBeauty"
#     include_emoji = "Yes"
#     # list_of_emojis = "🌿🐰"
    
#     # - Include Hashtag: {include_hashtag} (If yes, specify: {list_of_hashtags})
#     # - Include Emoji: {include_emoji} (If yes, specify: {list_of_emojis})
#     # - Key Talking Points: {key_talking_points}
#     advertisement_prompt = f"""Create an advertisement using the following details:

#     - Platform where the ad will be posted: {platform_name}
#     - Post about: {post_about}
#     - Target Audience: {target_audience}
#     - Tone of Voice: {tone_of_voice}
#     - Language: {language}
#     - number of Words: 100

#     Ensure that the advertisement is engaging, concise, and adheres to the platform's guidelines.
#     """
#     input = [{"role": "user", "content": "For all the questions that following, give me two answers split by string: |||, in format: text1 ||| text2 "},{"role": "assistant", "content" : "ok"},
#              {"role": "user", "content": advertisement_prompt}]
#     #generated_data =  interact_with_gpt(input)
#     generated_data = "Introducing our latest line of eco-friendly cosmetics! 🌿🐰 Discover biodegradable packaging, cruelty-free testing, and all-natural ingredients. Join young adults passionate about sustainable living today! #EcoFriendly #GreenBeauty ||| Elevate your beauty routine with eco-conscious choices! 🌿🐰 Embrace biodegradable packaging, cruelty-free testing, and natural ingredients. Connect with like-minded individuals and make a positive impact! #EcoFriendly #GreenBeauty"
#     leftbox = generated_data.split('|||')[0]
#     rightbox = generated_data.split('|||')[1]
#     return jsonify({'leftbox': leftbox, 'rightbox': rightbox})
@app.route('/generate', methods=['POST'])
def generate_caption():
    # 获取表单数据
    data = request.get_json()
    print(data)
    
    # 获取表单数据
    platform_name = data.get('platformName', 'Twitter')
    post_about = data.get('postAbout')
    target_audience = data.get('targetAudience')
    key_talking_points = data.get('keyTalkingPoints', 'biodegradable packaging, cruelty-free testing, all-natural ingredients')
    tone_of_voice = data.get('toneOfVoice')
    language = data.get('language', 'English')
    include_hashtag = 'include Hashtag' if data.get('addHashtag') else 'do not add Hashtag'
    # list_of_hashtags = data.get('listOfHashtags', '#EcoFriendly #GreenBeauty')
    include_emoji = 'include Emoji' if data.get('addEmoji') else 'do not add Emoji'
    # list_of_emojis = data.get('listOfEmojis', '🌿🐰')
    # 构建广告提示语
    print(include_emoji)
    # - Include Hashtag: {include_hashtag} (If yes, add some hashtag, if No, do not include any hashtag)
    # - Include Emoji: {include_emoji} (If yes, add some emoji, if No, do not include any emoji)
    advertisement_prompt = f"""
    Create two engaging and concise advertisements using the following details (provide two distinct texts separated by "|||"):
    - this is a {platform_name}
    - Post about: {post_about}
    - Target Audience: {target_audience}
    - Tone of Voice: {tone_of_voice}
    - Language: {language}
    - Key Talking Points: {key_talking_points}
    - {include_hashtag} 
    - {include_emoji} 
    - Number of Words: 150

    Ensure that the text is engaging, concise, and adheres to the platform's guidelines.
    """
        # {"role": "user", "content": "For all the questions that follow, give me two answers split by string: |||, in format: text1 ||| text2"},
        # {"role": "assistant", "content": "ok"},
    input = [
        {"role": "user", "content": advertisement_prompt}
    ]

    # 调用 interact_with_gpt 函数生成数据
    # generated_data = interact_with_gpt(input)
    generated_data = interact_with_gpt(input)  # 你可以替换为实际调用 GPT 的代码
    print(generated_data)
    # 分割生成的数据
    leftbox = generated_data.split('|||')[0].strip()
    rightbox = generated_data.split('|||')[1].strip()

    return jsonify({'leftbox': leftbox, 'rightbox': rightbox}) 

@app.route('/api/data', methods=['POST'])
def get_data():
    data = request.get_json()  # 获取 JSON 数据
    productName = data.get('product', 'erro')  # 安全访问字典
    productIntro = data.get('productIntro', 'erro')
    userProfile = data.get('userProfile', 'erro')
    question = f"""the name of the brand is {productName}, the product is {productIntro}, 
              our target customers are {userProfile} based on these information 
              you need to create an ad copy"""
    input = [{"role": "user", "content": question}]
    gpt_resp =  interact_with_gpt(input)
    # print(gpt_resp)
    #gpt_resp = "Discover PearPhone, the ultimate choice for the young and dynamic! With its ultra-slim design and practical features, PearPhone fits seamlessly into your lifestyle. Stay stylish and efficient, whether at work or play. Upgrade now to experience the perfect blend of lightness and utility with PearPhone."
    return jsonify({'message': str(gpt_resp)})

@app.route('/api/renew', methods=['POST'])
def renew_content():
    data = request.get_json()  # 获取 JSON 数据
    print(data)
    originalContent = data["orginalContent"]
    tone = data["tone"]
    keyword = data["keyword"]
    other = data["other"]
    prompt = f"""
    Revise the following content to match the specified requirements:
    Original Content: {originalContent}
    if the text include emoji, the new content also add emoji else do not add emoji
    if the text include hashtag, the new content also add  hashtag else do not add hashtag
    Desired Tone: {'Leisure' if tone == 1 else 'Casual' if tone == 2 else 'Semi-professional' if tone == 3 else 'Professional'}
    Keyword to Highlight: {keyword}
    Additional Instructions: {other}

    Please rewrite the content ensuring it is engaging, includes the specified keyword prominently, and adheres to the desired tone.
    """
    input = [{"role": "user", "content": prompt}]
    #new_content = "renew  Introducing our latest line of eco-friendly cosmetics! Discover biodegradable packaging, cruelty-free testing, and all-natural ingredients. Join young adults passionate about sustainable living today! #EcoFriendly #GreenBeauty "
    new_content = gpt_resp =  interact_with_gpt(input)
    #print(new_content)
    return jsonify({'message': new_content})


if __name__ == '__main__':
    # context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
    # context.load_cert_chain('cert.pem', 'key.pem')
    app.run(host='0.0.0.0', port=5000, debug=True)