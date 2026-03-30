import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useQuery } from "@apollo/client/react";

const GET_HELP_REQUESTS = gql`
  query {
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
    refetchQueries: ["getHelpRequests"],
  });

  const handleVolunteer = async (id) => {
    await volunteerForHelpRequest({ variables: { id } });
  };

  if (loading) return <p>Loading help requests...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <h2>Help Requests</h2>
      {data.getHelpRequests.map((request) => (
        <div key={request.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <p>{request.description}</p>
          <p><strong>Location:</strong> {request.location}</p>
          <p><strong>Resolved:</strong> {request.isResolved ? "Yes" : "No"}</p>
          <p><strong>Volunteers:</strong> {request.volunteers.length}</p>
          <button onClick={() => handleVolunteer(request.id)}>Volunteer</button>
        </div>
      ))}
    </div>
  );
}