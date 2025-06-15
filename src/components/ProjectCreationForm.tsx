
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { X, Plus, Trash2 } from "lucide-react";

interface ProjectCreationFormProps {
  onClose: () => void;
  onSubmit: (projectData: any) => void;
}

const ProjectCreationForm = ({ onClose, onSubmit }: ProjectCreationFormProps) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [teamMembers, setTeamMembers] = useState([{ email: "", role: "Viewer" }]);

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { email: "", role: "Viewer" }]);
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const updated = teamMembers.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    );
    setTeamMembers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      onSubmit({
        name: projectName,
        description,
        location,
        teamMembers: teamMembers.filter(member => member.email.trim())
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-australis-gray/20 shadow-2xl">
        <CardHeader className="border-b border-australis-gray/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-australis-navy">Create New Project</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="hover:bg-australis-lightGray"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-sm font-medium text-australis-navy">
                Project Name *
              </Label>
              <Input
                id="projectName"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="border-australis-gray/20 focus:border-australis-blue"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-australis-navy">
                Description
              </Label>
              <Input
                id="description"
                placeholder="Brief project description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-australis-gray/20 focus:border-australis-blue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-australis-navy">
                Project Location
              </Label>
              <Input
                id="location"
                placeholder="e.g., Sydney, NSW or coordinates"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-australis-gray/20 focus:border-australis-blue"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-australis-navy">Team Access</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTeamMember}
                  className="flex items-center gap-2 border-australis-blue/20 text-australis-blue hover:bg-australis-blue hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                  Add Member
                </Button>
              </div>

              <div className="space-y-3">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-australis-offWhite rounded-lg border border-australis-gray/10">
                    <Input
                      placeholder="team@example.com"
                      value={member.email}
                      onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                      className="flex-1 border-australis-gray/20 focus:border-australis-blue bg-white"
                    />
                    <select
                      value={member.role}
                      onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                      className="px-3 py-2 border border-australis-gray/20 rounded-md bg-white text-sm focus:border-australis-blue focus:outline-none"
                    >
                      <option value="Viewer">Viewer</option>
                      <option value="Editor">Editor</option>
                      <option value="Admin">Admin</option>
                    </select>
                    {teamMembers.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTeamMember(index)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-australis-gray/10">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-australis-gray/20"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-australis-blue to-australis-teal hover:from-australis-blue/90 hover:to-australis-teal/90 text-white shadow-lg"
              >
                Create Project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCreationForm;
