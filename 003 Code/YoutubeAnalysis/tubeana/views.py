from django.shortcuts import render

from tubeana.utillGetComment import getComments, getThumbnail, getRelevanceVideo
from django.views.decorators.csrf import csrf_exempt
from django import template

# 감성분석 필요 라이브러리
from konlpy.tag import Okt, Kkma
from collections import Counter
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pandas as pd
import numpy as np
import csv
from tensorflow.keras.models import load_model
import string

strbun = template.Library()

def index(request):
    return render(request, 'tubeana/index.html')

YOUTUBE_API_KEY = "Your Google API Key"
from googleapiclient.discovery import build

# 잘못된 URL 입력 시, 예외처리
def check_url(url):
    DEVELOPER_KEY = YOUTUBE_API_KEY
    YOUTUBE_API_SERVICE_NAME = "youtube"
    YOUTUBE_API_VERSION = "v3"

    npt = ""
    videoId_init = url
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=DEVELOPER_KEY)
    global sign
    sign = False
    try :
        cm = youtube.commentThreads().list(
            videoId=videoId_init,
            order="relevance",
            part="snippet, replies",
            maxResults=100,
            pageToken=npt
        ).execute()
    except Exception :
        sign = True


@csrf_exempt
@strbun.filter("board")
def board(request) :
    global reviews

    global videoId

    global title

    global thumbnail

    # 연관 영상
    global relevanceTitle
    global relevanceId
    global relevanceThumbnail

    # 좋아요 수
    global likeCount_Comments  # 좋아요 수 상위 5개 댓글 내용
    global likeCount_number  # 좋아요 수 상위 5개 좋아요 수

    # 댓글 시간별 수 정렬
    global ten_min_df
    global max_ten_min

    videoId = request.GET.get("url").split("=")[-1]
    
    # 예외처리
    check_url(videoId)
    try :
        if sign:
            return render(request, 'tubeana/index.html')
    except Exception :
        pass

    reviews, likeCount_Comments, likeCount_number, ten_min_df, max_ten_min = getComments(videoId)
    pd.set_option("display.max_rows", None)
    title, thumbnail = getThumbnail(videoId)

    relevanceTitle, relevanceId, relevanceThumbnail = getRelevanceVideo(title)

    percent, toptext, lowtext, keyword = predict_views(reviews)

    context = {
        'videoId': videoId,
        'title': title,
        'thumbnail': thumbnail,
        # 'title' : '제목',
        'percent': percent,
        'top5_text': toptext,
        'low5_text': lowtext,
        'keyword': keyword,
        'likes': likeCount_number,
        'likes_text': likeCount_Comments,
        'relation_thumbnails': relevanceThumbnail,
        'relation_title': relevanceTitle,
        'relation_id': relevanceId,
        'time': ten_min_df,
    }
    return render(request, 'tubeana/board.html', context)


