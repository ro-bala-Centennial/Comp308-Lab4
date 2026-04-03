import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { Badge, Button, Form } from "react-bootstrap";

const CREATE_HELP_REQUEST = gql`
  mutation CreateHelpRequest($description: String!, $location: String) {
    createHelpRequest(description: $description, location: $location) {
      id
      description
      location
      isResolved
    }
  }
`;

export default function CreateHelpRequest() {
  const [form, setForm] = useState({
    description: "",
    location: "",
  });

  const [createHelpRequest, { loading, error }] = useMutation(CREATE_HELP_REQUEST, {
    refetchQueries: ["GetHelpRequests"],
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createHelpRequest({ variables: form });
    alert("Help request created");
    setForm({ description: "", location: "" });
  };

  return (
    <Form onSubmit={handleSubmit} className="d-grid gap-3">
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div>
          <p className="section-label mb-1">Support</p>
          <h2 className="mb-1">Create Help Request</h2>
          <p className="text-muted mb-0">Post a request so volunteers can quickly respond.</p>
        </div>
        <Badge bg="success-subtle" text="success" pill className="px-3 py-2">
          Help
        </Badge>
      </div>

      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={form.description}
          placeholder="Describe what support is needed..."
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Location</Form.Label>
        <Form.Control
          value={form.location}
          placeholder="Community center, Building A, etc."
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
      </Form.Group>

      <div>
        <Button type="submit" variant="success" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </div>

      {error && <p className="text-danger small mb-0">{error.message}</p>}
    </Form>
  );
}
