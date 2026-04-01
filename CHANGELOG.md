# Changelog

All notable changes to this project are documented in this file.

## [1.1.0] - 2026-04-01

### Added
- Astro v6 support in peer dependency range.
- Explicit compatibility note for Astro v4/v5/v6 in README.

### Changed
- Improved `site` hostname handling to support Astro config values provided as either a string or `URL`.
- Switched build output directory resolution to `fileURLToPath` for robust path handling.
