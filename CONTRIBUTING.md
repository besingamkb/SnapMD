# Contributing to SnapMD

Thank you for your interest in contributing to SnapMD! We welcome all types of contributions, from bug reports and feature requests to code changes and documentation improvements.

## Development Setup

To get started with development, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/besingamkb/SnapMD.git
    cd SnapMD
    ```

2.  **Install dependencies:**
    We use `pnpm` for package management. Ensure you have it installed, then run:
    ```bash
    pnpm install
    ```

3.  **Open in VS Code:**
    ```bash
    code .
    ```

## Project Structure

- `src/extension.ts`: The main entry point for the extension.
- `src/commands/`: Implementation of VS Code commands.
- `src/markdown/`: Markdown parsing and rendering logic.
- `src/pdf/`: PDF generation using Headless Chromium.
- `src/webview/`: Live preview panel implementation.
- `src/test/`: Automated tests.

## Development Workflow

### Running and Debugging

1.  Press `F5` in VS Code to start a new "Extension Development Host" window with SnapMD loaded.
2.  Open any Markdown file in the new window to test the extension's features.
3.  You can set breakpoints in the source code to debug the extension.

### Scripts

- `pnpm run compile`: Compiles the extension using Webpack.
- `pnpm run watch`: Compiles the extension in watch mode.
- `pnpm run lint`: Runs ESLint to check for code style issues.
- `pnpm test`: Runs the automated test suite.
- `pnpm run package`: Packages the extension into a `.vsix` file.

## Pull Request Process

1.  **Check for existing issues:** Before starting work, check the [issue tracker](https://github.com/besingamkb/SnapMD/issues) to see if someone else is already working on the same thing.
2.  **Create a branch:** Create a new branch for your changes (e.g., `feature/awesome-new-thing` or `fix/broken-pdf-export`).
3.  **Make your changes:** Follow the existing code style and ensure your changes are well-documented.
4.  **Add tests:** If you're adding a new feature or fixing a bug, please add a corresponding test case in `src/test/`.
5.  **Run checks:** Before submitting your PR, ensure that linting, type-checking, and tests all pass:
    ```bash
    pnpm run lint
    pnpm exec tsc -p . --noEmit
    pnpm test
    ```
6.  **Submit the PR:** Provide a clear description of your changes and why they are necessary. Link to any related issues.

## Community

If you have questions or need help, feel free to open a [discussion](https://github.com/besingamkb/SnapMD/discussions) or reach out to the maintainers.

Happy coding!
