import { motion } from 'framer-motion';
import { Card, CardContent, CardTitle, CardDescription } from './card'
import { AspectRatio } from './aspect-ratio'

type ProjectCardProps = {
  title: string;
  description: string;
  image: string;
  link: string;
  tags?: string[];
  delay?: number;
};

const ProjectCard = ({ title, description, image, link, tags = [], delay = 0 }: ProjectCardProps) => {
    return (
      <motion.a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true, amount: 0.2 }}
        className="block w-full"
      >
        <Card className="overflow-hidden min-h-[500px] shadow-xl backdrop-blur-sm bg-[#fff7ed] dark:bg-slate-800/80 transition-shadow duration-300">
          <AspectRatio ratio={16 / 9}>
            <img
              src={image}
              alt={`${title} screenshot`}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </AspectRatio>
          <CardContent className="p-6 flex flex-col justify-between h-full bg-[#294EA2]">
            <div>
              <CardTitle className="text-xl text-white dark:text-white mb-2">{title}</CardTitle>
              <CardDescription className="text-sm text-slate-200 dark:text-slate-300 mb-4">
                {description}
              </CardDescription>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-cyan-100 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-100 text-xs font-medium px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
        </CardContent>
        </Card>
      </motion.a>
    )
}

export default ProjectCard;
