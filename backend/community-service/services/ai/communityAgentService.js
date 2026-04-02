const CommunityPost = require("../../models/CommunityPost");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildSuggestedQuestions = (input, posts) => {
  const category = posts[0]?.category;
  const suggestions = [
    category
      ? `What are the main concerns in ${category}?`
      : `What are the main themes related to "${input}"?`,
    "Are there any practical actions people are recommending?",
    "What other community topics are trending right now?",
  ];

  return suggestions.slice(0, 3);
};

const buildResponseText = (input, posts) => {
  if (!posts.length) {
    return `I could not find any community posts related to "${input}" yet. Try adding a few posts or using a broader question.`;
  }

  const summaries = posts.slice(0, 3).map((post) => {
    const snippet = post.content.length > 120
      ? `${post.content.slice(0, 117)}...`
      : post.content;

    return `${post.title} (${post.category}): ${snippet}`;
  });

  return `I found ${posts.length} relevant post${posts.length === 1 ? "" : "s"} about "${input}". ${summaries.join(" ")}`;
};

const runCommunityAgent = async (input) => {
  const search = input.trim();

  if (!search) {
    return {
      text: "Please provide a question or topic to search the community posts.",
      suggestedQuestions: [
        "What are people discussing about safety?",
        "What support requests are active right now?",
        "What topics are trending in the community?",
      ],
      retrievedPosts: [],
    };
  }

  const searchRegex = new RegExp(escapeRegex(search), "i");
  const keywordRegexes = search
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => new RegExp(escapeRegex(term), "i"));

  const broadMatches = await CommunityPost.find({
    $or: [
      { title: searchRegex },
      { content: searchRegex },
      { category: searchRegex },
      ...keywordRegexes.flatMap((regex) => ([
        { title: regex },
        { content: regex },
        { category: regex },
      ])),
    ],
  })
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    text: buildResponseText(search, broadMatches),
    suggestedQuestions: buildSuggestedQuestions(search, broadMatches),
    retrievedPosts: broadMatches,
  };
};

module.exports = { runCommunityAgent };
