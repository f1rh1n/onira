"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { predefinedAvatars, getAvatarUrl } from "@/lib/avatars";
import Image from "next/image";
import { FiX } from "react-icons/fi";

interface AvatarPickerProps {
  selectedAvatar?: string;
  onSelect: (avatarId: string) => void;
}

export default function AvatarPicker({ selectedAvatar, onSelect }: AvatarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(selectedAvatar || predefinedAvatars[0].id);

  const handleSelect = (avatarId: string) => {
    setCurrentAvatar(avatarId);
    onSelect(avatarId);
    setIsOpen(false);
  };

  const getCurrentAvatarData = () => {
    return predefinedAvatars.find(a => a.id === currentAvatar) || predefinedAvatars[0];
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Profile Avatar
      </label>
      <div
        onClick={() => setIsOpen(true)}
        className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500/30 hover:border-purple-500 transition cursor-pointer relative group"
      >
        <img
          src={getAvatarUrl(getCurrentAvatarData().seed, getCurrentAvatarData().style)}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <span className="text-white text-xs">Change</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Choose Your Avatar</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition"
                  >
                    <FiX className="text-gray-400" size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                  {predefinedAvatars.map((avatar) => (
                    <motion.button
                      key={avatar.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelect(avatar.id)}
                      className={`
                        relative w-full aspect-square rounded-full overflow-hidden border-4 transition
                        ${currentAvatar === avatar.id
                          ? 'border-purple-500 ring-4 ring-purple-500/30'
                          : 'border-transparent hover:border-purple-500/50'
                        }
                      `}
                    >
                      <img
                        src={getAvatarUrl(avatar.seed, avatar.style)}
                        alt={avatar.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>

                <p className="text-gray-500 text-sm mt-6 text-center">
                  Select an avatar that represents you
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
