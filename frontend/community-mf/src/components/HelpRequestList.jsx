import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useQuery } from "@apollo/client/react";
import { Badge, Button, Card, Placeholder, Stack } from "react-bootstrap";

const GET_HELP_REQUESTS = gql`
  query GetHelpRequests {
    getHelpRequests {
      id
      description
      location
      isResolved
      volunteers
    }
  }
`;

const VOLUNTEER = gql`
  mutation Volunteer($id: ID!) {
    volunteerForHelpRequest(id: $id) {
      id
      volunteers
    }
  }
`;

export default function HelpRequestList() {
  const { data, loading, error } = useQuery(GET_HELP_REQUESTS);
  const [volunteerForHelpRequest] = useMutation(VOLUNTEER, {
    refetchQueries: ["GetHelpRequests"],
  });

  const handleVolunteer = async (id) => {
    await volunteerForHelpRequest({ variables: { id } });
  };

  if (loading) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <p className="section-label mb-1">Requests</p>
            <h2 className="mb-1">Help Requests</h2>
          </div>
        </div>
        {[0, 1].map((item) => (
          <Card key={item} className="content-card mb-3 border-0 shadow-sm">
            <Card.Body>
              <Placeholder as="div" animation="glow">
                <Placeholder xs={8} className="mb-2" />
                <Placeholder xs={6} className="mb-2" />
                <Placeholder xs={4} />
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
          <p className="section-label mb-1">Requests</p>
          <h2 className="mb-1">Help Requests</h2>
          <p className="text-muted mb-0">Track active support needs and volunteer responses.</p>
        </div>
        <Badge bg="secondary" pill>
          {data.getHelpRequests.length}
        </Badge>
      </div>

      {data.getHelpRequests.length === 0 && (
        <p className="text-muted mb-0">No help requests have been posted yet.</p>
      )}

      <Stack gap={3}>
        {data.getHelpRequests.map((request) => (
          <Card key={request.id} className="content-card border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                <div>
                  <h3 className="h5 mb-1">Support Request</h3>
                  <p className="mb-0 text-secondary">{request.description}</p>
                </div>
                <Badge bg={request.isResolved ? "secondary" : "success"} pill>
                  {request.isResolved ? "Closed" : "Open"}
                </Badge>
              </div>

              <div className="d-flex flex-wrap gap-3 text-muted small mb-3">
                <span><strong>Location:</strong> {request.location || "Not specified"}</span>
                <span><strong>Volunteers:</strong> {request.volunteers.length}</span>
              </div>

              <Button
                onClick={() => handleVolunteer(request.id)}
                disabled={request.isResolved}
                variant={request.isResolved ? "outline-secondary" : "success"}
              >
                {request.isResolved ? "Closed" : "Volunteer"}
              </Button>
            </Card.Body>
          </Card>
        ))}
      </Stack>
    </div>
  );
}
