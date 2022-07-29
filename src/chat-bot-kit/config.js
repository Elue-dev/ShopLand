// in config.js
import { createChatBotMessage } from "react-chatbot-kit";

const botName = "ShopLand Bot";

const config = {
  initialMessages: [createChatBotMessage(`Hi! I'm ${botName}`)],
  botName: botName,
  customStyles: {
    botMessageBox: {
      backgroundColor: "#3c4448",
    },
    chatButton: {
      backgroundColor: "#c07d53",
    },
  },
};

export default config;
