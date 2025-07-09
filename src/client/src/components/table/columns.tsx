'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import type { Language, Translation } from '@/types/table-types';
import { IconDotsVertical } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { TableCell } from '@/components/ui/table';
import { DataTableColumnHeader } from './data-table-column-header';

const languageTitles: Record<Language, string> = {
	ru: 'Russian',
	en: 'English',
	tr: 'Turkish',
};

export function columnsFactory(
	langs: Language[],
	onDeleteRow: (id: string) => void,
	onEditCell: (id: string, field: Language | 'key', value: string) => void
): ColumnDef<Translation>[] {
	return [
		{
			accessorKey: 'key',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title='Key' />
			),
			cell: ({ row }) => (
				<Input
					className='w-full bg-transparent outline-none border border-transparent focus:border-gray-300 px-2 py-1 rounded-sm'
					defaultValue={row.original.key}
					onBlur={e =>
						onEditCell(row.original.id.toString(), 'key', e.target.value)
					}
					placeholder='Key'
				/>
			),
		},
		...langs.map<ColumnDef<Translation>>(lang => ({
			accessorFn: row => row.translations[lang],
			id: lang,
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={languageTitles[lang]} />
			),
			cell: ({ row }) => {
				const value = row.original.translations[lang];
				return (
					<Input
						className='w-full bg-transparent outline-none border border-transparent focus:border-gray-300 px-2 py-1 rounded-sm'
						defaultValue={value}
						onBlur={e =>
							onEditCell(row.original.id.toString(), lang, e.target.value)
						}
						placeholder='Translation'
					/>
				);
			},
		})),
		{
			id: 'actions',
			cell: ({ row }) => (
				<TableCell className='!px-0 text-right'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
								size='icon'
							>
								<IconDotsVertical />
								<span className='sr-only'>Open menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-32'>
							{/* <DropdownMenuSeparator /> */}
							<DropdownMenuItem
								variant='destructive'
								onClick={() => onDeleteRow(row.original.id.toString())}
							>
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</TableCell>
			),
		},
	];
}
