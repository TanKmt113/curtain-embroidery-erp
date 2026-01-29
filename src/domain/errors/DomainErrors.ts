// Re-export all domain errors for convenient importing
export {
  DomainError,
  ValidationError,
  EntityNotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from './index';

// Alias for convenience
export { EntityNotFoundError as NotFoundError } from './index';
