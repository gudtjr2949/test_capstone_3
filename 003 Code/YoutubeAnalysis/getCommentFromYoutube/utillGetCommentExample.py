# File name utillGetCommentExample.py -> utillGetComment.py


from googleapiclient.discovery import build
#pip install google-api-python-client

def getComments(urlvalue) :
    DEVELOPER_KEY = "Your Google API Key"
    YOUTUBE_API_SERVICE_NAME = "youtube"
    YOUTUBE_API_VERSION = "v3"
    reviews = []
    npt = ""
    videoId_init = urlvalue
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=DEVELOPER_KEY)
    cm = youtube.commentThreads().list(
        videoId=videoId_init,
        order="relevance",
        part="snippet",
        maxResults=100,
        pageToken=npt
    ).execute()

    if 'nextPageToken' in cm.keys():
        while 'nextPageToken' in cm.keys():
            cm = youtube.commentThreads().list(
                videoId=urlvalue,
                order="relevance",
                part="snippet",
                maxResults=100,
                pageToken=npt
            ).execute()
            for i in cm['items']:
                reviews.append(i['snippet']['topLevelComment']['snippet']['textOriginal'])

            if 'nextPageToken' in cm.keys():
                npt = cm['nextPageToken']
            else:
                break
    else:
        for i in cm['items']:
            reviews.append(i['snippet']['topLevelComment']['snippet']['textOriginal'])

    return reviews