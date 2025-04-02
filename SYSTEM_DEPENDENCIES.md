# System Dependencies for Threat Dragon

This document lists the system-level dependencies required to run, build, or develop Threat Dragon. These are dependencies that cannot be installed through npm and must be installed separately on your system.

## Required System Dependencies

1. **Node.js and npm**
   - Required to run and build the application
   - Recommended version: Node.js 16.x or higher
   - Install from [nodejs.org](https://nodejs.org/)

2. **GraphViz**
   - Required for the `analyze-deps` script which generates dependency graphs
   - Used by the command: `dot -T svg`
   - Install instructions:
     - **Linux**: `sudo apt-get install graphviz`
     - **macOS**: `brew install graphviz`
     - **Windows**: Download installer from [GraphViz website](https://graphviz.org/download/)

## Optional System Dependencies

1. **Python 3**
   - Used by some build scripts for the desktop (Electron) application
   - Required when building the desktop version on some platforms
   - The build script references `PYTHON_PATH=python3`

## Notes for Server Deployment

When deploying Threat Dragon on a new server, ensure that:

1. All npm dependencies are installed (`npm install`)
2. The required system dependencies above are installed
3. No global npm packages are required - all necessary JavaScript dependencies are specified in package.json files

## Troubleshooting

If you encounter errors related to missing dependencies:

1. For errors about `dot` not being found: Install GraphViz
2. For errors about missing npm packages: Run `npm install` at the project root
3. For Python-related errors during desktop builds: Ensure Python 3 is installed and available in your PATH as `python3`