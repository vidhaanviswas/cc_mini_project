const Docker = require('dockerode');
const axios = require('axios');
const ContainerPool = require('./pool');

class DockerExecutor {
  constructor() {
    this.timeout = 10000;
    this.pool = new ContainerPool();
    this.technology = 'docker';
  }

  async executeFunction(code, language, input, timeout = this.timeout, functionId = '') {
    const startTime = Date.now();
    let memoryUsage = 0;
    let container;

    try {
      let imageName;
      switch (language.toLowerCase()) {
        case 'python':
          imageName = 'python:3.9-slim';
          break;
        case 'javascript':
          imageName = 'node:16-slim';
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }

      container = await this.pool.getContainer(imageName);
      await container.start();

      // Get container stats for memory usage
      const stats = await container.stats({ stream: false });
      memoryUsage = stats.memory_stats.usage || 0;

      const exec = await container.exec({
        Cmd: this.getExecutionCommand(language, code),
        AttachStdout: true,
        AttachStderr: true
      });

      const timeoutId = setTimeout(async () => {
        try {
          await container.stop();
          console.log('Container stopped due to timeout');
        } catch (err) {
          console.error('Error stopping container:', err);
        }
      }, timeout);

      const stream = await exec.start({ hijack: true, stdin: true });
      
      stream.write(input + '\n');
      stream.end();

      let output = '';
      await new Promise((resolve, reject) => {
        container.modem.demuxStream(stream, process.stdout, process.stderr);
        
        stream.on('data', (chunk) => {
          output += chunk.toString();
        });

        stream.on('end', resolve);
        stream.on('error', reject);
      });

      clearTimeout(timeoutId);
      this.pool.releaseContainer(container);

      const endTime = Date.now();
      const executionTime = (endTime - startTime) / 1000;

      await this.sendMetrics({
        functionId,
        executionTime,
        memoryUsage,
        success: true,
        technology: this.technology
      });

      return { success: true, output };
    } catch (error) {
      const endTime = Date.now();
      const executionTime = (endTime - startTime) / 1000;

      await this.sendMetrics({
        functionId,
        executionTime,
        memoryUsage,
        success: false,
        technology: this.technology,
        error: error.message
      });

      if (container) {
        try {
          await container.stop();
          await container.remove();
          this.pool.pool = this.pool.pool.filter(c => c.container.id !== container.id);
        } catch (err) {
          console.error('Error cleaning up failed container:', err);
        }
      }
      return { success: false, error: error.message };
    }
  }

  async sendMetrics(metrics) {
    try {
      await axios.post('http://backend:5000/api/metrics', metrics);
    } catch (err) {
      console.error('Failed to send metrics:', err.message);
    }
  }

  getExecutionCommand(language, code) {
    switch (language.toLowerCase()) {
      case 'python':
        return ['python', '-c', code];
      case 'javascript':
        return ['node', '-e', code];
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }
}

class GVisorExecutor {
  constructor() {
    this.timeout = 10000;
    this.pool = new ContainerPool();
    this.technology = 'gvisor';
  }

  async executeFunction(code, language, input, timeout = this.timeout, functionId = '') {
    const startTime = Date.now();
    let memoryUsage = 0;
    let container;

    try {
      let imageName;
      switch (language.toLowerCase()) {
        case 'python':
          imageName = 'python:3.9-slim';
          break;
        case 'javascript':
          imageName = 'node:16-slim';
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }

      container = await this.pool.getContainer(imageName, {
        HostConfig: {
          Runtime: 'runsc'
        }
      });
      await container.start();

      // Get container stats for memory usage
      const stats = await container.stats({ stream: false });
      memoryUsage = stats.memory_stats.usage || 0;

      const exec = await container.exec({
        Cmd: this.getExecutionCommand(language, code),
        AttachStdout: true,
        AttachStderr: true
      });

      const timeoutId = setTimeout(async () => {
        try {
          await container.stop();
          console.log('Container stopped due to timeout');
        } catch (err) {
          console.error('Error stopping container:', err);
        }
      }, timeout);

      const stream = await exec.start({ hijack: true, stdin: true });
      
      stream.write(input + '\n');
      stream.end();

      let output = '';
      await new Promise((resolve, reject) => {
        container.modem.demuxStream(stream, process.stdout, process.stderr);
        
        stream.on('data', (chunk) => {
          output += chunk.toString();
        });

        stream.on('end', resolve);
        stream.on('error', reject);
      });

      clearTimeout(timeoutId);
      this.pool.releaseContainer(container);

      const endTime = Date.now();
      const executionTime = (endTime - startTime) / 1000;

      await this.sendMetrics({
        functionId,
        executionTime,
        memoryUsage,
        success: true,
        technology: this.technology
      });

      return { success: true, output };
    } catch (error) {
      const endTime = Date.now();
      const executionTime = (endTime - startTime) / 1000;

      await this.sendMetrics({
        functionId,
        executionTime,
        memoryUsage,
        success: false,
        technology: this.technology,
        error: error.message
      });

      if (container) {
        try {
          await container.stop();
          await container.remove();
          this.pool.pool = this.pool.pool.filter(c => c.container.id !== container.id);
        } catch (err) {
          console.error('Error cleaning up failed container:', err);
        }
      }
      return { success: false, error: error.message };
    }
  }

  async sendMetrics(metrics) {
    try {
      await axios.post('http://backend:5000/api/metrics', metrics);
    } catch (err) {
      console.error('Failed to send metrics:', err.message);
    }
  }

  getExecutionCommand(language, code) {
    switch (language.toLowerCase()) {
      case 'python':
        return ['python', '-c', code];
      case 'javascript':
        return ['node', '-e', code];
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }
}

class FunctionExecutor {
  constructor(technology = 'docker') {
    switch (technology.toLowerCase()) {
      case 'docker':
        this.executor = new DockerExecutor();
        break;
      case 'gvisor':
        this.executor = new GVisorExecutor();
        break;
      default:
        throw new Error(`Unsupported technology: ${technology}`);
    }
  }

  executeFunction(code, language, input, timeout, functionId) {
    return this.executor.executeFunction(code, language, input, timeout, functionId);
  }
}

module.exports = FunctionExecutor;