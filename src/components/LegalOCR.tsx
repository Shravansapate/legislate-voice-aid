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

export function LegalOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  const explainWithAI = () => {
    toast({
      title: "AI Explanation requires backend",
      description: "Connect to Supabase to enable OpenAI API integration for explaining legal text in simple language.",
      variant: "default"
    });
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
                <Button onClick={explainWithAI} className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Explain in Simple Language (AI)
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
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