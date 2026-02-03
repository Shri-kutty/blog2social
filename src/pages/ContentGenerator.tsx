import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  FileText, 
  Linkedin, 
  Twitter, 
  Hash, 
  Palette,
  ArrowRight,
  RotateCcw 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import OutputSection from "@/components/OutputSection";
import LoadingState from "@/components/LoadingState";
import HistoryPanel from "@/components/HistoryPanel";
import { useContentGeneration } from "@/hooks/useContentGeneration";
import { HistoryEntry } from "@/lib/historyStorage";
import { toast } from "sonner";

const ContentGenerator = () => {
  const [blogText, setBlogText] = useState("");
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const { isGenerating, generatedContent, generateContent, resetContent, setContent } = useContentGeneration();

  const handleGenerate = async () => {
    await generateContent(blogText);
    setHistoryRefresh((prev) => prev + 1);
  };

  const handleReset = () => {
    setBlogText("");
    resetContent();
  };

  const handleSelectHistory = (entry: HistoryEntry) => {
    setContent(entry.generatedContent);
    toast.success("Loaded from history");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 md:py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <div className="text-center flex-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
                <Sparkles className="h-4 w-4" />
                AI-Powered Content Repurposing
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Transform Your <span className="text-gradient">Blog Content</span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                Paste your blog post and get platform-optimized social media content instantly
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <HistoryPanel
                onSelectEntry={handleSelectHistory}
                refreshTrigger={historyRefresh}
              />
            </div>
          </div>
        </motion.header>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <label className="mb-3 block text-sm font-medium text-foreground">
              Your Blog Content
            </label>
            <Textarea
              value={blogText}
              onChange={(e) => setBlogText(e.target.value)}
              placeholder="Paste your long-form blog content here..."
              className="min-h-[200px] resize-none border-border/50 bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary input-glow"
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-muted-foreground">
                {blogText.length > 0 ? `${blogText.split(/\s+/).filter(Boolean).length} words` : "0 words"}
              </span>
              <div className="flex gap-3">
                {generatedContent && (
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="border-border/50"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                )}
                <Button
                  variant="glow"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={isGenerating || !blogText.trim()}
                >
                  {isGenerating ? (
                    <>Generating...</>
                  ) : (
                    <>
                      Generate Content
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {isGenerating && <LoadingState />}
        </AnimatePresence>

        {/* Output Sections */}
        <AnimatePresence>
          {generatedContent && !isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <OutputSection
                title="Blog Summary"
                content={generatedContent.blogSummary}
                icon={<FileText className="h-5 w-5" />}
                delay={0}
              />

              <OutputSection
                title="LinkedIn Post"
                content={generatedContent.linkedInPost}
                icon={<Linkedin className="h-5 w-5" />}
                delay={0.1}
              />

              <OutputSection
                title="Twitter/X Post"
                content={generatedContent.twitterPost}
                icon={<Twitter className="h-5 w-5" />}
                delay={0.2}
              />

              <OutputSection
                title="Hashtags"
                content={generatedContent.hashtags.join(" ")}
                icon={<Hash className="h-5 w-5" />}
                delay={0.3}
              />

              <OutputSection
                title="Style Justification"
                content={generatedContent.styleJustification}
                icon={<Palette className="h-5 w-5" />}
                delay={0.4}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContentGenerator;
