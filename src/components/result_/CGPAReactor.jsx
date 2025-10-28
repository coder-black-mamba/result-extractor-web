import React from "react";

// Sample image URLs (replace with your own or public URLs)
const images = {
  excellent: [
    "https://i.imgur.com/3ZQ3ZQa.png", // nerd/celebration
    "https://i.imgur.com/Tl0s1nM.png", // trophy
  ],
  good: [
    "https://i.imgur.com/eh8q0Wy.png", // studying
    "https://i.imgur.com/7W9QZnt.png", // happy student
  ],
  average: [
    "https://i.imgur.com/pd5h1Lo.png", // coffee/late night
    "https://i.imgur.com/Bzoy7Ee.png", // meh face
  ],
  low: [
    "https://i.imgur.com/5m5Y7Uo.png", // crying
    "https://i.imgur.com/Gf1b8gE.png", // ramen noodles
  ],
  fail: [
    "https://i.imgur.com/1lXrTbJ.png", // meme funny fail
    "https://i.imgur.com/OcVqC7T.png", // facepalm
  ],
};

const getRandomImage = (arr) => arr[Math.floor(Math.random() * arr.length)];

const CgpaImageGame = ({ cgpa }) => {
  let category = "";
  if (cgpa >= 3.7) category = "excellent";
  else if (cgpa >= 3.0) category = "good";
  else if (cgpa >= 2.0) category = "average";
  else if (cgpa >= 1.0) category = "low";
  else category = "fail";

  const image = getRandomImage(images[category]);

  const getMessage = () => {
    if (cgpa >= 3.7) return "ওহে বাবা! তুমি একdum top student! 🌟";
    if (cgpa >= 3.0) return "ভাল! একটু পরিশ্রম লাগলেও ঠিকঠাক চলছে 😎";
    if (cgpa >= 2.0) return "মাঝারি অবস্থায়… চা/কফি খাও, মন বসাও ☕";
    if (cgpa >= 1.0) return "ভাই, একটু মেহনত দরকার। রাত জাগা শুরু! 🍜";
    return "হায় রে! CGPA খুব কম। আবার চেষ্টা করো 😅";
  };

  const styles = {
    container: {
      textAlign: "center",
      marginTop: "50px",
      fontFamily: "Arial, sans-serif",
      background: "#ffc0c0ff",
      padding: "30px",
      borderRadius: "15px",
      boxShadow: "0 0 20px rgba(0,0,0,0.1)",
      maxWidth: "600px",
      margin: "50px auto",
    },
    cgpa: { fontSize: "48px", fontWeight: "bold", color: "#ff6347" },
    message: { fontSize: "20px", marginTop: "15px" },
    image: { width: "250px", marginTop: "20px", borderRadius: "10px" },
  };

  return (
    <div style={styles.container}>
      <div style={styles.cgpa}>CGPA: {cgpa}</div>
      <div style={styles.message}>{getMessage()}</div>
      <img src={image} alt="CGPA Reaction" style={styles.image} />
    </div>
  );
};

export default CgpaImageGame;
