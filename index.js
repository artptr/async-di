import { Container } from './lib/Container.js';

Container.run(injector => {
    const { 'app.Blog': blog } = injector;

    blog.post('Hello World');
});
