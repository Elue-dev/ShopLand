import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "../../chat-bot-kit/config";
import MessageParser from "../../chat-bot-kit/MessageParser";
import ActionProvider from "../../chat-bot-kit/ActionProvider";
import styles from "./home.module.scss";
import Card from "../../components/card/Card";

export default function ChatBot() {
  return (
    <Card cardClass={styles.card}>
      <div className={styles["bot-container"]}>
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
        />
      </div>
    </Card>
  );
}
