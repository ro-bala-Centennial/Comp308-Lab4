import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Badge, Card, Placeholder, Stack } from "react-bootstrap";

const GET_POSTS = gql`
  query GetPosts {
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

  if (loading) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <p className="section-label mb-1">Feed</p>
            <h2 className="mb-1">Recent Posts</h2>
          </div>
        </div>
        {[0, 1].map((item) => (
          <Card key={item} className="content-card mb-3 border-0 shadow-sm">
            <Card.Body>
              <Placeholder as="div" animation="glow">
                <Placeholder xs={7} className="mb-2" />
                <Placeholder xs={12} className="mb-2" />
                <Placeholder xs={9} />
              </Placeholder>
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  }

  if (error) return <p className="text-danger mb-0">{error.message}</p>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <p className="section-label mb-1">Feed</p>
          <h2 className="mb-1">Recent Posts</h2>
          <p className="text-muted mb-0">Latest announcements and resident discussions.</p>
        </div>
        <Badge bg="secondary" pill>
          {data.getPosts.length}
        </Badge>
      </div>

      {data.getPosts.length === 0 && <p className="text-muted mb-0">No posts yet.</p>}

      <Stack gap={3}>
        {data.getPosts.map((post) => (
          <Card key={post.id} className="content-card border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                <div>
                  <h3 className="h5 mb-1">{post.title}</h3>
                  <Badge bg="dark-subtle" text="dark" pill>
                    {post.category}
                  </Badge>
                </div>
              </div>
              <p className="mb-2 text-secondary">{post.content}</p>
              {post.aiSummary && (
                <div className="content-note">
                  <strong>AI Summary:</strong> {post.aiSummary}
                </div>
              )}
            </Card.Body>
          </Card>
        ))}
      </Stack>
    </div>
  );
}
