"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

type MapModalProps = {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  address: string;
  mapQuery: string; // Google Maps query
};

export default function MapModal({
  isOpen,
  onClose,
  name,
  address,
  mapQuery,
}: MapModalProps) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery
  )}`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    mapQuery
  )}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="relative bg-white rounded-2xl w-[90%] max-w-3xl p-6 shadow-xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <h3 className="text-2xl font-bold text-green-700 mb-1">{name}</h3>
            <p className="text-gray-600 mb-4">{address}</p>

            {/* Map */}
            <div className="w-full h-[350px] rounded-lg overflow-hidden border mb-4">
              <iframe
                title={`${name} Location`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  mapQuery
                )}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                variant="outline"
                className="border-green-600 text-green-600"
                asChild
              >
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin className="w-4 h-4 mr-2" />
                  Open in Google Maps
                </a>
              </Button>

              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
