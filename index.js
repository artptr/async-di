import { Container } from './Container.js';

const loader = serviceName => {
    return import(`./${serviceName.replaceAll('.', '/')}.js`).then(module => module.default);
};

const container = new Container(loader);
const { 'app.Blog': blog } = container.injector();
container.ready().then(() => {
    blog.post('Hello World');
});
