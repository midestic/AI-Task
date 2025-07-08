"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Wand2,
  Image,
  Volume2,
  FileText,
  Loader2,
} from "lucide-react";

export default function Generator() {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Playful");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ text: "", image: "", audio: "" });
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt || !tone) {
      setError("Please enter a prompt and select a tone.");
      return;
    }

    setLoading(true);
    setError("");
    setResult({ text: "", image: "", audio: "" });

    try {
      const [textRes, imageRes, audioRes] = await Promise.all([
        fetch("/api/text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt, tone }),
        }).then((res) => res.json()),

        fetch("/api/image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt, tone }),
        }).then((res) => res.json()),

        fetch("/api/audio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt, tone }),
        }).then((res) => res.json()),
      ]);

      setResult({
        text: textRes.text || "",
        image: imageRes.url || "",
        audio: audioRes.url || "",
      });
    } catch (err) {
      console.error("Error generating content:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-900 via-blue-900 to-cyan-900 bg-clip-text text-transparent mb-4">
            Multimodal Content Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your ideas into stunning text, images, and audio with the
            power of AI
          </p>
        </div>

        <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  Product Idea
                </label>
                <Input
                  placeholder="Describe your innovative product idea..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-12 text-lg border-2 border-gray-200 focus:border-violet-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Content Tone
                </label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-violet-400">
                    <SelectValue placeholder="Select Tone" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Playful">🎨 Playful</SelectItem>
                    <SelectItem value="Serious">💼 Serious</SelectItem>
                    <SelectItem value="Bold">⚡ Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Magic...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate Content
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center font-medium">{error}</p>
          </div>
        )}

        {result.text && (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-green-900">
                    Generated Text
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {result.text}
                </p>
              </CardContent>
            </Card>

            {result.image && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-violet-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Image className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold text-purple-900">
                      Generated Image
                    </h2>
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={result.image}
                      alt="Generated content visualization"
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {result.audio && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Volume2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-blue-900">
                      Generated Audio
                    </h2>
                  </div>
                  <audio
                    controls
                    src={result.audio}
                    className="w-full h-12 rounded-lg"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!result.text && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-violet-600" />
            </div>
            <p className="text-gray-500 text-lg">
              Enter your product idea above and click generate to see the magic
              happen!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
