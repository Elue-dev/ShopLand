import React from "react";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleHello = () => {
    const botMessage = createChatBotMessage("Hello. Nice to meet you.");

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleThanks = () => {
    const botMessage = createChatBotMessage("You are welcome!");

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleOkay = () => {
    const botMessage = createChatBotMessage("That's great to hear!");

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleGood = () => {
    const botMessage = createChatBotMessage("I'm great!, how about you?");

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleAccount = () => {
    const botMessage = createChatBotMessage(
      "Having trouble signing in or setting up your account? let us know, go to the contact page and send us a message."
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleProducts = () => {
    const botMessage = createChatBotMessage(
      "If you have any inquiries about a product or you need assistance in any way, go to our contact page and submit your issue. All the best!.",
      {
        widget: "Product",
      }
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  // Put the handleHello and handleDog function in the actions object to pass to the MessageParser
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleHello,
            handleProducts,
            handleThanks,
            handleGood,
            handleOkay,
            handleAccount,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
