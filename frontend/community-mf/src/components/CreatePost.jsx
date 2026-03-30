import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useQuery } from "@apollo/client/react";

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
    refetchQueries: ["getPosts"],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPost({ variables: form });
    alert("Post created");
    setForm({ title: "", content: "", category: "news", aiSummary: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Post</h2>
      <input value={form.title} placeholder="Title" onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <textarea value={form.content} placeholder="Content" onChange={(e) => setForm({ ...form, content: e.target.value })} />
      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
        <option value="news">News</option>
        <option value="discussion">Discussion</option>
      </select>
      <input value={form.aiSummary} placeholder="AI Summary (optional)" onChange={(e) => setForm({ ...form, aiSummary: e.target.value })} />
      <button type="submit">{loading ? "Loading..." : "Create Post"}</button>
      {error && <p>{error.message}</p>}
    </form>
  );
}