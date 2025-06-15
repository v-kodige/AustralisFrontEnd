
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key, ExternalLink } from 'lucide-react';

interface MapboxTokenInputProps {
  onTokenSet: (token: string) => void;
}

const MapboxTokenInput = ({ onTokenSet }: MapboxTokenInputProps) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      localStorage.setItem('mapbox_token', token.trim());
      onTokenSet(token.trim());
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-australis-navy">
          <Key className="w-5 h-5" />
          Mapbox Token Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-australis-gray mb-3">
              To display the map, please enter your Mapbox public token.
            </p>
            <Input
              type="text"
              placeholder="pk.eyJ1IjoiZXhhbXBsZS..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={!token.trim()}
          >
            Set Token
          </Button>
          <div className="text-xs text-australis-gray">
            <p className="flex items-center gap-1">
              Get your token from 
              <a 
                href="https://account.mapbox.com/access-tokens/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-australis-blue hover:underline flex items-center gap-1"
              >
                Mapbox Dashboard
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MapboxTokenInput;
