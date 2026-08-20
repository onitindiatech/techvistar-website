import { adminFetch, publicFetch, getApiBaseUrl } from '@/lib/api';

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  profileImage: string;
  bio: string;
  email: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const response = await adminFetch(`${getApiBaseUrl()}/api/team`);
  const data = await response.json();
  return data.data;
};

export const getActiveTeamMembers = async (): Promise<TeamMember[]> => {
  const response = await publicFetch(`${getApiBaseUrl()}/api/team/active`);
  const data = await response.json();
  return data.data;
};

export const createTeamMember = async (member: Partial<TeamMember>): Promise<TeamMember> => {
  const response = await adminFetch(`${getApiBaseUrl()}/api/team`, {
    method: 'POST',
    body: JSON.stringify(member),
  });
  const data = await response.json();
  return data.data;
};

export const updateTeamMember = async ({ id, data: member }: { id: string; data: Partial<TeamMember> }): Promise<TeamMember> => {
  const response = await adminFetch(`${getApiBaseUrl()}/api/team/${id}`, {
    method: 'PUT',
    body: JSON.stringify(member),
  });
  const data = await response.json();
  return data.data;
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  await adminFetch(`${getApiBaseUrl()}/api/team/${id}`, { method: 'DELETE' });
};
