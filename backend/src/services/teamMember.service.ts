import { ApiError } from '@/utils/ApiError';
import { TeamMemberModel, ITeamMember } from '@/models/TeamMember';
import { HTTP_STATUS } from '@/constants';

export const teamMemberService = {
  async getTeamMembers(): Promise<ITeamMember[]> {
    return TeamMemberModel.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
  },

  async getActiveTeamMembers(): Promise<ITeamMember[]> {
    return TeamMemberModel.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 }).lean();
  },

  async createTeamMember(data: Partial<ITeamMember>): Promise<ITeamMember> {
    const member = await TeamMemberModel.create(data);
    return member;
  },

  async updateTeamMember(id: string, data: Partial<ITeamMember>): Promise<ITeamMember> {
    const member = await TeamMemberModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();

    if (!member) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Team member not found');
    }

        return member;
  },

  async deleteTeamMember(id: string): Promise<ITeamMember> {
    const member = await TeamMemberModel.findByIdAndDelete(id).lean();
    if (!member) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Team member not found');
    }

        return member;
  },
};
