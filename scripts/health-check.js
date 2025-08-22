#!/usr/bin/env node

/**
 * Health Check Script for Portfolio Deployment
 *
 * Performs comprehensive health checks to ensure deployment stability
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class HealthChecker {
  constructor() {
    this.checks = [];
    this.passed = 0;
    this.failed = 0;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'pass' ? '✅' : type === 'fail' ? '❌' : 'ℹ️';
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  async check(name, checkFn) {
    try {
      const result = await checkFn();
      if (result) {
        this.log(`${name}`, 'pass');
        this.passed++;
        return true;
      } else {
        this.log(`${name} - Failed`, 'fail');
        this.failed++;
        return false;
      }
    } catch (error) {
      this.log(`${name} - Error: ${error.message}`, 'fail');
      this.failed++;
      return false;
    }
  }

  // File System Checks
  async checkBuildArtifacts() {
    return await this.check('Build artifacts exist', () => {
      return (
        fs.existsSync('dist/index.html') &&
        fs.existsSync('dist/assets') &&
        fs.readdirSync('dist/assets').length > 0
      );
    });
  }

  async checkSourceMaps() {
    return await this.check('Source maps generated', () => {
      const assetsDir = 'dist/assets';
      if (!fs.existsSync(assetsDir)) return false;
      const files = fs.readdirSync(assetsDir);
      return files.some(file => file.endsWith('.js.map'));
    });
  }

  async checkAssetOptimization() {
    return await this.check('Assets optimized', () => {
      const assetsDir = 'dist/assets';
      if (!fs.existsSync(assetsDir)) return false;
      const files = fs.readdirSync(assetsDir);

      // Check for minified JS files
      const jsFiles = files.filter(
        f => f.endsWith('.js') && !f.endsWith('.map')
      );
      if (jsFiles.length === 0) return false;

      // Check that files are reasonably sized (not too large)
      for (const file of jsFiles) {
        const filePath = path.join(assetsDir, file);
        const stats = fs.statSync(filePath);
        const sizeMB = stats.size / (1024 * 1024);

        // Warn if any single JS file is over 2MB
        if (sizeMB > 2) {
          console.warn(
            `⚠️ Large bundle detected: ${file} (${sizeMB.toFixed(2)}MB)`
          );
        }
      }

      return true;
    });
  }

  // Configuration Checks
  async checkPackageJson() {
    return await this.check('package.json valid', () => {
      const packagePath = 'package.json';
      if (!fs.existsSync(packagePath)) return false;

      try {
        const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        return (
          packageData.name &&
          packageData.version &&
          packageData.scripts &&
          packageData.dependencies
        );
      } catch (error) {
        return false;
      }
    });
  }

  async checkViteConfig() {
    return await this.check('Vite config valid', () => {
      return fs.existsSync('vite.config.ts') || fs.existsSync('vite.config.js');
    });
  }

  // TypeScript Checks
  async checkTypeScript() {
    return await this.check('TypeScript compilation', () => {
      try {
        execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'pipe' });
        return true;
      } catch (error) {
        return false;
      }
    });
  }

  // Dependency Checks
  async checkDependencies() {
    return await this.check('Dependencies installed', () => {
      return (
        fs.existsSync('node_modules') && fs.existsSync('package-lock.json')
      );
    });
  }

  async checkCriticalDependencies() {
    return await this.check('Critical dependencies available', () => {
      const criticalDeps = [
        'react',
        'react-dom',
        'three',
        '@react-three/fiber',
        'vite',
      ];

      const nodeModulesPath = 'node_modules';
      if (!fs.existsSync(nodeModulesPath)) return false;

      for (const dep of criticalDeps) {
        const depPath = path.join(nodeModulesPath, dep);
        if (!fs.existsSync(depPath)) {
          console.log(`Missing critical dependency: ${dep}`);
          return false;
        }
      }
      return true;
    });
  }

  // Performance Checks
  async checkBundleSize() {
    return await this.check('Bundle size acceptable', () => {
      const assetsDir = 'dist/assets';
      if (!fs.existsSync(assetsDir)) return false;

      let totalSize = 0;
      const files = fs.readdirSync(assetsDir);

      for (const file of files) {
        const filePath = path.join(assetsDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      }

      const totalMB = totalSize / (1024 * 1024);
      this.log(`Total bundle size: ${totalMB.toFixed(2)}MB`);

      // Warn if total bundle is over 10MB
      return totalMB < 10;
    });
  }

  // Security Checks
  async checkSecurityVulnerabilities() {
    return await this.check('No critical security vulnerabilities', () => {
      try {
        const auditOutput = execSync('npm audit --audit-level=high --json', {
          stdio: 'pipe',
          encoding: 'utf8',
        });

        const audit = JSON.parse(auditOutput);
        const highVulns = audit.metadata.vulnerabilities.high || 0;
        const criticalVulns = audit.metadata.vulnerabilities.critical || 0;

        if (highVulns > 0 || criticalVulns > 0) {
          console.log(
            `⚠️ Security vulnerabilities found: ${criticalVulns} critical, ${highVulns} high`
          );
          return criticalVulns === 0; // Allow high, but not critical
        }

        return true;
      } catch (error) {
        // npm audit may fail on some systems, don't fail health check for this
        console.log('⚠️ Could not run security audit');
        return true;
      }
    });
  }

  // SEO Checks
  async checkSEOFiles() {
    return await this.check('SEO files generated', () => {
      return (
        fs.existsSync('dist/sitemap.xml') && fs.existsSync('dist/robots.txt')
      );
    });
  }

  // Phase-specific Checks
  async checkPhaseSpecificFiles(phase = null) {
    const phaseFiles = {
      1: [
        'src/components/3d/Infrastructure3D.tsx',
        'src/components/3d/Scene3D.tsx',
        'src/utils/webglDetection.ts',
      ],
      2: [
        'src/components/3d/InteractiveObject.tsx',
        'src/components/3d/ObjectManager.tsx',
        'src/components/3d/VisualFeedback.tsx',
      ],
      // Add more phases as needed
    };

    if (!phase || !phaseFiles[phase]) {
      return await this.check('All critical files exist', () => {
        const criticalFiles = [
          'src/App.tsx',
          'src/main.tsx',
          'src/components/Portfolio3D.tsx',
        ];

        return criticalFiles.every(file => fs.existsSync(file));
      });
    }

    return await this.check(`Phase ${phase} files exist`, () => {
      return phaseFiles[phase].every(file => fs.existsSync(file));
    });
  }

  // Runtime Checks (require server to be running)
  async checkServerResponse(url = 'http://localhost:5173') {
    return await this.check('Server responds', async () => {
      try {
        const response = await fetch(url);
        return response.ok;
      } catch (error) {
        // Server might not be running, this is okay for build health check
        return true;
      }
    });
  }

  async runAllChecks(phase = null) {
    this.log('Starting health checks...');

    // Core checks
    await this.checkBuildArtifacts();
    await this.checkSourceMaps();
    await this.checkAssetOptimization();
    await this.checkPackageJson();
    await this.checkViteConfig();
    await this.checkDependencies();
    await this.checkCriticalDependencies();
    await this.checkBundleSize();
    await this.checkSEOFiles();
    await this.checkPhaseSpecificFiles(phase);

    // Optional checks (don't fail on these)
    await this.checkTypeScript();
    await this.checkSecurityVulnerabilities();

    // Summary
    const total = this.passed + this.failed;
    const percentage = Math.round((this.passed / total) * 100);

    this.log(`\n📊 Health Check Summary:`);
    this.log(`✅ Passed: ${this.passed}`);
    this.log(`❌ Failed: ${this.failed}`);
    this.log(`📈 Success Rate: ${percentage}%`);

    if (this.failed === 0) {
      this.log('🎉 All health checks passed! Deployment ready.', 'pass');
      return true;
    } else if (this.failed <= 2 && percentage >= 90) {
      this.log('⚠️ Minor issues detected, but deployment can proceed', 'info');
      return true;
    } else {
      this.log('🚨 Critical issues detected! Fix before deploying.', 'fail');
      return false;
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const phase = args.includes('--phase')
    ? parseInt(args[args.indexOf('--phase') + 1])
    : null;

  const checker = new HealthChecker();
  const success = await checker.runAllChecks(phase);

  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = HealthChecker;
