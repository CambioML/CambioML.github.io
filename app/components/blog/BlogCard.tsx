'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/lib/markdown';
import FadeIn from '@/app/components/dark/animations/fade-in';

interface BlogCardProps {
  post: BlogPost;
  index: number;
  locale: string;
}

export function BlogCard({ post, index, locale }: BlogCardProps) {
  return (
    <FadeIn delay={0.02 * index}>
      <Link href={`/${locale}/blog/${post.slug}`} className="block h-full">
        <motion.div
          className="bg-card-1 border border-border-1 rounded-lg overflow-hidden h-full flex flex-col"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {post.image ? (
            <div className="relative w-full h-64">
              <Image src={post.image} alt={post.title} fill className="object-cover" />
            </div>
          ) : (
            <div className="relative w-full h-64 flex items-center justify-center p-6">
              <h2
                className="text-3xl font-semibold text-center"
                style={{
                  backgroundImage: 'linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(112, 190, 250) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {post.title}
              </h2>
            </div>
          )}

          <div className="p-5 flex-grow flex flex-col">
            <div className="text-sm text-gray-400 mb-2">
              {new Date(post.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">{post.title}</h3>

            <div className="flex-grow">
              <div className="text-gray-300 text-sm line-clamp-2">{post.excerpt}</div>
            </div>
          </div>
        </motion.div>
      </Link>
    </FadeIn>
  );
}
