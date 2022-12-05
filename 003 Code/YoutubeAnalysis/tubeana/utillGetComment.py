# 1. File name utillGetCommentExample.py -> utillGetComment.py
# 2. pip install google-api-python-client

from googleapiclient.discovery import build
import pandas as pd
from datetime import datetime

YOUTUBE_API_KEY = "Your Google API Key"

# 댓글 가져오기
def getComments(urlvalue):
    DEVELOPER_KEY = YOUTUBE_API_KEY
    YOUTUBE_API_SERVICE_NAME = "youtube"
    YOUTUBE_API_VERSION = "v3"
    reviews = []
    likeCount = []
    publishedAt = []

    npt = ""
    videoId_init = urlvalue
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=DEVELOPER_KEY)
    cm = youtube.commentThreads().list(
        videoId=videoId_init,
        order="relevance",
        part="snippet, replies",
        maxResults=100,
        pageToken=npt
    ).execute()

    if 'nextPageToken' in cm.keys():
        while 'nextPageToken' in cm.keys():
            cm = youtube.commentThreads().list(
                videoId=urlvalue,
                order="relevance",
                part="snippet, replies",
                maxResults=100,
                pageToken=npt
            ).execute()

            for i in cm['items']:
                comment = i['snippet']['topLevelComment']['snippet']
                likeCount.append([comment['textDisplay'], comment['likeCount']])
                publishedAt.append(comment['publishedAt'])
                reviews.append(comment['textDisplay'])

            if 'nextPageToken' in cm.keys():
                npt = cm['nextPageToken']
            else:
                break
    else:
        for i in cm['items']:
            comment = i['snippet']['topLevelComment']['snippet']
            likeCount.append([comment['textDisplay'], comment['likeCount']])
            publishedAt.append(comment['publishedAt'])
            reviews.append(comment['textDisplay'])

    # 좋아요 정렬
    adf = pd.DataFrame(likeCount, columns=['textDisplay', 'likeCount'])

    df_sorted_by_values = adf.sort_values(by='likeCount', ascending=False)

    likeCount_top5_Comments = []
    likeCount_top5_number = []

    for i in df_sorted_by_values['textDisplay'][:20]:
        a = i.replace("<br>", " ")
        b = a.replace("&quot;", " ")
        likeCount_top5_Comments.append(b)

    for i in df_sorted_by_values['likeCount'][:20]:
        likeCount_top5_number.append(i)

    # 댓글 시간별 수 정렬
    publishedAt.sort()
    datetime_format = "%Y-%m-%dT%H:%M:%SZ"
    datetime_result = []
    datetime_count = []

    for i in publishedAt:
        datetime_result.append(datetime.strptime(i, datetime_format))
        datetime_count.append(1)

    format = {
        'datetime': datetime_result,
        'count': datetime_count
    }

    tmp_df = pd.DataFrame(format)
    tmp_df['datetime'] = pd.to_datetime(tmp_df['datetime'])
    tmp_df = tmp_df.set_index('datetime')

    ten_min_df = tmp_df.resample('10T').sum()

    max_time_10min = ten_min_df['count'].idxmax()

    return reviews, likeCount_top5_Comments, likeCount_top5_number, ten_min_df, max_time_10min


# 영상 제목, 썸네일 가져오기
def getThumbnail(urlvalue):
    global title
    global image
    DEVELOPER_KEY = YOUTUBE_API_KEY
    YOUTUBE_API_SERVICE_NAME = "youtube"
    YOUTUBE_API_VERSION = "v3"
    # titles
    # images
    videoId_init = urlvalue
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=DEVELOPER_KEY)
    cm = youtube.videos().list(
        id=videoId_init,
        part='snippet'
    ).execute()

    for i in cm['items']:
        title = i['snippet']['title']
        image = i['snippet']['thumbnails']['medium']['url']

    return title, image


def getRelevanceVideo(title):
    DEVELOPER_KEY = YOUTUBE_API_KEY
    YOUTUBE_API_SERVICE_NAME = "youtube"
    YOUTUBE_API_VERSION = "v3"
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=DEVELOPER_KEY)

    global titles  # 영상 제목 저장할 리스트
    global id  # 영상 ID 저장할 리스트
    global relevanceImage

    relevanceImage = []

    titles = []
    id = []

    title_result = youtube.search().list(
        q=title,
        order="relevance",
        part="snippet",
        maxResults=6
    ).execute()

    for i in title_result['items']:
        titles.append(i['snippet']['title'])
        id.append(i['id']['videoId'])

    del titles[:1]
    del id[:1]

    cm = youtube.videos().list(
        id=id,
        part='snippet'
    ).execute()

    for i in cm['items']:
        relevanceImage.append(i['snippet']['thumbnails']['medium']['url'])

    return titles, id, relevanceImage
