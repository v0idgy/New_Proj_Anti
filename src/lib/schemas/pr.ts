import { z } from 'zod';

export const CreatePRSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  repository: z.enum(['frontend-core', 'api-gateway', 'data-pipeline']),
  branch: z
    .string()
    .min(3, 'Branch name must be at least 3 characters')
    .regex(/^[a-z0-9._/-]+$/, 'Branch name must follow git slug format (e.g., feat/auth-fix)'),
  targetBranch: z.enum(['main', 'master', 'develop']),
  authorId: z.string().min(1, 'Please select a PR author'),
  reviewerIds: z
    .array(z.string())
    .min(1, 'At least one reviewer must be assigned')
    .max(3, 'A maximum of 3 reviewers can be assigned'),
  linesAdded: z.number().int().min(1, 'Lines added must be at least 1'),
  linesDeleted: z.number().int().min(0, 'Lines deleted cannot be negative'),
});

export type CreatePRFormValues = z.infer<typeof CreatePRSchema>;
