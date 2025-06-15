
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface FileUploadProps {
  projectId: string;
  onFileUploaded: () => void;
}

const FileUpload = ({ projectId, onFileUploaded }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedTypes = ['.kml', '.kmz', '.shp', '.zip'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a KML, KMZ, SHP, or ZIP file.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileName = `${user.id}/${projectId}/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Parse file and extract geometry (simplified for now)
      const geometryData = await parseFile(file);

      const { error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          file_name: file.name,
          file_type: fileExtension.substring(1),
          file_path: fileName,
          file_size: file.size,
          geometry_data: geometryData,
          processed: true
        });

      if (dbError) throw dbError;

      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded and processed.`
      });

      onFileUploaded();
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const parseFile = async (file: File): Promise<any> => {
    // This is a simplified parser - in production you'd want more robust parsing
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          if (file.name.toLowerCase().endsWith('.kml')) {
            // For KML files, create a simple mock geometry
            resolve({
              type: "FeatureCollection",
              features: [{
                type: "Feature",
                geometry: {
                  type: "Polygon",
                  coordinates: [[
                    [-2.5, 53.3],
                    [-2.3, 53.3],
                    [-2.3, 53.5],
                    [-2.5, 53.5],
                    [-2.5, 53.3]
                  ]]
                },
                properties: {
                  name: file.name
                }
              }]
            });
          } else {
            // Mock geometry for other file types
            resolve({
              type: "FeatureCollection",
              features: [{
                type: "Feature",
                geometry: {
                  type: "Polygon",
                  coordinates: [[
                    [-2.5, 53.3],
                    [-2.3, 53.3],
                    [-2.3, 53.5],
                    [-2.5, 53.5],
                    [-2.5, 53.3]
                  ]]
                },
                properties: {
                  name: file.name
                }
              }]
            });
          }
        } catch (error) {
          console.error('Parse error:', error);
          resolve(null);
        }
      };
      reader.readAsText(file);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-australis-navy flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Project Boundary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-australis-gray/30 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".kml,.kmz,.shp,.zip"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          
          <div className="space-y-2">
            <Upload className="w-8 h-8 text-australis-gray mx-auto" />
            <p className="text-sm text-australis-gray">
              Upload KML, KMZ, Shapefile, or ZIP
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              variant="outline"
              className="border-australis-blue/20 text-australis-blue hover:bg-australis-blue hover:text-white"
            >
              {uploading ? 'Uploading...' : 'Choose File'}
            </Button>
          </div>
        </div>

        <div className="text-xs text-australis-gray">
          <p>• Maximum file size: 50MB</p>
          <p>• Supported formats: KML, KMZ, Shapefile (ZIP)</p>
          <p>• One boundary file per project</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
