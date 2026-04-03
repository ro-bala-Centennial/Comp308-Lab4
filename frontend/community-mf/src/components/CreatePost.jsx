import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { Badge, Button, Form, Stack } from "react-bootstrap";

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $category: String!, $aiSummary: String) {
    createPost(title: $title, content: $content, category: $category, aiSummary: $aiSummary) {
      id
      title
      category
    }
  }
`;

export default function CreatePost() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "news",
    aiSummary: "",
  });

  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    refetchQueries: ["GetPosts"],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPost({ variables: form });
    alert("Post created");
    setForm({ title: "", content: "", category: "news", aiSummary: "" });
  };

  return (
    <Form onSubmit={handleSubmit} className="d-grid gap-3">
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div>
          <p className="section-label mb-1">Publishing</p>
          <h2 className="mb-1">Create Post</h2>
          <p className="text-muted mb-0">Share a concise update with the community feed.</p>
        </div>
        <Badge bg="primary-subtle" text="primary" pill className="px-3 py-2">
          Posts
        </Badge>
      </div>

      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          value={form.title}
          placeholder="Street cleanup this Saturday"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={form.content}
          placeholder="Add the details residents should know..."
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
      </Form.Group>

      <Stack direction="horizontal" gap={3} className="align-items-start flex-wrap">
        <Form.Group className="flex-fill form-min-width">
          <Form.Label>Category</Form.Label>
          <Form.Select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="news">News</option>
            <option value="discussion">Discussion</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="flex-fill form-min-width">
          <Form.Label>AI Summary</Form.Label>
          <Form.Control
            value={form.aiSummary}
            placeholder="Optional short summary"
            onChange={(e) => setForm({ ...form, aiSummary: e.target.value })}
          />
        </Form.Group>
      </Stack>

      <div>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Publishing..." : "Create Post"}
        </Button>
      </div>

      {error && <p className="text-danger small mb-0">{error.message}</p>}
    </Form>
  );
}
