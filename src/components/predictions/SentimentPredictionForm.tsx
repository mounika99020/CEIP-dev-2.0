import React, { useState } from 'react';
import {
  HeartHandshake,
  MessageSquareQuote,
  Sparkles,
  Info,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  analyzeSentiment,
  SentimentAnalysisResponse,
} from '../../lib/api';
import { DEMO_PREDICTION_PRESETS } from '../../data/demoData';

export const SentimentPredictionForm: React.FC = () => {
  const [feedbackText, setFeedbackText] = useState(
    DEMO_PREDICTION_PRESETS.sentimentNegativeSample
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SentimentAnalysisResponse | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setLoading(true);
    try {
      const response = await analyzeSentiment({ text: feedbackText });
      setResult(response);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = (sample: string) => {
    setFeedbackText(sample);
    setResult(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Input Form Column */}
      <div className="lg:col-span-7">
        <Card className="border-[#1c2638]">
          <CardHeader>
            <div>
              <CardTitle>Customer Feedback Analysis</CardTitle>
              <CardDescription>
                Process unstructured customer transcripts, tickets, and review verbatim.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Load sample:</span>
              <button
                type="button"
                onClick={() =>
                  handleLoadSample(DEMO_PREDICTION_PRESETS.sentimentNegativeSample)
                }
                className="text-xs px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
              >
                Negative Complaint
              </button>
              <button
                type="button"
                onClick={() =>
                  handleLoadSample(DEMO_PREDICTION_PRESETS.sentimentPositiveSample)
                }
                className="text-xs px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
              >
                Positive Testimonial
              </button>
            </div>
          </CardHeader>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Customer Feedback Text
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={6}
                placeholder="Enter customer feedback or complaint text..."
                className="w-full bg-[#0b0f17]/80 border border-[#1f2a3f] rounded-lg p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors resize-none"
                required
              />
              <p className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Supports support tickets, QBR notes, NPS comments, or email threads.</span>
                <span>{feedbackText.length} characters</span>
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#1c2638]">
              <span className="text-[11px] text-slate-500 font-mono">
                Ready for POST /api/sentiment/analyze
              </span>
              <Button type="submit" isLoading={loading} variant="teal">
                <HeartHandshake className="w-4 h-4 mr-2" />
                Analyze Sentiment
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Result Display Column */}
      <div className="lg:col-span-5">
        <Card className="h-full border-[#1c2638] bg-[#111726]/90 flex flex-col justify-between">
          <div>
            <CardHeader>
              <div>
                <CardTitle>Sentiment Analysis Output</CardTitle>
                <CardDescription>
                  NLP sentiment classification & insight extraction.
                </CardDescription>
              </div>
              {result && (
                <Badge
                  variant={
                    result.sentiment === 'Positive'
                      ? 'positive'
                      : result.sentiment === 'Negative'
                      ? 'negative'
                      : 'neutral'
                  }
                >
                  {result.sentiment}
                </Badge>
              )}
            </CardHeader>

            {!result ? (
              <div className="py-14 text-center px-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-slate-400 mb-3">
                  <MessageSquareQuote className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-200">
                  Awaiting Feedback Analysis
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Type or paste customer text into the feedback box, then click Analyze Sentiment.
                </p>
              </div>
            ) : (
              <div className="space-y-4 mt-2">
                {/* Result Highlights */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#0b0f17]/90 border border-[#1f2a3f]">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                      Sentiment
                    </span>
                    <span className="text-2xl font-bold text-white capitalize">
                      {result.sentiment}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                      Confidence
                    </span>
                    <span className="text-2xl font-bold text-slate-200 font-mono">
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Insight Narrative */}
                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-[#1c2638]">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Extracted Customer Insight
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {result.insight}
                  </p>
                </div>

                {/* Aspect Breakdown */}
                {result.aspects && result.aspects.length > 0 && (
                  <div>
                    <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Aspect-Based Polarity
                    </h5>
                    <div className="space-y-2">
                      {result.aspects.map((aspect, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded bg-slate-900/40 border border-[#1f2a3f] text-xs"
                        >
                          <span className="text-slate-300">{aspect.category}</span>
                          <Badge
                            size="sm"
                            variant={
                              aspect.sentiment === 'Positive'
                                ? 'positive'
                                : aspect.sentiment === 'Negative'
                                ? 'negative'
                                : 'neutral'
                            }
                          >
                            {aspect.sentiment}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#1c2638] mt-4 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>FastAPI NLP sentiment model hook</span>
            </span>
            <span className="font-mono">POST /api/sentiment/analyze</span>
          </div>
        </Card>
      </div>
    </div>
  );
};