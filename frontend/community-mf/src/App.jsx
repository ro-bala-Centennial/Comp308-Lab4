import CommunityAIChatbot from "./components/CommunityAIChatbot";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import CreateHelpRequest from "./components/CreateHelpRequest";
import HelpRequestList from "./components/HelpRequestList";

export default function App() {
  return (
    <main className="community-page container py-4 py-lg-5">
      <section className="community-hero rounded-4 p-4 p-lg-5 mb-4">
        <p className="section-label mb-2">Community Engagement System</p>
        <h1 className="display-5 fw-semibold mb-2">Neighborhood activity, help requests, and AI guidance</h1>
        <p className="lead mb-0 text-secondary">
          Browse recent posts, publish updates, coordinate help, and explore community trends through the assistant.
        </p>
      </section>

      <section className="mb-4">
        <CommunityAIChatbot />
      </section>

      <section className="row g-4 align-items-start">
        <div className="col-12 col-xl-5">
          <div className="tool-panel rounded-4 p-4 h-100">
            <CreatePost />
          </div>
        </div>
        <div className="col-12 col-xl-7">
          <div className="tool-panel rounded-4 p-4 h-100">
            <PostList />
          </div>
        </div>
        <div className="col-12 col-xl-5">
          <div className="tool-panel rounded-4 p-4 h-100">
            <CreateHelpRequest />
          </div>
        </div>
        <div className="col-12 col-xl-7">
          <div className="tool-panel rounded-4 p-4 h-100">
            <HelpRequestList />
          </div>
        </div>
      </section>
    </main>
  );
}
