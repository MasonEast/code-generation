
import Home from '@/views/Home'
import Content from '@/views/Content';
import CreateForm from '@/views/CreateForm';

const routes = [
    {
        path: "/",
        component: Home,
        routes: [
            { path: "/layout", component: Content },
            { path: "/formCreater", component: CreateForm },
        ]
    },

];

export default routes