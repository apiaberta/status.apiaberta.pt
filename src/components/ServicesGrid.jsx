import ServiceCard from './ServiceCard';

export default function ServicesGrid({ services }) {
  if (!services || services.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
        Services
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <ServiceCard key={service.prefix || service.name} service={service} />
        ))}
      </div>
    </div>
  );
}
