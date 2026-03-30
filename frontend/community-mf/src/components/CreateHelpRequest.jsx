import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useQuery } from "@apollo/client/react";

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
    refetchQueries: ["getHelpRequests"],
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createHelpRequest({ variables: form });
    alert("Help request created");
    setForm({ description: "", location: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Help Request</h2>
      <textarea value={form.description} placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input value={form.location} placeholder="Location" onChange={(e) => setForm({ ...form, location: e.target.value })} />
      <button type="submit">{loading ? "Loading..." : "Submit"}</button>
      {error && <p>{error.message}</p>}
    </form>
  );
}