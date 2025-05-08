"use client";
import type React from "react";
import { useState, useRef } from "react";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Progress } from "../components/ui/Progress";
import { FileUp, Copy, Trash2 } from "lucide-react";
import { handleFile } from "../util/file";

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  alert("Text copied to clipboard");
};

export function PDFExtractorMockup() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showExtractedText, setShowExtractedText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleFile(e, setFile, simulateExtraction, setText);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    await handleFile(e, setFile, simulateExtraction, setText);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const simulateExtraction = () => {
    setIsExtracting(true);
    setProgress(0);
    setShowExtractedText(false);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsExtracting(false);
        setShowExtractedText(true);
      }
    }, 100);
  };

  const resetState = () => {
    setFile(null);
    setIsExtracting(false);
    setProgress(0);
    setShowExtractedText(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">PDF Text Extractor</CardTitle>
          <p className="text-muted-foreground">
            Extract text from PDF files directly in your browser
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isExtracting ? "bg-muted" : "hover:bg-muted/50"
            } transition-colors`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
              disabled={isExtracting}
            />
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <FileUp className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {isExtracting
                    ? "Extracting text..."
                    : "Drop your PDF here or click to browse"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {file ? file.name : "Supports PDF files"}
                </p>
              </div>
              {!isExtracting && (
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isExtracting}
                >
                  Select PDF
                </Button>
              )}
              {isExtracting && (
                <div className="w-full max-w-md">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Processing page {Math.ceil((4 * progress) / 100)} of 4
                  </p>
                </div>
              )}
            </div>
          </div>

          {showExtractedText && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Extracted Text</h3>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(text)}
                    variant="outline"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button size="sm" onClick={resetState} variant="outline">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
              <div className="border rounded-md p-4 bg-muted/30 h-[300px] overflow-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {text}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
