import dotenv from "dotenv";

dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { Service } from "./models/Service";

const services = [
  {
    title: "Signature Balayage",
    description:
      "Hand-painted brilliance tailored to your natural movement and bone structure for a sun-kissed, lived-in finish.",
    duration: "2h 30m",
    price: 350,
    category: "Colour",
  },
  {
    title: "Precision Cut & Style",
    description:
      "Architectural shapes that evolve with your lifestyle. Consultation, cut, and a finished blow-dry.",
    duration: "1h 15m",
    price: 120,
    category: "Cut & Style",
  },
  {
    title: "Gloss & Tone",
    description:
      "Luminous shine with semi-permanent depth. The perfect refresh between full-colour appointments.",
    duration: "45 min",
    price: 90,
    category: "Colour",
  },
  {
    title: "Restorative Bond Therapy",
    description:
      "Molecular repair for compromised hair — rebuilds strength, elasticity, and softness from within.",
    duration: "1h",
    price: 95,
    category: "Treatment",
  },
  {
    title: "Silk Press",
    description:
      "A sleek, mirror-smooth press with lightweight body and movement that lasts, without chemical relaxers.",
    duration: "1h 45m",
    price: 130,
    category: "Cut & Style",
  },
  {
    title: "Scalp Renewal Ritual",
    description:
      "Exfoliating cleanse, lymphatic massage, and a nourishing mask to reset the scalp and encourage growth.",
    duration: "50 min",
    price: 75,
    category: "Treatment",
  },
  {
    title: "Bridal & Event Styling",
    description:
      "A bespoke upstyle or blow-out for your occasion, with an optional trial session beforehand.",
    duration: "2h",
    price: 210,
    category: "Occasion",
  },
  {
    title: "Colour Correction",
    description:
      "Specialist multi-step work to undo previous colour and rebuild a healthy, even base. Priced from.",
    duration: "3h 30m",
    price: 420,
    category: "Colour",
  },
];

const seed = async () => {
  try {
    await connectDB();

    const existing = await Service.estimatedDocumentCount();

    if (existing > 0) {
      console.log(`Skipped: ${existing} service(s) already exist.`);
    } else {
      const inserted = await Service.insertMany(services);
      console.log(`Seeded ${inserted.length} services.`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seed();
