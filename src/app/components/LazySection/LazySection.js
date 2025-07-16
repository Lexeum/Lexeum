'use client';
import { lazy, Suspense } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LazySection({ importFn }) {
  const [Component, setComponent] = useState(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView && !Component) {
      importFn().then((mod) => {
        setComponent(() => mod.default);
      });
    }
  }, [inView, importFn, Component]);

  return (
    <div ref={ref}>
      {Component && (
        <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Component />
          </motion.div>
        </Suspense>
      )}
    </div>
  );
}