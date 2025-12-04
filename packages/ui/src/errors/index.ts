/**
 * Error Page Components
 *
 * @description
 * Pre-built error page components for common HTTP error states.
 *
 * @example
 * import { GeneralError, NotFoundError, ForbiddenError } from '@repo/ui/errors';
 *
 * // 500 Internal Server Error
 * <GeneralError />
 *
 * // 404 Not Found
 * <NotFoundError />
 *
 * // 403 Forbidden
 * <ForbiddenError />
 */

// HTTP Error Pages
export { ForbiddenError } from './forbidden';
export { GeneralError } from './general-error';
export { MaintenanceError } from './maintenance-error';
export { NotFoundError } from './not-found-error';
export { UnauthorisedError } from './unauthorized-error';
