#!/usr/bin/env node

/**
 * Phased Deployment Script for 3D Interactive Portfolio
 *
 * This script manages the incremental deployment of portfolio phases,
 * ensuring stability and proper feature rollout.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Phase configuration mapping
const PHASE_CONFIG = {
  1: {
    name: 'Core 3D Infrastructure',
    branch: 'phase-1-infrastructure-setup',
    components: [
      'src/components/3d/Infrastructure3D.tsx',
      'src/components/3d/Scene3D.tsx',
      'src/hooks/useWebGL.ts',
      'src/utils/webglDetection.ts',
      'src/utils/performanceMonitor.ts',
    ],
    buildCommand: 'npm run build:phase-1',
    testCommand: 'npm run test:phase-1',
    critical: true,
  },
  2: {
    name: 'Interactive Objects Foundation',
    branch: 'phase-2-interactive-objects',
    components: [
      'src/components/3d/InteractiveObject.tsx',
      'src/components/3d/ObjectManager.tsx',
      'src/components/3d/PositioningUtils.tsx',
      'src/components/3d/Tooltip.tsx',
      'src/components/3d/VisualFeedback.tsx',
    ],
    buildCommand: 'npm run build:phase-2',
    testCommand: 'npm run test:phase-2',
    dependencies: [1],
  },
  3: {
    name: 'Camera Controls & Navigation',
    branch: 'phase-3-camera-controls',
    components: [
      'src/components/3d/CameraControls.tsx',
      'src/hooks/useCamera.ts',
      'src/utils/keyboardNavigation.ts',
    ],
    buildCommand: 'npm run build:phase-3',
    testCommand: 'npm run test:phase-3',
    dependencies: [1, 2],
  },
  4: {
    name: 'Room Layout & Environment',
    branch: 'phase-4-room-layout',
    components: [
      'src/components/3d/room',
      'src/components/3d/furniture',
      'src/utils/spatialUtils.ts',
    ],
    buildCommand: 'npm run build:phase-4',
    testCommand: 'npm run test:phase-4',
    dependencies: [1, 2, 3],
  },
  5: {
    name: 'Basic Lighting System',
    branch: 'phase-5-lighting',
    components: [
      'src/components/3d/lighting/LightingSystem.tsx',
      'src/components/3d/lighting/ShadowSystem.tsx',
    ],
    buildCommand: 'npm run build:phase-5',
    testCommand: 'npm run test:phase-5',
    dependencies: [1, 2, 3, 4],
  },
  6: {
    name: 'Materials, Textures & LOD',
    branch: 'phase-6-materials-lod',
    components: [
      'src/components/3d/materials',
      'src/components/3d/LODManager.tsx',
      'src/utils/lodConfigurations.ts',
      'src/utils/assetLoader.ts',
    ],
    buildCommand: 'npm run build:phase-6',
    testCommand: 'npm run test:phase-6',
    dependencies: [1, 2, 3, 4, 5],
  },
  7: {
    name: 'Transitions & Animations',
    branch: 'phase-7-transitions-animations',
    components: [
      'src/components/3d/transitions',
      'src/components/3d/animations',
      'src/hooks/useTransition.ts',
    ],
    buildCommand: 'npm run build:phase-7',
    testCommand: 'npm run test:phase-7',
    dependencies: [1, 2, 3, 4, 5, 6],
  },
  8: {
    name: 'Accessibility & Mobile Optimization',
    branch: 'phase-8-accessibility-mobile',
    components: [
      'src/components/accessibility',
      'src/components/3d/MobileScene3D.tsx',
      'src/hooks/useMobile.ts',
      'src/hooks/useAccessibility.ts',
    ],
    buildCommand: 'npm run build:phase-8',
    testCommand: 'npm run test:phase-8',
    dependencies: [1, 2, 3, 4, 5, 6, 7],
  },
  9: {
    name: 'SEO & Analytics Integration',
    branch: 'phase-9-seo-analytics',
    components: [
      'src/components/seo',
      'src/components/analytics',
      'src/utils/seoManager.ts',
      'src/utils/analyticsManager.ts',
    ],
    buildCommand: 'npm run build:phase-9',
    testCommand: 'npm run test:phase-9',
    dependencies: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  10: {
    name: 'Visual Enhancements & Effects',
    branch: 'phase-10-visual-enhancements-polish',
    components: [
      'src/components/3d/effects',
      'src/components/3d/audio',
      'src/components/3d/lighting/AdvancedLighting.tsx',
    ],
    buildCommand: 'npm run build:phase-10',
    testCommand: 'npm run test:phase-10',
    dependencies: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  11: {
    name: 'Error Handling & Final Optimization',
    branch: 'phase-11-completed',
    components: [
      'src/components/3d/Scene3DErrorBoundary.tsx',
      'src/components/3d/Scene3DFallback.tsx',
      'src/utils/performanceOptimizer.ts',
    ],
    buildCommand: 'npm run build',
    testCommand: 'npm run test',
    dependencies: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    final: true,
  },
};

class PhaseDeployer {
  constructor() {
    this.currentPhase = null;
    this.deploymentLog = [];
    this.startTime = Date.now();
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    console.log(logMessage);
    this.deploymentLog.push(logMessage);

    // Write to deployment log file
    fs.appendFileSync(
      path.join(__dirname, '..', '.deployment', 'deployment.log'),
      logMessage + '\n'
    );
  }

  async validateDependencies(phase) {
    this.log(`Validating dependencies for Phase ${phase}...`);

    const config = PHASE_CONFIG[phase];
    if (!config.dependencies) return true;

    for (const depPhase of config.dependencies) {
      const depConfig = PHASE_CONFIG[depPhase];
      this.log(`Checking dependency: Phase ${depPhase} (${depConfig.name})`);

      // Check if dependency phase components exist
      for (const component of depConfig.components) {
        const componentPath = path.join(__dirname, '..', component);
        if (!fs.existsSync(componentPath)) {
          throw new Error(`Dependency component missing: ${component}`);
        }
      }
    }

    this.log('All dependencies validated successfully');
    return true;
  }

  async validateComponents(phase) {
    this.log(`Validating components for Phase ${phase}...`);

    const config = PHASE_CONFIG[phase];
    const missingComponents = [];

    for (const component of config.components) {
      const componentPath = path.join(__dirname, '..', component);
      if (!fs.existsSync(componentPath)) {
        missingComponents.push(component);
      }
    }

    if (missingComponents.length > 0) {
      throw new Error(`Missing components: ${missingComponents.join(', ')}`);
    }

    this.log(
      `All ${config.components.length} components validated successfully`
    );
    return true;
  }

  async createDeploymentBranch(phase) {
    const config = PHASE_CONFIG[phase];
    const deployBranch = `deploy-phase-${phase}`;

    this.log(`Creating deployment branch: ${deployBranch}`);

    try {
      // Create new deployment branch
      execSync(`git checkout -b ${deployBranch}`, { stdio: 'inherit' });

      // Merge from source branch if different
      if (config.branch !== deployBranch) {
        this.log(`Merging from source branch: ${config.branch}`);
        execSync(`git merge ${config.branch} --no-edit`, { stdio: 'inherit' });
      }

      this.log(`Deployment branch ${deployBranch} created successfully`);
      return deployBranch;
    } catch (error) {
      throw new Error(`Failed to create deployment branch: ${error.message}`);
    }
  }

  async runTests(phase) {
    const config = PHASE_CONFIG[phase];
    this.log(`Running tests for Phase ${phase}...`);

    try {
      execSync(config.testCommand, { stdio: 'inherit' });
      this.log('All tests passed successfully');
      return true;
    } catch (error) {
      throw new Error(`Tests failed for Phase ${phase}: ${error.message}`);
    }
  }

  async buildPhase(phase) {
    const config = PHASE_CONFIG[phase];
    this.log(`Building Phase ${phase}...`);

    try {
      execSync(config.buildCommand, { stdio: 'inherit' });
      this.log('Build completed successfully');
      return true;
    } catch (error) {
      throw new Error(`Build failed for Phase ${phase}: ${error.message}`);
    }
  }

  async deployToStaging(phase) {
    this.log(`Deploying Phase ${phase} to staging environment...`);

    try {
      // Simulate staging deployment
      execSync('npm run deploy:staging', { stdio: 'inherit' });
      this.log('Staging deployment completed successfully');
      return true;
    } catch (error) {
      throw new Error(`Staging deployment failed: ${error.message}`);
    }
  }

  async runHealthChecks(phase) {
    this.log(`Running health checks for Phase ${phase}...`);

    // Basic health checks
    const checks = [
      {
        name: 'Build artifacts exist',
        check: () => fs.existsSync('dist/index.html'),
      },
      { name: 'Assets compiled', check: () => fs.existsSync('dist/assets') },
      {
        name: 'Source maps generated',
        check: () => fs.existsSync('dist/assets/index-*.js.map'),
      },
    ];

    for (const check of checks) {
      try {
        const result = check.check();
        if (result) {
          this.log(`✅ ${check.name}`);
        } else {
          throw new Error(`❌ ${check.name}`);
        }
      } catch (error) {
        throw new Error(`Health check failed: ${check.name}`);
      }
    }

    this.log('All health checks passed');
    return true;
  }

  async deployPhase(phase) {
    this.currentPhase = phase;
    const config = PHASE_CONFIG[phase];

    this.log(`🚀 Starting deployment for Phase ${phase}: ${config.name}`);

    try {
      // 1. Validate dependencies
      await this.validateDependencies(phase);

      // 2. Validate components
      await this.validateComponents(phase);

      // 3. Create deployment branch
      await this.createDeploymentBranch(phase);

      // 4. Run tests
      await this.runTests(phase);

      // 5. Build phase
      await this.buildPhase(phase);

      // 6. Run health checks
      await this.runHealthChecks(phase);

      // 7. Deploy to staging
      await this.deployToStaging(phase);

      this.log(`✅ Phase ${phase} deployment completed successfully!`);
      return true;
    } catch (error) {
      this.log(
        `❌ Phase ${phase} deployment failed: ${error.message}`,
        'error'
      );

      // Attempt rollback
      await this.rollback(phase);
      throw error;
    }
  }

  async rollback(phase) {
    this.log(`🔄 Initiating rollback for Phase ${phase}...`, 'warn');

    try {
      // Switch back to previous stable branch
      if (phase > 1) {
        const previousBranch = `deploy-phase-${phase - 1}`;
        execSync(`git checkout ${previousBranch}`, { stdio: 'inherit' });
        this.log(`Rolled back to ${previousBranch}`);
      } else {
        execSync('git checkout main', { stdio: 'inherit' });
        this.log('Rolled back to main branch');
      }
    } catch (error) {
      this.log(`Rollback failed: ${error.message}`, 'error');
    }
  }

  async deployAll() {
    this.log('🚀 Starting full phased deployment...');

    for (let phase = 1; phase <= 11; phase++) {
      try {
        await this.deployPhase(phase);
        this.log(
          `Phase ${phase} completed. Waiting 30 seconds before next phase...`
        );

        // Wait between phases for stability
        if (phase < 11) {
          await new Promise(resolve => setTimeout(resolve, 30000));
        }
      } catch (error) {
        this.log(`Deployment stopped at Phase ${phase} due to error.`, 'error');
        break;
      }
    }

    const endTime = Date.now();
    const duration = Math.round((endTime - this.startTime) / 1000);
    this.log(`🎉 Phased deployment completed in ${duration} seconds`);
  }

  generateDeploymentReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalPhases: 11,
      deployedPhases: this.currentPhase || 0,
      duration: Math.round((Date.now() - this.startTime) / 1000),
      logs: this.deploymentLog,
    };

    const reportPath = path.join(
      __dirname,
      '..',
      '.deployment',
      'deployment-report.json'
    );
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    this.log(`Deployment report generated: ${reportPath}`);
    return report;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const phase = parseInt(args[1]);

  const deployer = new PhaseDeployer();

  // Ensure deployment directory exists
  const deploymentDir = path.join(__dirname, '..', '.deployment');
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  try {
    switch (command) {
      case 'phase':
        if (!phase || phase < 1 || phase > 11) {
          console.error('Please specify a valid phase number (1-11)');
          process.exit(1);
        }
        await deployer.deployPhase(phase);
        break;

      case 'all':
        await deployer.deployAll();
        break;

      case 'validate':
        if (!phase || phase < 1 || phase > 11) {
          console.error('Please specify a valid phase number (1-11)');
          process.exit(1);
        }
        await deployer.validateComponents(phase);
        await deployer.validateDependencies(phase);
        console.log(`Phase ${phase} validation completed successfully`);
        break;

      default:
        console.log(`
Usage: node deploy-phase.js <command> [phase]

Commands:
  phase <number>  Deploy a specific phase (1-11)
  all            Deploy all phases sequentially
  validate <num> Validate phase components and dependencies

Examples:
  node deploy-phase.js phase 1     # Deploy Phase 1 only
  node deploy-phase.js all         # Deploy all phases
  node deploy-phase.js validate 5  # Validate Phase 5
        `);
        break;
    }
  } catch (error) {
    console.error(`Deployment failed: ${error.message}`);
    process.exit(1);
  } finally {
    deployer.generateDeploymentReport();
  }
}

if (require.main === module) {
  main();
}

module.exports = PhaseDeployer;
