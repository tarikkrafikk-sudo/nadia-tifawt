import { Ornament } from './Ornament';

export default function PageHeaderClient({ title, children }) {
  return (
    <section className="relative overflow-hidden border-b border-gold-500/15 bg-[radial-gradient(ellipse_at_50%_20%,rgba(35,79,51,.35),transparent_70%)]">
      <div className="amazigh-pattern absolute inset-0" />
      <div className="container relative py-14 text-center">
        <h1 className="text-gold-metal font-serif text-5xl font-medium">{title}</h1>
        <Ornament className="mt-5" />
        {children}
      </div>
    </section>
  );
}
