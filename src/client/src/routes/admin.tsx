import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin')({
	component: About,
});

function About() {
	return <div className='p-2'>Hello from About!</div>;
}
