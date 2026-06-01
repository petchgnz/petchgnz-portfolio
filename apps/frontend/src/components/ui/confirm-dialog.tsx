import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  isPending?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  onConfirm,
  isPending = false,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='pointer-events-none'>{title}</AlertDialogTitle>
          <AlertDialogDescription className='pointer-events-none'>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} className='cursor-pointer' >Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer'
          >
            {isPending ? 'Deleting...' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
