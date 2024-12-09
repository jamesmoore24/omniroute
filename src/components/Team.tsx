import React from "react";
import { Linkedin, Globe } from "lucide-react";
import founder1Image from "../assets/images/casey_picture.jpeg";
import founder2Image from "../assets/images/james_picture.jpg";
import csailLogo from "../assets/images/csail_logo.png";
import gelLogo from "../assets/images/gel_logo.png";
import martinLogo from "../assets/images/martin_trust_center_logo.png";
import eecsLogo from "../assets/images/mit_eecs_logo.png";
import mitLogo from "../assets/images/mit_logo.png";
import sloanLogo from "../assets/images/mit_sloan_logo.png";
import metaLogo from "../assets/images/meta-logo-top-big.png";

const founders = [
  {
    name: "Casey Tewey",
    role: "Co-founder, CEO",
    linkedin: "tewey",
    email: "casey.tewey@gmail.com",
    website: "https://caseytewey.com",
    image: founder1Image,
    logos: [mitLogo, sloanLogo, gelLogo, martinLogo],
  },
  {
    name: "James Moore",
    role: "Co-founder, CTO",
    linkedin: "james-moore-a931811b7",
    email: "jame.moore24@gmail.com",
    website: "https://jmoore.info",
    image: founder2Image,
    logos: [mitLogo, sloanLogo, eecsLogo, metaLogo],
  },
];

export function Team() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {founders.map((founder) => (
            <div
              key={founder.name}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
            >
              <img
                src={founder.image}
                alt={founder.name}
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold">{founder.name}</h3>
              <p className="text-gray-600 mb-2">{founder.role}</p>
              <div className="flex items-center space-x-4">
                <a
                  href={`https://linkedin.com/in/${founder.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Linkedin className="w-5 h-5 mr-1" />
                  LinkedIn
                </a>
                <a
                  href={`mailto:${founder.email}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Email
                </a>
                <a
                  href={founder.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Globe className="w-5 h-5 mr-1" />
                  Website
                </a>
              </div>
              <div className="mt-4 grid  gap-4">
                {founder.logos.map((logo) => (
                  <div className="flex justify-center">
                    <img
                      key={logo} // Added key for each logo
                      src={logo}
                      alt={`${founder.name} Logo`}
                      className="h-auto max-h-12 w-auto" // Maintain aspect ratio
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
