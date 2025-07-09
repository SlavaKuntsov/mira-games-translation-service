import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
	component: () => (
		<div className=''>
			<div className='py-3 px-4 flex gap-2 text-xl'>
				<Link to='/' className='[&.active]:font-bold'>
					Home
				</Link>{' '}
				<Link to='/admin' className='[&.active]:font-bold'>
					Admin
				</Link>
			</div>
			<hr />
			<div className='p-4'>
				<Outlet />
			</div>
			<TanStackRouterDevtools />
		</div>
	),
});
