// Debug entry point
import { createApp, h } from 'vue';

// Create a minimal test app
const DebugApp = {
  data() {
    return {
      message: 'Debug App - Vue Module System Working',
      count: 0
    };
  },
  methods: {
    increment() {
      this.count++;
    }
  },
  render() {
    return h('div', { style: { padding: '20px', maxWidth: '800px', margin: '0 auto' } }, [
      h('h1', this.message),
      h('button', { onClick: this.increment }, `Count: ${this.count}`),
      h('p', 'If you can see this, the Vue ESM bundling is working correctly.'),
      h('p', 'The problem is likely with a specific component or plugin in the main app.')
    ]);
  }
};

console.log('Debug app - Creating Vue app instance');
try {
  const app = createApp(DebugApp);
  console.log('Debug app - Mounting to #app');
  app.mount('#app');
  console.log('Debug app - Successfully mounted');
} catch (error) {
  console.error('Debug app - Error mounting:', error);
  document.getElementById('error-container').textContent = 'Debug mount error: ' + error.message;
  document.getElementById('error-container').style.display = 'block';
}