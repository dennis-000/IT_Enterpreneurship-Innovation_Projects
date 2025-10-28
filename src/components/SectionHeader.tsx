interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({ title, subtitle, centered = true }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      <h2 className="text-4xl md:text-5xl font-bold text-royal-800 mb-4 animate-slide-up">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in">
          {subtitle}
        </p>
      )}
      <div className={`w-24 h-1 bg-gradient-to-r from-tomato-500 to-tomato-600 mt-4 ${centered ? 'mx-auto' : ''}`} />
    </div>
  );
}
