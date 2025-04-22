const Docker = require('dockerode');
const docker = new Docker();

class ContainerPool {
  constructor(maxSize = 5) {
    this.maxSize = maxSize;
    this.pool = [];
    this.activeContainers = 0;
  }

  async getContainer(imageName) {
    // Return a container from pool if available
    for (let i = 0; i < this.pool.length; i++) {
      const containerInfo = this.pool[i];
      if (containerInfo.image === imageName && !containerInfo.inUse) {
        containerInfo.inUse = true;
        this.activeContainers++;
        return containerInfo.container;
      }
    }

    // Create new container if pool not full
    if (this.pool.length < this.maxSize) {
      const container = await docker.createContainer({
        Image: imageName,
        Tty: true,
        OpenStdin: true
      });
      
      const containerInfo = {
        container,
        image: imageName,
        inUse: true
      };
      
      this.pool.push(containerInfo);
      this.activeContainers++;
      return container;
    }

    throw new Error('Container pool exhausted');
  }

  releaseContainer(container) {
    const containerInfo = this.pool.find(c => c.container.id === container.id);
    if (containerInfo) {
      containerInfo.inUse = false;
      this.activeContainers--;
    }
  }

  async cleanup() {
    for (const containerInfo of this.pool) {
      try {
        await containerInfo.container.stop();
        await containerInfo.container.remove();
      } catch (err) {
        console.error('Error cleaning up container:', err);
      }
    }
    this.pool = [];
    this.activeContainers = 0;
  }
}

module.exports = ContainerPool;