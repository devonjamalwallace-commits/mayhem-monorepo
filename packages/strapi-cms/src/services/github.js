'use strict';

/**
 * GitHub Integration Service
 * Manage repositories, issues, and automation via GitHub API
 */

const { Octokit } = require('@octokit/rest');

let githubClient = null;

function getClient() {
  if (!githubClient) {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }

    githubClient = new Octokit({ auth: token });
  }
  return githubClient;
}

module.exports = {
  /**
   * Get authenticated user
   */
  async getAuthenticatedUser() {
    const octokit = getClient();
    const { data } = await octokit.users.getAuthenticated();
    return data;
  },

  /**
   * List repositories
   */
  async listRepositories(options = {}) {
    const octokit = getClient();

    const { data } = await octokit.repos.listForAuthenticatedUser({
      sort: options.sort || 'updated',
      direction: options.direction || 'desc',
      per_page: options.perPage || 30,
      page: options.page || 1,
    });

    return data;
  },

  /**
   * Get repository
   */
  async getRepository(owner, repo) {
    const octokit = getClient();
    const { data } = await octokit.repos.get({ owner, repo });
    return data;
  },

  /**
   * List repository issues
   */
  async listIssues(owner, repo, options = {}) {
    const octokit = getClient();

    const { data } = await octokit.issues.listForRepo({
      owner,
      repo,
      state: options.state || 'open',
      labels: options.labels,
      sort: options.sort || 'created',
      direction: options.direction || 'desc',
      per_page: options.perPage || 30,
      page: options.page || 1,
    });

    return data;
  },

  /**
   * Create an issue
   */
  async createIssue(owner, repo, { title, body, labels = [], assignees = [] }) {
    const octokit = getClient();

    const { data } = await octokit.issues.create({
      owner,
      repo,
      title,
      body,
      labels,
      assignees,
    });

    return data;
  },

  /**
   * Create a bug report issue from Strapi error
   */
  async createBugReport(owner, repo, { error, context, siteId }) {
    const body = `## Bug Report

**Site:** ${siteId}
**Timestamp:** ${new Date().toISOString()}

### Error Details
\`\`\`
${error.message || error}
\`\`\`

${error.stack ? `### Stack Trace\n\`\`\`\n${error.stack}\n\`\`\`` : ''}

### Context
\`\`\`json
${JSON.stringify(context, null, 2)}
\`\`\`

---
*This issue was automatically created by Strapi CMS*
`;

    return this.createIssue(owner, repo, {
      title: `[Bug] ${error.message?.substring(0, 100) || 'Error occurred'}`,
      body,
      labels: ['bug', 'automated'],
    });
  },

  /**
   * List pull requests
   */
  async listPullRequests(owner, repo, options = {}) {
    const octokit = getClient();

    const { data } = await octokit.pulls.list({
      owner,
      repo,
      state: options.state || 'open',
      sort: options.sort || 'created',
      direction: options.direction || 'desc',
      per_page: options.perPage || 30,
      page: options.page || 1,
    });

    return data;
  },

  /**
   * Get file contents
   */
  async getFileContents(owner, repo, path, ref = 'main') {
    const octokit = getClient();

    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });

    if (data.type === 'file' && data.content) {
      return {
        ...data,
        decodedContent: Buffer.from(data.content, 'base64').toString('utf8'),
      };
    }

    return data;
  },

  /**
   * Create or update file
   */
  async createOrUpdateFile(owner, repo, path, { content, message, branch = 'main', sha }) {
    const octokit = getClient();

    // If sha is not provided, try to get existing file
    let existingSha = sha;
    if (!existingSha) {
      try {
        const existing = await this.getFileContents(owner, repo, path, branch);
        existingSha = existing.sha;
      } catch (error) {
        // File doesn't exist, that's okay
      }
    }

    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      branch,
      sha: existingSha,
    });

    return data;
  },

  /**
   * Create a release
   */
  async createRelease(owner, repo, { tag, name, body, draft = false, prerelease = false }) {
    const octokit = getClient();

    const { data } = await octokit.repos.createRelease({
      owner,
      repo,
      tag_name: tag,
      name,
      body,
      draft,
      prerelease,
    });

    return data;
  },

  /**
   * Trigger workflow dispatch
   */
  async triggerWorkflow(owner, repo, workflowId, ref = 'main', inputs = {}) {
    const octokit = getClient();

    await octokit.actions.createWorkflowDispatch({
      owner,
      repo,
      workflow_id: workflowId,
      ref,
      inputs,
    });

    return { triggered: true };
  },

  /**
   * Get repository deployment status
   */
  async getDeployments(owner, repo, options = {}) {
    const octokit = getClient();

    const { data } = await octokit.repos.listDeployments({
      owner,
      repo,
      environment: options.environment,
      per_page: options.perPage || 10,
    });

    return data;
  },
};
