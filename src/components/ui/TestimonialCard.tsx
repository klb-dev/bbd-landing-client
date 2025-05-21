import { Card, CardContent, CardDescription, CardTitle } from "./card";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { motion } from "framer-motion";

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  logo?: string;
  avatar?: string;
};

type TestimonialCardProps = {
  testimonial: Testimonial;
  index: number;
};

const TestimonialCard = ({ testimonial, index }: TestimonialCardProps) => {
  const { name, role, quote, avatar, logo } = testimonial;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.5 }}
      viewport={{ once: true, amount: 0.2 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-xl backdrop-blur-sm bg-white/90 dark:bg-slate-800/80">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                {avatar ? (
                  <AvatarImage src={avatar} alt={name} />
                ) : (
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <CardTitle className="text-base text-gray-800 dark:text-white">{name}</CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">{role}</CardDescription>
              </div>
            </div>
            {logo && (
              <img src={logo} alt={`${name} logo`} className="h-8 w-auto opacity-80" />
            )}
          </div>
          <blockquote className="text-sm text-gray-700 dark:text-gray-300 italic">
            “{quote}”
          </blockquote>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;
