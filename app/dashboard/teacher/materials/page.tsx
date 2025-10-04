'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { databases, storage, config, ID, Permission, Role } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Trash2, Download, BookOpen, File } from 'lucide-react';

interface Material {
  $id: string;
  materialId: string;
  quizId?: string;
  assignmentId?: string;
  title: string;
  description: string;
  type: string;
  url?: string;
  fileId?: string;
  $createdAt: string;
}

export default function TeacherMaterialsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('pdf');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (user?.role !== 'teacher') {
      router.push('/dashboard/student');
      return;
    }
    fetchMaterials();
  }, [user, router]);

  const fetchMaterials = async () => {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.collections.materials
      );
      setMaterials(response.documents as unknown as Material[]);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadMaterial = async () => {
    if (!user || !title || !file) {
      alert('Please fill in all required fields and select a file');
      return;
    }

    setUploading(true);
    try {
      // Upload file to Appwrite Storage
      const fileId = ID.unique();
      const uploadedFile = await storage.createFile(
        config.storageId,
        fileId,
        file
      );

      // Get file URL
      const fileUrl = storage.getFileView(config.storageId, fileId);

      // Create material document
      const materialId = ID.unique();
      await databases.createDocument(
        config.databaseId,
        config.collections.materials,
        materialId,
        {
          materialId,
          title,
          description,
          type,
          url: fileUrl.toString(),
          fileId: uploadedFile.$id,
          $createdAt: new Date().toISOString(),
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      );

      alert('Material uploaded successfully!');
      setShowUploadForm(false);
      setTitle('');
      setDescription('');
      setType('pdf');
      setFile(null);
      fetchMaterials();
    } catch (error: any) {
      console.error('Error uploading material:', error);
      alert('Failed to upload material: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteMaterial = async (materialId: string, fileId?: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      // Delete file from storage if it exists
      if (fileId) {
        await storage.deleteFile(config.storageId, fileId);
      }

      // Delete material document
      await databases.deleteDocument(
        config.databaseId,
        config.collections.materials,
        materialId
      );

      fetchMaterials();
    } catch (error) {
      console.error('Error deleting material:', error);
      alert('Failed to delete material');
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-600" />;
      case 'video':
        return <File className="w-8 h-8 text-purple-600" />;
      case 'document':
        return <FileText className="w-8 h-8 text-blue-600" />;
      default:
        return <File className="w-8 h-8 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'video':
        return 'bg-purple-100 text-purple-800';
      case 'document':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600">Loading materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Learning Materials</h1>
            <p className="text-gray-600 mt-2">Upload and manage study materials for your students</p>
          </div>
          <Button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="w-5 h-5 mr-2" />
            {showUploadForm ? 'Cancel' : 'Upload Material'}
          </Button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <Card className="p-8 bg-white shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload New Material</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Chapter 1 Notes"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the material..."
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="type">Material Type *</Label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="video">Video</option>
                  <option value="document">Text Document</option>
                  <option value="presentation">Presentation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="file">File *</Label>
                <input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {file && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  onClick={() => setShowUploadForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={uploadMaterial}
                  disabled={uploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Material'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Materials Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Uploaded Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <Card key={material.$id} className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  {getFileIcon(material.type)}
                  <Badge className={getTypeColor(material.type)}>
                    {material.type.toUpperCase()}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{material.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {material.description || 'No description'}
                </p>

                <p className="text-sm text-gray-500 mb-4">
                  Uploaded: {new Date(material.$createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2">
                  {material.url && (
                    <Button
                      onClick={() => window.open(material.url, '_blank')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  )}
                  <Button
                    onClick={() => deleteMaterial(material.$id, material.fileId)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}

            {materials.length === 0 && !showUploadForm && (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No materials yet</h3>
                <p className="text-gray-600 mb-6">Upload your first material to get started</p>
                <Button
                  onClick={() => setShowUploadForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Material
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
