// api request which gets a youtube subscribers posts that week

const axios = require('axios');

const getRecentVideos = async (channelId, apiKey) => {
  const res = await axios.get(
    `https://www.googleapis.com/youtube/v3/activities`,
    {
      params: {
        part: 'snippet,contentDetails',
        channelId: channelId,
        maxResults: 50, // maximum allowed value
        key: apiKey,
      },
    }
  );
  const activities = res.data.items;
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentVideos = activities.filter((activity) => {
    if (activity.snippet.type !== 'upload') {
      return false;
    }
    const activityDate = new Date(activity.snippet.publishedAt);
    return activityDate >= oneWeekAgo;
  });

  return recentVideos.map((video) => ({
    title: video.snippet.title,
    publishedAt: video.snippet.publishedAt,
    videoId: video.contentDetails.upload.videoId,
  }));
};

getRecentVideos('CHANNEL_ID', 'YOUR_API_KEY')
  .then((recentVideos) => {
    console.log(recentVideos);
  })
  .catch((error) => {
    console.error(error);
  });
