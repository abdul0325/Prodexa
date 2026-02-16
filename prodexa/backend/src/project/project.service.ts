import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class ProjectService {
    constructor(private prisma: PrismaService) { }

    async createProject(userId: string, data: {
        name: string;
        repoUrl: string;
        ownerName: string;
    }) {
        return this.prisma.project.create({
            data: {
                name: data.name,
                repoUrl: data.repoUrl,
                ownerName: data.ownerName,
                userId,
            },
        });
    }

    async getUserProjects(userId: string) {
        return this.prisma.project.findMany({
            where: { userId },
        });
    }



    async analyzeProject(userId: string, projectId: string) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project || project.userId !== userId) {
            throw new Error('Project not found');
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        const token = user?.passwordHash;

        const [owner, repo] = project.repoUrl.split('github.com/')[1].split('/');

        const commits = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/commits`,
            { headers: { Authorization: `token ${token}` } }
        );

        const pulls = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/pulls?state=all`,
            { headers: { Authorization: `token ${token}` } }
        );

        const issues = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/issues?state=all`,
            { headers: { Authorization: `token ${token}` } }
        );

        const contributors = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/contributors`,
            { headers: { Authorization: `token ${token}` } }
        );

        const activity = await this.prisma.projectActivity.create({
            data: {
                commitFrequency: commits.data.length,
                pullRequestCount: pulls.data.length,
                issueCount: issues.data.length,
                contributorCount: contributors.data.length,
                activityTimestamp: new Date(),
                projectId,
            },
        });

        return activity;
    }

}
