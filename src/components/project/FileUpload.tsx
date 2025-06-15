
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { parseGeometryFile, ParsedGeometry } from './FileParser';

interface FileUploadProps {
  projectId: string;
  onFileUploaded: () => void;
}

const FileUpload = ({ projectId, onFileUploaded }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedTypes = ['.kml', '.kmz', '.shp', '.zip', '.geojson', '.json'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a KML, KMZ, SHP, ZIP, or GeoJSON file.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      console.log('=== FILE UPLOAD DEBUG START ===');
      console.log('Uploading file:', file.name);
      console.log('File size:', file.size);
      console.log('File type:', file.type);
      console.log('Project ID:', projectId);

      // Parse the file to extract geometry
      console.log('Starting geometry parsing...');
      const geometryData = await parseGeometryFile(file);
      
      console.log('Geometry parsing result:', geometryData ? 'SUCCESS' : 'FAILED');
      if (geometryData) {
        console.log('Parsed geometry structure:', JSON.stringify(geometryData, null, 2));
      }
      
      if (!geometryData) {
        throw new Error('Failed to parse geometry from file');
      }

      const fileName = `${user.id}/${projectId}/${Date.now()}_${file.name}`;
      console.log('Storage file name:', fileName);
      
      // Upload file to storage
      console.log('Uploading to Supabase storage...');
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }
      console.log('Storage upload successful');

      // Store file information and geometry in database
      console.log('Inserting file record into database...');
      const insertData = {
        project_id: projectId,
        file_name: file.name,
        file_type: fileExtension.substring(1),
        file_path: fileName,
        file_size: file.size,
        geometry_data: geometryData as any,
        processed: true,
      };
      console.log('Database insert data:', JSON.stringify(insertData, null, 2));

      const { data: insertedFile, error: dbError } = await supabase
        .from('project_files')
        .insert(insertData)
        .select()
        .single();

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw dbError;
      }
      console.log('Database insert successful:', insertedFile);

      // Convert first feature geometry to PostGIS format and update
      if (geometryData.features && geometryData.features.length > 0) {
        const feature = geometryData.features[0];
        console.log('Converting to PostGIS format...');
        const wktGeometry = convertGeoJSONToWKT(feature.geometry);
        
        if (wktGeometry) {
          try {
            console.log('Updating PostGIS geometry column...');
            const { error: updateError } = await supabase
              .from('project_files')
              .update({ 
                geom: wktGeometry as any 
              })
              .eq('id', insertedFile.id);
              
            if (updateError) {
              console.log('Could not update PostGIS geometry column:', updateError);
            } else {
              console.log('Successfully updated PostGIS geometry');
            }
          } catch (error) {
            console.log('PostGIS update error:', error);
          }
        }
      }

      console.log('=== FILE UPLOAD DEBUG END ===');

      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded and processed.`
      });

      onFileUploaded();
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was an error uploading your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const convertGeoJSONToWKT = (geometry: any): string | null => {
    try {
      switch (geometry.type) {
        case 'Point':
          return `ST_GeomFromText('POINT(${geometry.coordinates[0]} ${geometry.coordinates[1]})', 4326)`;
        
        case 'Polygon':
          const rings = geometry.coordinates.map((ring: number[][]) => 
            '(' + ring.map((coord: number[]) => `${coord[0]} ${coord[1]}`).join(', ') + ')'
          ).join(', ');
          return `ST_GeomFromText('POLYGON(${rings})', 4326)`;
        
        case 'MultiPolygon':
          const polygons = geometry.coordinates.map((polygon: number[][][]) =>
            '(' + polygon.map((ring: number[][]) => 
              '(' + ring.map((coord: number[]) => `${coord[0]} ${coord[1]}`).join(', ') + ')'
            ).join(', ') + ')'
          ).join(', ');
          return `ST_GeomFromText('MULTIPOLYGON(${polygons})', 4326)`;
        
        default:
          console.warn('Unsupported geometry type:', geometry.type);
          return null;
      }
    } catch (error) {
      console.error('Error converting to WKT:', error);
      return null;
    }
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
            accept=".kml,.kmz,.shp,.zip,.geojson,.json"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          
          <div className="space-y-2">
            <Upload className="w-8 h-8 text-australis-gray mx-auto" />
            <p className="text-sm text-australis-gray">
              Upload KML, KMZ, Shapefile, ZIP, or GeoJSON
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
          <p>• Supported formats: KML, KMZ, Shapefile (ZIP), GeoJSON</p>
          <p>• One boundary file per project</p>
          <p>• Boundary will be displayed on Azure Maps</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
