import { API_URL } from "../../../config";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, X } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  youtubeUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

const getYoutubeThumbnail = (url?: string) => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`
    : "";
};

export function VideoSection() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/cms/videos`)
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(console.error);
  }, []);

  return (
    <section className="py-24 bg-stone-950 text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-xl">
            <span className="text-orange-500 font-medium tracking-wider text-sm uppercase mb-3 block">
              Video Showcase
            </span>
            <h2 className="text-4xl font-serif font-bold text-white mb-4">
              Lihat Lebih Dekat
            </h2>
            <p className="text-stone-400">Tonton video proses pembuatan dan review langsung dari pelanggan kami.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group cursor-pointer relative"
              onClick={() => setActiveVideo(video)}
            >
              <div className="aspect-video bg-stone-800 rounded-3xl overflow-hidden relative mb-4">
                <img 
                  src={video.thumbnailUrl || (video.videoUrl ? '' : getYoutubeThumbnail(video.youtubeUrl))} 
                  alt={video.title}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${video.videoUrl ? 'opacity-30' : 'opacity-80 group-hover:opacity-100'}`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#b89341] rounded-full flex items-center justify-center pl-1 shadow-lg shadow-[#b89341]/40 group-hover:scale-110 transition-transform">
                    <Play className="text-white fill-white" size={24} />
                  </div>
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#b89341] transition-colors">{video.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>
            <div className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden relative">
              {activeVideo.videoUrl ? (
                <video 
                  src={activeVideo.videoUrl.startsWith('http') ? activeVideo.videoUrl : `${API_URL}${activeVideo.videoUrl}`} 
                  className="w-full h-full" 
                  controls
                  autoPlay
                  controlsList="nodownload"
                />
              ) : activeVideo.youtubeUrl ? (
                <iframe
                  src={
                    activeVideo.youtubeUrl.includes('drive.google.com')
                      ? activeVideo.youtubeUrl.replace('/view', '/preview').split('?')[0]
                      : activeVideo.youtubeUrl.includes('watch?v=')
                      ? activeVideo.youtubeUrl.replace('watch?v=', 'embed/') + '?autoplay=1'
                      : activeVideo.youtubeUrl + '?autoplay=1'
                  }
                  title={activeVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
