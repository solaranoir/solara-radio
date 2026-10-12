import { useState } from 'react';
import { Info } from 'lucide-react';
import Modal from '../components/Modal';

export default function Widget({ title, description, customClass, nestedWidget, link, image }) {
  const [showModal, setShowModal] = useState(false);
  const isAboutMe = title === 'About Me';

  return (
    <div className={`solara-widget pb-1 ${isAboutMe ? "solara-about-widget" : ""}`}>
      {image && (
      <img
         src={image}
         alt={title}
         className="w-full max-h-[400px] object-contain rounded mb-4 mx-auto border border-persian-orange"
        />
      )}

      <h2 className="widget-heading">
        {link ? <a href={link}>{title}</a> : title}
      </h2>

      <div className="mb-4">
        {isAboutMe ? (
          <div className="bg-sage p-3 rounded-lg flex items-start justify-between space-x-4">
            <p className="font-sans text-gunmetal text-sm">
              Hi! I'm Kelly, otherwise known as KK7QEA. I’m a software developer and Extra class ham who enjoys portable ops and stargazing.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="text-gunmetal hover:text-persian-orange"
              aria-label="View Full Bio"
            >
              <Info size={24} />
            </button>
          </div>
        ) : (
          <p className="font-sans text-tan">{description}</p>
        )}
      </div>

      {nestedWidget && <div className="mt-4">{nestedWidget}</div>}

      {/* Full Modal */}
      {isAboutMe && showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="p-4 text-tan max-h-full overflow-y-auto">
            <h2 className="text-3xl font-heading mb-4 text-persian-orange">About Me - Full Bio</h2>
            <div className="space-y-4 font-sans text-base leading-relaxed">
              <p>Hi! I'm Kelly, otherwise known as KK7QEA. I have had an amateur radio license since December 2023, when I first started as a Technician, and I moved up to General in 2024 after building my first antenna—a simple 10M dipole that got me hooked. These days, I usually operate with a Xiegu G90 and an end-fed halfwave or random wire, depending on the setting.</p>
              <p>I’m a member of the Henderson Amateur Radio Club, and as of July 5, 2025, I hold an Extra class license. Lately, I’ve been spending more time on digital modes like FT8, where I enjoy the efficiency and reach of low-power contacts.</p>
              <p>I’m especially drawn to portable operations and try to activate parks whenever I can—POTA has become a favorite part of the hobby. I’ve even attempted a SOTA activation, though it ended up being more of a hike than a contact success.</p>
              <p>By day, I work as a software developer writing Python. Off the air, I enjoy hiking, gardening, art, music, stargazing, and time outdoors with my very curious dog.</p>
              <p>Hope to connect on the bands soon. 73!</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

