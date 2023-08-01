import { Container } from './lib/Container.js';

const container = new Container();

const { 'app.Blog': blog } = container.injector();

container.ready().then(() => {
    blog.post('Hello World');
});
