import { useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { Badge, Button, Card, Form, ListGroup, Spinner } from "react-bootstrap";
import { COMMUNITY_AI_QUERY } from "../graphql/communityAI";

export default function CommunityAIChatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const [runAIQuery, { loading, error }] = useLazyQuery(COMMUNITY_AI_QUERY, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      const ai = data.communityAIQuery;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: ai.text,
          suggestedQuestions: ai.suggestedQuestions,
          retrievedPosts: ai.retrievedPosts,
        },
      ]);
    },
  });

  const submitQuestion = (question) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    runAIQuery({ variables: { input: trimmed } });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitQuestion(input);
    setInput("");
  };

  const handleSuggestedClick = (question) => {
    submitQuestion(question);
  };

  return (
    <Card className="community-ai-card shadow-sm border-0 rounded-4">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
          <div>
            <p className="text-uppercase text-muted small mb-1">AI Support</p>
            <h2 className="mb-1">Community AI Assistant</h2>
            <p className="text-muted mb-0">
              Ask for trends, concerns, and related posts from the community feed.
            </p>
          </div>
          <Badge bg="dark" pill className="px-3 py-2">
            Live GraphQL
          </Badge>
        </div>

        <div className="community-chat-window border rounded-4 p-3 mb-3 bg-white">
          {messages.length === 0 && (
            <p className="text-muted mb-0">
              Ask something like: "What are people discussing about safety?"
            </p>
          )}

          {messages.map((msg, index) => (
            <div
              key={`${msg.role}-${index}`}
              className={`mb-3 ${msg.role === "user" ? "text-end" : "text-start"}`}
            >
              <div
                className={`d-inline-block px-3 py-2 rounded-4 ${
                  msg.role === "user"
                    ? "bg-primary text-white"
                    : "bg-light border border-secondary-subtle"
                }`}
                style={{ maxWidth: "80%" }}
              >
                {msg.text}
              </div>

              {msg.role === "assistant" && msg.suggestedQuestions?.length > 0 && (
                <div className="mt-2">
                  {msg.suggestedQuestions.map((question, questionIndex) => (
                    <Button
                      key={`${question}-${questionIndex}`}
                      variant="outline-secondary"
                      size="sm"
                      className="me-2 mb-2 rounded-pill"
                      onClick={() => handleSuggestedClick(question)}
                      disabled={loading}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              )}

              {msg.role === "assistant" && msg.retrievedPosts?.length > 0 && (
                <ListGroup className="mt-2">
                  {msg.retrievedPosts.map((post) => (
                    <ListGroup.Item
                      key={post._id}
                      className="rounded-3 mb-2 border community-post-preview"
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1 gap-2">
                        <strong>{post.title}</strong>
                        <Badge bg="secondary">{post.category || "General"}</Badge>
                      </div>
                      <div className="text-muted small">{post.content}</div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          ))}

          {loading && (
            <div className="text-center mt-3">
              <Spinner animation="border" size="sm" />
              <div className="small text-muted mt-2">Generating response...</div>
            </div>
          )}

          {error && (
            <div className="text-danger small mt-3">
              Failed to load AI response.
            </div>
          )}
        </div>

        <Form onSubmit={handleSubmit}>
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Ask a community-related question..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={loading}
            />
            <Button type="submit" variant="primary" disabled={loading}>
              Send
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
