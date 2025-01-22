// lib/dataService.ts
import { Daylily } from '@/types/daylily';
import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';
import path from 'path';

export class DataService {
    private octokit: Octokit;
    private owner: string;
    private repo: string;
    private branch: string;
    private publicJsonlPath: string;
    private imagesDir: string;

    constructor() {
        this.octokit = new Octokit({ auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN });
        this.owner = process.env.NEXT_PUBLIC_GITHUB_OWNER!;
        this.repo = process.env.NEXT_PUBLIC_GITHUB_REPO!;
        this.branch = 'main';
        this.publicJsonlPath = 'public/data/varieties.jsonl';
        this.imagesDir = 'public/images/daylilies';
    }

    async addVariety(variety: Daylily): Promise<void> {
        try {
            // Download image
            const imagePath = await this.downloadImage(variety);

            // Update variety with local image path
            const updatedVariety = {
                ...variety,
                image_url: imagePath
            };

            // Add to public JSONL
            await this.appendToJsonl(updatedVariety);

            // Commit changes
            await this.commitChanges([
                {
                    path: this.publicJsonlPath,
                    content: await fs.readFile(this.publicJsonlPath, 'utf8')
                },
                {
                    path: `public${imagePath}`,
                    content: await fs.readFile(`public${imagePath}`, { encoding: 'base64' }),
                    encoding: 'base64'
                }
            ], `Add daylily: ${variety.name}`);

        } catch (error) {
            console.error('Error adding variety:', error);
            throw error;
        }
    }

    async removeVariety(name: string): Promise<void> {
        try {
            const content = await fs.readFile(this.publicJsonlPath, 'utf8');
            const varieties = content
                .split('\n')
                .filter(line => line.trim())
                .map(line => JSON.parse(line));

            const varietyToRemove = varieties.find(v => v.name === name);
            if (!varietyToRemove) return;

            // Remove from JSONL
            const updatedVarieties = varieties.filter(v => v.name !== name);
            const updatedContent = updatedVarieties
                .map(v => JSON.stringify(v))
                .join('\n') + '\n';

            await fs.writeFile(this.publicJsonlPath, updatedContent);

            // Remove image
            const imagePath = `public${varietyToRemove.image_url}`;
            try {
                await fs.unlink(imagePath);
            } catch (error) {
                console.warn('Image not found:', imagePath);
            }

            // Commit changes
            await this.commitChanges([
                {
                    path: this.publicJsonlPath,
                    content: updatedContent
                }
            ], `Remove daylily: ${name}`);

        } catch (error) {
            console.error('Error removing variety:', error);
            throw error;
        }
    }

    private async downloadImage(variety: Daylily): Promise<string> {
        const response = await fetch(variety.image_url);
        if (!response.ok) throw new Error(`Failed to download image: ${variety.image_url}`);

        const buffer = Buffer.from(await response.arrayBuffer());
        const filename = `${variety.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
        const localPath = `/images/daylilies/${filename}`;

        await fs.mkdir(this.imagesDir, { recursive: true });
        await fs.writeFile(`public${localPath}`, buffer);

        return localPath;
    }

    private async appendToJsonl(variety: Daylily): Promise<void> {
        const line = JSON.stringify(variety) + '\n';
        await fs.appendFile(this.publicJsonlPath, line);
    }

    private async commitChanges(
        files: Array<{
            path: string;
            content: string;
            encoding?: 'utf-8' | 'base64'
        }>,
        message: string
    ): Promise<void> {
        try {
            // Get latest commit
            const ref = await this.octokit.git.getRef({
                owner: this.owner,
                repo: this.repo,
                ref: `heads/${this.branch}`
            });

            // Create blobs
            const blobs = await Promise.all(
                files.map(file =>
                    this.octokit.git.createBlob({
                        owner: this.owner,
                        repo: this.repo,
                        content: file.content,
                        encoding: file.encoding || 'utf-8'
                    })
                )
            );

            // Create tree
            const tree = await this.octokit.git.createTree({
                owner: this.owner,
                repo: this.repo,
                base_tree: ref.data.object.sha,
                tree: files.map((file, index) => ({
                    path: file.path,
                    mode: '100644',
                    type: 'blob',
                    sha: blobs[index].data.sha
                }))
            });

            // Create commit
            const commit = await this.octokit.git.createCommit({
                owner: this.owner,
                repo: this.repo,
                message,
                tree: tree.data.sha,
                parents: [ref.data.object.sha]
            });

            // Update reference
            await this.octokit.git.updateRef({
                owner: this.owner,
                repo: this.repo,
                ref: `heads/${this.branch}`,
                sha: commit.data.sha
            });

        } catch (error) {
            console.error('Error committing changes:', error);
            throw error;
        }
    }
}