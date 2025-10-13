'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { Paintbrush, Eraser, Square, Circle, Type, Trash2, Download, ArrowLeft, Users } from 'lucide-react';

export default function WhiteboardPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'rectangle' | 'circle'>('pen');
  const [color, setColor] = useState('#3b82f6');
  const [lineWidth, setLineWidth] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = tool === 'eraser' ? 'white' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/features/collaboration" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-gray-300" />
            <span className="text-gray-300">Back to Collaboration</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="EduSync Logo" width={32} height={32} />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EduSync
            </span>
          </Link>

          <div className="flex gap-4">
            <Link href="/dashboard/student">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
                <Paintbrush className="w-10 h-10 text-blue-400" />
                Interactive Whiteboard
              </h1>
              <p className="text-gray-300">
                Draw, sketch, and collaborate visually with your class
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">3 active users</span>
            </div>
          </div>

          {/* Toolbar */}
          <Card className="bg-gray-800 border-gray-700 p-4 mb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant={tool === 'pen' ? 'default' : 'outline'}
                  onClick={() => setTool('pen')}
                  size="sm"
                >
                  <Paintbrush className="w-4 h-4" />
                </Button>
                <Button
                  variant={tool === 'eraser' ? 'default' : 'outline'}
                  onClick={() => setTool('eraser')}
                  size="sm"
                >
                  <Eraser className="w-4 h-4" />
                </Button>
                <Button
                  variant={tool === 'rectangle' ? 'default' : 'outline'}
                  onClick={() => setTool('rectangle')}
                  size="sm"
                >
                  <Square className="w-4 h-4" />
                </Button>
                <Button
                  variant={tool === 'circle' ? 'default' : 'outline'}
                  onClick={() => setTool('circle')}
                  size="sm"
                >
                  <Circle className="w-4 h-4" />
                </Button>

                <div className="h-8 w-px bg-gray-600 mx-2" />

                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-9 rounded cursor-pointer"
                />

                <input
                  type="range"
                  min="1"
                  max="20"
                  value={lineWidth}
                  onChange={(e) => setLineWidth(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-gray-300 text-sm">{lineWidth}px</span>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={clearCanvas}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <Button variant="outline" size="sm" onClick={downloadCanvas}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </Card>

          {/* Canvas */}
          <Card className="bg-gray-800 border-gray-700 p-4">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-[600px] cursor-crosshair rounded-lg bg-white"
            />
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 p-6">
                <feature.icon className="w-10 h-10 text-blue-400 mb-3" />
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* Setup Note */}
          <Card className="bg-blue-900/20 border-blue-700 p-6 mt-8">
            <h3 className="text-xl font-bold mb-3 text-blue-400">🚀 Development Note</h3>
            <p className="text-gray-300 mb-4">
              This is a basic whiteboard demo. For production, consider integrating:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong>Excalidraw</strong> - Beautiful hand-drawn style whiteboard</li>
              <li><strong>TLDraw</strong> - Powerful collaborative canvas</li>
              <li><strong>Fabric.js</strong> - Advanced canvas manipulation</li>
              <li>WebSocket for real-time synchronization</li>
              <li>Save/load functionality with cloud storage</li>
            </ul>
          </Card>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

const features = [
  {
    icon: Paintbrush,
    title: 'Drawing Tools',
    description: 'Pen, shapes, text, and more drawing options',
  },
  {
    icon: Users,
    title: 'Real-time Sync',
    description: 'See everyone\'s drawings instantly',
  },
  {
    icon: Download,
    title: 'Export & Save',
    description: 'Download or save your whiteboard sessions',
  },
];
