import { useCallback, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import { CourierExperience, TourBusExperience } from './components/Experiences';
import { Tracking, Testimonials } from './components/Engagement';
import { ServiceSplit, HowItWorks, WhyChooseUs, Gallery, FinalCTA, Footer } from './components/Sections';
import BookingModal from './components/BookingModal';
import { useCinematicMotion } from './lib/motion';
import type { BookingRequest } from './lib/types';

export default function App() {
  const [booking, setBooking] = useState<BookingRequest | null>(null);
  const [bookingKey, setBookingKey] = useState(0);

  useCinematicMotion();

  const openBooking = useCallback((req: BookingRequest) => {
    setBookingKey((k) => k + 1);
    setBooking(req);
  }, []);

  const closeBooking = useCallback(() => setBooking(null), []);

  const goToTracking = useCallback(() => {
    setBooking(null);
    window.setTimeout(() => document.querySelector('#track')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <Nav onBook={(kind) => openBooking({ kind })} />
      <main>
        <Hero onBook={openBooking} />
        <ServiceSplit onBook={openBooking} />
        <CourierExperience onBook={openBooking} />
        <TourBusExperience onBook={openBooking} />
        <HowItWorks />
        <WhyChooseUs />
        <Tracking />
        <Testimonials />
        <Gallery />
        <FinalCTA onBook={openBooking} />
      </main>
      <Footer onBook={openBooking} />
      {booking && (
        <BookingModal key={bookingKey} request={booking} onClose={closeBooking} onTrack={goToTracking} />
      )}
    </div>
  );
}