# 감성분석 함수
def predict_views(reviews):
    global text
    global top_sentence
    global low_sentence
    global percent
    global top_text
    global low_text
    global top_score
    global low_score

    text = reviews

    df = pd.read_excel('tubeana/data/ratings_train.xlsx')  # 파일 명

    df = df.dropna(how='any')

    df['댓글 내용'] = df['댓글 내용'].str.replace("[^ㄱ-ㅎㅏ-ㅣ가-힣 ]", "")

    df['댓글 내용'] = df['댓글 내용'].str.replace('^ +', "")
    df['댓글 내용'].replace('', np.nan, inplace=True)

    df = df.dropna(how='any')

    global stopwords

    stopwords = ['의', '가', '이', '은', '들', '는', '좀', '잘', '걍', '과', '도', '를', '으로', '자', '에', '와', '한', '하다']

    okt = Okt()  # 토큰화 객체 생성

    readList = []

    f = open('tubeana/data/df_token.csv', 'r', encoding='utf-8')
    rdr = csv.reader(f)
    for line in rdr:
        readList.append(line)
    f.close()

    global tokenizer

    tokenizer = Tokenizer()  # 토큰화 객체 집합 생성
    tokenizer.fit_on_texts(readList)

    threshold = 4
    total_cnt = len(tokenizer.word_index)
    rare_cnt = 0
    total_freq = 0
    rare_freq = 0

    for key, value in tokenizer.word_counts.items():
        total_freq = total_freq + value

        # 단어의 등장 빈도수가 threshold보다 작으면
        if (value < threshold):
            rare_cnt = rare_cnt + 1
            rare_freq = rare_freq + value

    tokenizer = Tokenizer(total_cnt)
    tokenizer.fit_on_texts(readList)
    df_train = tokenizer.texts_to_sequences(readList)

    y_train = np.array(df['label'])

    global max_len

    max_len = 50

    df_train = pad_sequences(df_train, maxlen=max_len)

    global loaded_model
    loaded_model = load_model('tubeana/data/best_model.h5')

    top_score = []

    top_sentence = []

    low_score = []

    low_sentence = []

    global cnt
    cnt = 0

    # 예측함수
    def sentiment_predict(new_sentence):
        import re
        from konlpy.tag import Okt
        from tensorflow.keras.preprocessing.sequence import pad_sequences

        okt = Okt()

        original_sentence = new_sentence
        new_sentence = re.sub(r'[^ㄱ-ㅎㅏ-ㅣ가-힣 ]', '', new_sentence)
        new_sentence = okt.morphs(new_sentence, stem=True)  # 토큰화
        new_sentence = [word for word in new_sentence if not word in stopwords]  # 불용어 제거
        encoded = tokenizer.texts_to_sequences([new_sentence])  # 정수 인코딩
        pad_new = pad_sequences(encoded, maxlen=max_len)  # 패딩

        score = float(loaded_model.predict(pad_new))

        if (score > 0.5):
            global cnt
            cnt = cnt + 1;
            top_score.append(format(score * 100))
            top_sentence.append(original_sentence)
        else:
            low_score.append(format((1 - score) * 100))
            low_sentence.append(original_sentence)

    for i in range(0, len(text)):
        sentiment_predict(text[i])

    # 긍정 댓글 비율
    percent = (cnt / len(text)) * 100

    # 긍정 댓글 신뢰도 상위 5개
    top_5_idx = np.argsort(top_score)[-5:]  # top_score 값 중, 상위 5개 인덱스


    top_text = []
    for i in top_5_idx:
        top_text.append(top_sentence[i])

    for i in range(0, 5):
        print(top_text[i])
        print('\n')


    # 부정 댓글 신뢰도 상위 5개
    low_5_idx = np.argsort(low_score)[-5:]  # low_score 값 중, 상위 5개 인덱스

    low_text = []
    for i in low_5_idx:
        low_text.append(low_sentence[i])

    # 키워드 추출
    text = str(text)  # 키워드 추출을 위해 Object 형태였던 text를 String 형태로 변환

    text = text.replace('<br>', ' ')

    kkma = Kkma()

    noun = kkma.nouns(text)

    count = Counter(noun)

    tmp = []

    noun_list = count.most_common(200)
    for v in noun_list:
        v = str(v).translate(str.maketrans('', '', string.punctuation))
        v = v.replace("0", "").replace("1", "").replace("2", "").replace("3", "").replace("4", "").replace("5",
                                                                                                           "").replace(
            "6", "").replace("7", "").replace("8", "").replace("9", "")
        if (len(str(v)) > 4):
            tmp.append(str(v).translate(str.maketrans('', '', string.punctuation)))

    keyword = []
    for i in tmp:
        keyword.append(i.replace(" ", ""))

    return percent, top_text, low_text, keyword

# def save_db() :
#     import psycopg2
#
#     from tubeana.views import send_id
#
#     connection = psycopg2.connect("host= dbname= user= password= port= ")
#
#     query = "insert into test (id, per, good_top5, bad_top5, keyword) values (%s, %s, %s, %s, %s);"
#
#     values = (send_id(), percent, top_text, low_text, keyword)
#
#     cur = connection.cursor()
#     # 테이블 생성 코드는 처음에만 실행, 그 다음부턴 주석처리 해야됨
#     # cur.execute("CREATE TABLE test (id varchar(300) PRIMARY KEY, per double precision, good_top5 text, bad_top5 text, keyword text);")
#     cur.execute(query, values)
#     connection.commit()
#
# save_db()
