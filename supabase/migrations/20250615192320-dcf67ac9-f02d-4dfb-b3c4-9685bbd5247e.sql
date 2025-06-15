
-- Create projects table to store project details
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  team_members TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'active',
  boundary_file_id UUID
);

-- Create project_files table to store uploaded KML/shapefile data
CREATE TABLE public.project_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'kml' or 'shapefile'
  file_path TEXT NOT NULL,
  file_size INTEGER,
  geometry_data JSONB, -- Store parsed geometry data
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed BOOLEAN DEFAULT false
);

-- Create project_reports table to store analysis results
CREATE TABLE public.project_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  developability_score DECIMAL,
  constraint_analysis JSONB,
  report_status TEXT DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own projects" 
  ON public.projects 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" 
  ON public.projects 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
  ON public.projects 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
  ON public.projects 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for project_files
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view files for their projects" 
  ON public.project_files 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_files.project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can upload files to their projects" 
  ON public.project_files 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_files.project_id AND user_id = auth.uid()
  ));

-- Add RLS policies for project_reports
ALTER TABLE public.project_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reports for their projects" 
  ON public.project_reports 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_reports.project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create reports for their projects" 
  ON public.project_reports 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_reports.project_id AND user_id = auth.uid()
  ));

-- Create storage bucket for project files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-files', 'project-files', true);

-- Create storage policies
CREATE POLICY "Users can upload project files" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view project files" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);
