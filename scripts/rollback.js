#!/usr/bin/env node

/**
 * Rollback Script for Portfolio Deployment
 *
 * Provides automated rollback functionality for failed deployments
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class RollbackManager {
  constructor() {
    this.rollbackLog = [];
    this.startTime = Date.now();
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    console.log(logMessage);
    this.rollbackLog.push(logMessage);

    // Write to rollback log file
    const logDir = path.join(__dirname, '..', '.deployment');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    fs.appendFileSync(path.join(logDir, 'rollback.log'), logMessage + '\n');
  }

  async getCurrentBranch() {
    try {
      const branch = execSync('git branch --show-current', {
        encoding: 'utf8',
      }).trim();
      return branch;
    } catch (error) {
      throw new Error(`Failed to get current branch: ${error.message}`);
    }
  }

  async getLastStableBranch() {
    try {
      // Get list of deployment branches, sorted by most recent
      const branches = execSync('git branch -r --merged', {
        encoding: 'utf8',
      })
        .split('\n')
        .map(b => b.trim())
        .filter(b => b.includes('deploy-phase-'))
        .sort()
        .reverse();

      if (branches.length > 0) {
        return branches[0].replace('origin/', '');
      }

      // Fallback to main branch
      return 'main';
    } catch (error) {
      this.log(
        `Could not find deployment branches, using main: ${error.message}`,
        'warn'
      );
      return 'main';
    }
  }

  async createRollbackBackup() {
    this.log('Creating rollback backup...');

    try {
      const currentBranch = await this.getCurrentBranch();
      const backupBranch = `rollback-backup-${Date.now()}`;

      // Create backup branch
      execSync(`git checkout -b ${backupBranch}`, { stdio: 'inherit' });
      execSync(`git checkout ${currentBranch}`, { stdio: 'inherit' });

      this.log(`Backup created: ${backupBranch}`);
      return backupBranch;
    } catch (error) {
      throw new Error(`Failed to create rollback backup: ${error.message}`);
    }
  }

  async rollbackToStable(targetBranch = null) {
    this.log('🔄 Starting rollback process...');

    try {
      // Create backup first
      const backupBranch = await this.createRollbackBackup();

      // Determine target branch
      const target = targetBranch || (await this.getLastStableBranch());
      this.log(`Rolling back to: ${target}`);

      // Stash any uncommitted changes
      try {
        execSync('git stash push -m "rollback-stash"', { stdio: 'pipe' });
        this.log('Uncommitted changes stashed');
      } catch (error) {
        this.log('No changes to stash');
      }

      // Switch to target branch
      execSync(`git checkout ${target}`, { stdio: 'inherit' });

      // Pull latest changes if it's a remote branch
      try {
        execSync(`git pull origin ${target}`, { stdio: 'inherit' });
        this.log(`Pulled latest changes for ${target}`);
      } catch (error) {
        this.log(
          `Could not pull changes (branch may be local): ${error.message}`,
          'warn'
        );
      }

      this.log(`✅ Rollback completed. Now on branch: ${target}`);
      this.log(`💾 Backup branch created: ${backupBranch}`);

      return { success: true, target, backup: backupBranch };
    } catch (error) {
      this.log(`❌ Rollback failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async rollbackBuild() {
    this.log('🏗️ Rolling back build artifacts...');

    try {
      // Remove current build
      if (fs.existsSync('dist')) {
        fs.rmSync('dist', { recursive: true, force: true });
        this.log('Current build removed');
      }

      // Check for previous build backup
      const backupBuilds = fs
        .readdirSync('.')
        .filter(dir => dir.startsWith('dist-backup-'))
        .sort()
        .reverse();

      if (backupBuilds.length > 0) {
        const latestBackup = backupBuilds[0];
        fs.renameSync(latestBackup, 'dist');
        this.log(`Restored build from: ${latestBackup}`);
        return true;
      }

      // If no backup, rebuild from current branch
      this.log('No build backup found, rebuilding...');
      execSync('npm run build', { stdio: 'inherit' });
      this.log('Build recreated from current branch');

      return true;
    } catch (error) {
      throw new Error(`Failed to rollback build: ${error.message}`);
    }
  }

  async rollbackDependencies() {
    this.log('📦 Rolling back dependencies...');

    try {
      // Check if package-lock.json.backup exists
      if (fs.existsSync('package-lock.json.backup')) {
        fs.copyFileSync('package-lock.json.backup', 'package-lock.json');
        this.log('Restored package-lock.json from backup');
      }

      // Reinstall dependencies
      execSync('npm ci', { stdio: 'inherit' });
      this.log('Dependencies reinstalled');

      return true;
    } catch (error) {
      this.log(`Could not rollback dependencies: ${error.message}`, 'warn');
      // Don't fail rollback for dependency issues
      return true;
    }
  }

  async runHealthCheck() {
    this.log('🏥 Running post-rollback health check...');

    try {
      const HealthChecker = require('./health-check.js');
      const checker = new HealthChecker();
      const success = await checker.runAllChecks();

      if (success) {
        this.log('✅ Health check passed after rollback');
      } else {
        this.log('⚠️ Health check issues detected after rollback', 'warn');
      }

      return success;
    } catch (error) {
      this.log(`Health check failed: ${error.message}`, 'warn');
      return false;
    }
  }

  async fullRollback(options = {}) {
    const {
      targetBranch = null,
      rollbackBuild = true,
      rollbackDependencies = false,
      runHealthCheck = true,
    } = options;

    this.log('🚨 Starting full rollback procedure...');

    try {
      // 1. Rollback Git branch
      const gitResult = await this.rollbackToStable(targetBranch);

      // 2. Rollback build if requested
      if (rollbackBuild) {
        await this.rollbackBuild();
      }

      // 3. Rollback dependencies if requested
      if (rollbackDependencies) {
        await this.rollbackDependencies();
      }

      // 4. Run health check
      let healthCheckPassed = true;
      if (runHealthCheck) {
        healthCheckPassed = await this.runHealthCheck();
      }

      // Summary
      const endTime = Date.now();
      const duration = Math.round((endTime - this.startTime) / 1000);

      this.log(`\n📊 Rollback Summary:`);
      this.log(`🎯 Target Branch: ${gitResult.target}`);
      this.log(`💾 Backup Branch: ${gitResult.backup}`);
      this.log(`⏱️ Duration: ${duration} seconds`);
      this.log(
        `🏥 Health Check: ${healthCheckPassed ? 'Passed' : 'Issues detected'}`
      );

      if (healthCheckPassed) {
        this.log('🎉 Rollback completed successfully!', 'info');
      } else {
        this.log('⚠️ Rollback completed with warnings', 'warn');
      }

      return {
        success: true,
        target: gitResult.target,
        backup: gitResult.backup,
        healthCheckPassed,
        duration,
      };
    } catch (error) {
      this.log(`💥 Rollback procedure failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async listAvailableTargets() {
    this.log('📋 Available rollback targets:');

    try {
      // Get deployment branches
      const deployBranches = execSync('git branch -a', { encoding: 'utf8' })
        .split('\n')
        .map(b => b.trim().replace('remotes/origin/', ''))
        .filter(b => b.includes('deploy-phase-') || b === 'main')
        .sort();

      deployBranches.forEach((branch, index) => {
        console.log(`  ${index + 1}. ${branch}`);
      });

      return deployBranches;
    } catch (error) {
      this.log(`Could not list branches: ${error.message}`, 'error');
      return ['main'];
    }
  }

  generateRollbackReport() {
    const report = {
      timestamp: new Date().toISOString(),
      duration: Math.round((Date.now() - this.startTime) / 1000),
      logs: this.rollbackLog,
    };

    const reportPath = path.join(
      __dirname,
      '..',
      '.deployment',
      'rollback-report.json'
    );
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    this.log(`Rollback report generated: ${reportPath}`);
    return report;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const rollback = new RollbackManager();

  try {
    switch (command) {
      case 'full':
        const targetBranch = args.includes('--target')
          ? args[args.indexOf('--target') + 1]
          : null;

        await rollback.fullRollback({
          targetBranch,
          rollbackBuild: !args.includes('--no-build'),
          rollbackDependencies: args.includes('--dependencies'),
          runHealthCheck: !args.includes('--no-health-check'),
        });
        break;

      case 'git':
        const target = args[1] || null;
        await rollback.rollbackToStable(target);
        break;

      case 'build':
        await rollback.rollbackBuild();
        break;

      case 'list':
        await rollback.listAvailableTargets();
        break;

      default:
        console.log(`
Portfolio Rollback Manager

Usage: node rollback.js <command> [options]

Commands:
  full [--target <branch>] [--no-build] [--dependencies] [--no-health-check]
    Perform complete rollback (git + build + health check)
    
  git [target-branch]
    Rollback git branch only
    
  build
    Rollback build artifacts only
    
  list
    List available rollback targets

Examples:
  node rollback.js full                    # Full rollback to last stable
  node rollback.js full --target main      # Full rollback to main branch
  node rollback.js git deploy-phase-5      # Git rollback to phase 5
  node rollback.js build                   # Build rollback only
  node rollback.js list                    # Show rollback options
        `);
        break;
    }
  } catch (error) {
    console.error(`Rollback failed: ${error.message}`);
    process.exit(1);
  } finally {
    rollback.generateRollbackReport();
  }
}

if (require.main === module) {
  main();
}

module.exports = RollbackManager;
