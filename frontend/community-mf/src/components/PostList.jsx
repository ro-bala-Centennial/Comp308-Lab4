import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useQuery } from "@apollo/client/react";

const GET_POSTS = gql`
  query {
    getPosts {
      id
      title
      content
      category
      aiSummary
      createdAt
    }
  }
`;

export default function PostList() {
  const { data, loading, error } = useQuery(GET_POSTS);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <h2>All Posts</h2>
      {data.getPosts.map((post) => (
        <div key={post.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p><strong>Category:</strong> {post.category}</p>
          {post.aiSummary && <p><strong>Summary:</strong> {post.aiSummary}</p>}
        </div>
      ))}
    </div>
  );
}