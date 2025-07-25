import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Loader2, Camera, AlertCircle } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { toast } from '@/hooks/use-toast';

interface OCRResult {
  text: string;
  confidence: number;
}

interface AIExplanation {
  simplifiedText: string;
  keyPoints: string[];
  urgentDeadlines: string[];
}

const OPENROUTER_API_KEY = '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';

export function LegalOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<AIExplanation | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setOcrResult(null);
    setAiExplanation(null);
    setIsProcessing(true);
    setProgress(0);

    try {
      // Create preview
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);

      // Initialize Tesseract worker
      const worker = await createWorker('eng+hin', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(m.progress * 100);
          }
        }
      });

      // Perform OCR
      const { data: { text, confidence } } = await worker.recognize(file);
      
      await worker.terminate();

      if (text.trim()) {
        setOcrResult({ text: text.trim(), confidence });
        toast({
          title: "Text extracted successfully!",
          description: `Confidence: ${Math.round(confidence)}%`
        });
      } else {
        setError('No text found in the image. Please try with a clearer image.');
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setError('Failed to process the image. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const fakeEvent = {
        target: { files }
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(fakeEvent);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const explainWithAI = async () => {
    if (!ocrResult?.text) return;
    
    setIsExplaining(true);
    setError(null);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Legal OCR Assistant'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a legal assistant helping underrepresented people understand legal documents. Explain legal text in simple, clear language that anyone can understand. Focus on key points, deadlines, and what actions the person needs to take. Format your response as JSON with: simplifiedText (main explanation), keyPoints (array of important points), urgentDeadlines (array of any time-sensitive items).'
            },
            {
              role: 'user',
              content: `Please explain this legal text in simple language: "${ocrResult.text}"`
            }
          ],
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const explanation = JSON.parse(data.choices[0].message.content);
      
      setAiExplanation(explanation);
      toast({
        title: "AI explanation generated!",
        description: "Legal text explained in simple language"
      });
    } catch (err) {
      console.error('AI Explanation Error:', err);
      setError('Failed to generate AI explanation. Please try again.');
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Legal Document OCR</h1>
        <p className="text-muted-foreground">
          Upload a photo of your legal notice to extract and understand the text
        </p>
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
        <CardContent className="p-6">
          <div
            className="text-center space-y-4 cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              {isProcessing ? (
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              ) : (
                <Upload className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">
                {isProcessing ? 'Processing your document...' : 'Upload Legal Document Photo'}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag and drop your image here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports: JPG, PNG, WebP (Max 10MB)
              </p>
            </div>
            <Button variant="outline" disabled={isProcessing}>
              <Camera className="h-4 w-4 mr-2" />
              Choose Photo
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isProcessing}
          />
        </CardContent>
      </Card>

      {/* Progress Bar */}
      {isProcessing && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Extracting text from image...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {uploadedImage && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Uploaded Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Uploaded Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={uploadedImage}
                alt="Uploaded legal document"
                className="w-full rounded-lg border shadow-sm"
              />
            </CardContent>
          </Card>

          {/* Extracted Text */}
          {ocrResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Extracted Text
                  </div>
                  <Badge variant="secondary">
                    {Math.round(ocrResult.confidence)}% confident
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                    {ocrResult.text}
                  </pre>
                </div>
                <Button onClick={explainWithAI} className="w-full" disabled={isExplaining}>
                  {isExplaining ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  {isExplaining ? 'Generating AI Explanation...' : 'Explain in Simple Language (AI)'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* AI Explanation */}
      {aiExplanation && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              AI Explanation in Simple Language
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-foreground mb-2">What this document means:</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {aiExplanation.simplifiedText}
                </p>
              </div>
              
              {aiExplanation.keyPoints.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Key Points:</h4>
                  <ul className="space-y-1">
                    {aiExplanation.keyPoints.map((point, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {aiExplanation.urgentDeadlines.length > 0 && (
                <div>
                  <h4 className="font-medium text-destructive mb-2">⚠️ Urgent Deadlines:</h4>
                  <ul className="space-y-1">
                    {aiExplanation.urgentDeadlines.map((deadline, index) => (
                      <li key={index} className="text-sm text-destructive flex items-start gap-2">
                        <span className="text-destructive mt-1">🕒</span>
                        <span>{deadline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">How it works:</p>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Upload a clear photo of your legal document</li>
                <li>Our OCR technology extracts the text automatically</li>
                <li>Get AI-powered explanations in simple language (requires backend setup)</li>
                <li>Save important deadlines and get reminders</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}