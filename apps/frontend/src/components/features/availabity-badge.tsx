import { motion } from 'framer-motion';

function AvailabilityBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 1 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className='inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5'
    >
      <span className='relative flex size-2'>
        <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75' />
        <span className='relative inline-flex size-2 rounded-full bg-green-500' />
      </span>

      <span className='text-xs font-medium text-primary'>
        Available for work
      </span>
    </motion.div>
  );
}

export default AvailabilityBadge;