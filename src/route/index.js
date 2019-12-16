
import Home from '@/views/Home'
import Content from '@/views/Content'

const routes = [
    {
        path: "/",
        component: Home,
        routes: [
            { path: "/layout", component: Content }
        ]
    },

];

export default routes