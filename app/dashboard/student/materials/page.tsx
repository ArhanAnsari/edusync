'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { databases, config } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Search, BookOpen, File, Wifi, WifiOff } from 'lucide-react';

interface Material {
  $id: string;
  materialId: string;
  title: string;
  description: string;
  type: string;
  url?: string;
  fileId?: string;
  $createdAt: string;
}

export default function StudentMaterialsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (user?.role !== 'student') {
      router.push('/dashboard/teacher');
      return;
    }
    fetchMaterials();

    // Check online status
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [user, router]);

  useEffect(() => {
    filterMaterials();
  }, [materials, searchQuery, filterType]);

  const fetchMaterials = async () => {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.collections.materials
      );
      const fetchedMaterials = response.documents as unknown as Material[];
      setMaterials(fetchedMaterials);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMaterials = () => {
    let filtered = materials;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((m) => m.type === filterType);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMaterials(filtered);
  };

  const downloadMaterial = async (material: Material) => {
    if (!material.url) {
      alert('Material URL not available');
      return;
    }

    if (!isOnline) {
      alert('You are offline. Please connect to download materials.');
      return;
    }

    // Open in new tab
    window.open(material.url, '_blank');
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
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">Learning Materials</h1>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Badge className="bg-green-100 text-green-800">
                  <Wifi className="w-4 h-4 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <WifiOff className="w-4 h-4 mr-1" />
                  Offline Mode
                </Badge>
              )}
            </div>
          </div>
          <p className="text-gray-600">Access study materials shared by your teachers</p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 bg-white shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search materials..."
                className="pl-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF Documents</option>
              <option value="video">Videos</option>
              <option value="document">Text Documents</option>
              <option value="presentation">Presentations</option>
              <option value="other">Other</option>
            </select>
          </div>
        </Card>

        {/* Materials Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Materials ({filteredMaterials.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <Card key={material.$id} className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  {getFileIcon(material.type)}
                  <Badge className={getTypeColor(material.type)}>
                    {material.type.toUpperCase()}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{material.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {material.description || 'No description'}
                </p>

                <p className="text-sm text-gray-500 mb-4">
                  Added: {new Date(material.$createdAt).toLocaleDateString()}
                </p>

                <Button
                  onClick={() => downloadMaterial(material)}
                  disabled={!isOnline && !material.url}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isOnline ? 'View / Download' : 'Available Offline'}
                </Button>
              </Card>
            ))}

            {filteredMaterials.length === 0 && (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchQuery || filterType !== 'all'
                    ? 'No materials found'
                    : 'No materials available'}
                </h3>
                <p className="text-gray-600">
                  {searchQuery || filterType !== 'all'
                    ? 'Try adjusting your search or filter'
                    : 'Check back later for new materials from your teachers'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
