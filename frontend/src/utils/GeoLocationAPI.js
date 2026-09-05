import axios from "axios";

navigator.geolocation.getCurrentPosition(
  async (position) => {
    const { latitude, longitude } = position.coords;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/complaints",
        {
          title: "Sample Complaint",
          description: "This is a test complaint",
          location: { latitude, longitude },
        },
        {
          withCredentials: true, // if you're using cookie-based auth
        }
      );
      console.log("Response from backend:", response.data);
    } catch (error) {
      console.error("Error sending location:", error);
    }
  },
  (error) => {
    console.error("Error getting location:", error);
  }
);
