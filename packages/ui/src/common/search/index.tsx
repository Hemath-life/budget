/**
 * Search module exports.
 *
 * This module re-exports all named exports from the search-context module,
 * providing a centralized entry point for search-related functionality.
 *
 * @module Search
 */
import { Search } from './search';
import { SearchProvider, useSearch } from './search-context';

export { SearchProvider, useSearch, Search };
