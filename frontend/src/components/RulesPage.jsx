// src/components/RulesPage.jsx
import React from "react";
import RuleForm from "./RuleForm"; // import RuleForm
import { useWebSocket } from "../utils/websocketClient"; // import the WebSocket hook

const RulesPage = () => {
  const ws = useWebSocket("ws://localhost:8080/firewall"); // change to your actual WebSocket server URL

  const handleSaveRule = (rule) => {
    const rules = { rules: [rule] };
    ws.sendMessage(JSON.stringify(rules)); // Send the rule to the backend via WebSocket
  };

  return (
    <div>
      <h2>Manage Firewall Rules</h2>
      <RuleForm onSave={handleSaveRule} />
    </div>
  );
};

export default RulesPage;
