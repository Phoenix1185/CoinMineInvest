export function isUnauthorizedError(error: Error): boolean {
  return error.message.includes('401') || error.message.includes('Not authenticated') || error.message.includes('Unauthorized');
}