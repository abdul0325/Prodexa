/* eslint-disable prettier/prettier */
export enum GithubWebhookEvent {
    PUSH = 'push',
    PULL_REQUEST = 'pull_request',
    ISSUES = 'issues',
    PULL_REQUEST_REVIEW = 'pull_request_review',
    RELEASE = 'release',
    CREATE = 'create',
    DELETE = 'delete',
}