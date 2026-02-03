export interface GeneratedContent {
  blogSummary: string[];
  linkedInPost: string;
  twitterPost: string;
  hashtags: string[];
  styleJustification: string;
}

export const parseAIResponse = (response: string): GeneratedContent => {
  const content: GeneratedContent = {
    blogSummary: [],
    linkedInPost: "",
    twitterPost: "",
    hashtags: [],
    styleJustification: "",
  };

  const sections = response.split(/\d+\.\s+/);

  sections.forEach((section) => {
    const trimmed = section.trim();
    
    if (trimmed.toLowerCase().startsWith("blog summary")) {
      const lines = trimmed.split("\n").slice(1);
      content.blogSummary = lines
        .filter((line) => line.trim().startsWith("-") || line.trim().startsWith("•"))
        .map((line) => line.replace(/^[-•]\s*/, "").trim())
        .filter((line) => line.length > 0)
        .slice(0, 5);
    } else if (trimmed.toLowerCase().startsWith("linkedin")) {
      content.linkedInPost = trimmed
        .replace(/linkedin\s*post:?\s*/i, "")
        .trim();
    } else if (trimmed.toLowerCase().startsWith("twitter") || trimmed.toLowerCase().startsWith("x post")) {
      content.twitterPost = trimmed
        .replace(/(?:twitter\/x|twitter|x)\s*post:?\s*/i, "")
        .trim();
    } else if (trimmed.toLowerCase().startsWith("hashtags")) {
      const hashtagText = trimmed.replace(/hashtags:?\s*/i, "").trim();
      content.hashtags = hashtagText
        .split(/\s+/)
        .filter((tag) => tag.startsWith("#"))
        .slice(0, 5);
    } else if (trimmed.toLowerCase().startsWith("style justification")) {
      content.styleJustification = trimmed
        .replace(/style\s*justification:?\s*/i, "")
        .trim();
    }
  });

  return content;
};
