import { useState, useCallback } from "react";
import { GeneratedContent, parseAIResponse } from "@/lib/parseAIResponse";
import { saveToHistory } from "@/lib/historyStorage";
import { toast } from "sonner";

export const useContentGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [lastBlogText, setLastBlogText] = useState<string>("");

  const generateContent = useCallback(async (blogText: string) => {
    if (!blogText.trim()) {
      toast.error("Please enter some blog content first");
      return;
    }

    setIsGenerating(true);
    setGeneratedContent(null);
    setLastBlogText(blogText);
    const prompt = `You are an AI content repurposing assistant. Convert the following blog post into structured social media content while keeping the core message consistent.

INPUT BLOG TEXT:
${blogText}

OUTPUT REQUIREMENTS:
Generate the following sections in the exact order and format:

1. Blog Summary:
- Provide EXACTLY five bullet points.
- Each bullet point must reflect a main idea from the blog.
- Keep points clear and non-repetitive.

2. LinkedIn Post:
- Professional and informative tone.
- Suitable for a business and marketing audience.
- Length: 2–4 short paragraphs.
- Must align with the blog summary.

3. Twitter/X Post:
- Write ONE concise and impactful tweet.
- Maximum length: 280 characters.
- Use a strong hook or insight.
- Ensure consistency with the LinkedIn post.

4. Hashtags:
- Provide EXACTLY five relevant hashtags.
- Hashtags must relate to the blog topic and content strategy.
- Output hashtags in a single line separated by spaces.

5. Style Justification:
- Provide ONE single-line explanation justifying the writing style used.

CONSTRAINTS:
- Do NOT add extra sections.
- Do NOT exceed or reduce the required counts.
- Maintain consistent messaging across all outputs.
- Avoid emojis unless appropriate for professional content.`;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again in a moment.");
        }
        if (response.status === 402) {
          throw new Error("API credits depleted. Please add more credits.");
        }
        throw new Error(errorData.error || "Failed to generate content");
      }

      const data = await response.json();
      const parsed = parseAIResponse(data.content);
      setGeneratedContent(parsed);
      saveToHistory(blogText, parsed);
      toast.success("Content generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const resetContent = useCallback(() => {
    setGeneratedContent(null);
    setLastBlogText("");
  }, []);

  const setContent = useCallback((content: GeneratedContent) => {
    setGeneratedContent(content);
  }, []);

  return {
    isGenerating,
    generatedContent,
    generateContent,
    resetContent,
    setContent,
    lastBlogText,
  };
};
