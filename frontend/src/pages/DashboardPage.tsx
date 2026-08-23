import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ServiceCard, AppointmentCard } from "@/components/ui/Card";

const services = [
  {
    name: "Signature Haircut & Style",
    durationMinutes: 45,
    price: 65,
    description: "Precision cut, wash, and blow-dry finish tailored to you.",
  },
  {
    name: "Balayage Color",
    durationMinutes: 120,
    price: 180,
    description: "Hand-painted highlights for a soft, sun-kissed look.",
  },
  {
    name: "Gel Manicure",
    durationMinutes: 40,
    price: 45,
    description: "Long-lasting gel polish with cuticle care and hand massage.",
  },
];

const appointments = [
  { clientName: "Ava Thompson", service: "Balayage Color", time: "10:00 AM", status: "confirmed" as const },
  { clientName: "Maya Patel", service: "Signature Haircut", time: "11:30 AM", status: "pending" as const },
  { clientName: "Liam Chen", service: "Gel Manicure", time: "1:15 PM", status: "confirmed" as const },
  { clientName: "Sofia Reyes", service: "Signature Haircut", time: "3:00 PM", status: "cancelled" as const },
];

export function DashboardPage() {
  return (
    <DashboardLayout>
      <section>
        <h2 className="font-display text-2xl text-charcoal-50">
          Services
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.name} {...service} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-charcoal-50">
          Today&apos;s appointments
        </h2>
        <div className="mt-4 space-y-3">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.clientName} {...appointment} />
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
