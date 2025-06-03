// Zoom API interaction
// services/zoomService.js
import axios from 'axios';

export const createZoomMeeting = async ({ topic, startTime, duration }) => {
  try {
    const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
      topic,
      type: 2,
      start_time: startTime,
      duration,
      settings: {
        join_before_host: true
      }
    }, {
      headers: {
        Authorization: `Bearer ${process.env.ZOOM_JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error creating Zoom meeting:', error.response?.data || error);
    throw error;
  }
};
