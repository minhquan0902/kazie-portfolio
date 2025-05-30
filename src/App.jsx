/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import {
  ChevronUp,
  ChevronDown,
  Menu,
  X,
  Github,
  Linkedin,
  Instagram,
  Twitter,
  ExternalLink,
  Camera,
  Palette,
} from "lucide-react";

// Font Face Declarations
const fontStyles = `
  @font-face {
    font-family: 'Cardo99s';
    src: url('/designs/Fonts/Cardo99s.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  
  @font-face {
    font-family: 'Dream-Avenue';
    src: url('/designs/Fonts/FontsFree-Net-Dream-Avenue.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
`;

const scrollStyles = `
  @media (max-width: 768px) {
    section[id] {
      scroll-margin-top: 80px;
    }
  }
`;
// Add font styles to document head
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.innerHTML = fontStyles + scrollStyles;
  document.head.appendChild(styleElement);
}

// Smooth scroll polyfill for iOS Safari
if (!("scrollBehavior" in document.documentElement.style)) {
  const smoothScrollTo = (targetY, duration = 500) => {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const startTime = performance.now();

    const animation = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const ease =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      window.scrollTo(0, startY + distance * ease);

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  // Override window.scrollTo for smooth behavior
  const originalScrollTo = window.scrollTo;
  window.scrollTo = (options) => {
    if (
      options &&
      typeof options === "object" &&
      options.behavior === "smooth"
    ) {
      smoothScrollTo(options.top || 0);
    } else {
      originalScrollTo.apply(window, arguments);
    }
  };
}
// Custom hook for preloading images
function useImagePreloader(imageUrls) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    const imagePromises = [];

    imageUrls.forEach((url) => {
      const promise = new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          if (!isCancelled) {
            resolve(url);
          }
        };
        img.onerror = () => {
          console.error(`Failed to preload image: ${url}`);
          resolve(url); // Resolve anyway to not block other images
        };
        img.src = url;
      });
      imagePromises.push(promise);
    });

    // Track loading progress
    let loadedCount = 0;
    imagePromises.forEach((promise) => {
      promise.then(() => {
        loadedCount++;
        if (!isCancelled) {
          setLoadingProgress((loadedCount / imageUrls.length) * 100);
        }
      });
    });

    // Wait for all images to load
    Promise.all(imagePromises).then(() => {
      if (!isCancelled) {
        setImagesLoaded(true);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [imageUrls]);

  return { imagesLoaded, loadingProgress };
}

// Grain Overlay Component
function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 opacity-30"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        mixBlendMode: "multiply",
      }}
    />
  );
}

// 3D Animated Sphere Component with new colors
function AnimatedSphere() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1.5, 100, 200]} scale={1.5}>
        <MeshDistortMaterial
          color="#000000"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

// Scroll Indicator Component
function ScrollIndicator({ onClick }) {
  return (
    <motion.div
      className="hidden md:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      onClick={onClick}
    >
      <motion.div
        className="flex flex-col items-center space-y-2"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Mouse Icon with Scroll Wheel */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-6 h-10 border-2 border-black rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-black rounded-full mt-2"
              animate={{
                y: [0, 8, 0],
                opacity: [1, 0.3, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Chevron Down Icon */}
        <motion.div
          animate={{
            y: [0, 5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        >
          <ChevronDown size={20} className="text-black" />
        </motion.div>

        {/* Scroll Text */}
        <motion.p
          className="text-black/70 text-sm tracking-wider"
          style={{ fontFamily: "Cardo99s" }}
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          SCROLL
        </motion.p>

        {/* Animated Dots */}
        <motion.div className="flex flex-col space-y-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-1 h-1 bg-black rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Navigation Menu Component
function Navigation({ scrollToSection }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    "Experience",
    "Professional Communication",
    "Personal Design",
    "Photography",
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-[#fffff7]/90 backdrop-blur-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-full mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          {/* <motion.div
            className="text-2xl font-bold text-black hidden md:block"
            style={{ fontFamily: "Dream-Avenue" }}
            whileHover={{ scale: 1.05 }}
          >
            Kazie
          </motion.div> */}

          {/* Desktop Menu */}
          <div className="hidden md:flex w-full">
            <div className="flex justify-evenly items-center w-full border-2 border-black rounded-full px-8 py-3 mx-4">
              {menuItems.map((item) => (
                <motion.button
                  key={item}
                  onClick={() =>
                    scrollToSection(item.toLowerCase().replace(" ", "-"))
                  }
                  className="text-black hover:opacity-70 transition-opacity duration-300"
                  style={{ fontFamily: "Dream-Avenue", fontSize: "1.4rem" }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-black"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-[#fffff7]/95 backdrop-blur-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {menuItems.map((item) => (
              <motion.button
                key={item}
                onClick={() => {
                  setTimeout(() => {
                    scrollToSection(item.toLowerCase().replace(" ", "-"));
                  }, 150);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-black hover:bg-black/5"
                style={{ fontFamily: "Dream-Avenue" }}
                whileHover={{ x: 10 }}
              >
                {item}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// Hero Section with new gradient
function HeroSection({ scrollToSection }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const handleScrollDown = () => {
    scrollToSection("experience");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fffff7] pt-20 md:pt-0">
      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-4"
        style={{ y, opacity }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          {/* Portrait - Left Side */}
          <motion.div
            className="flex-shrink-0"
            initial={{ scale: 0, x: -50 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src="/designs/IMG_4510.JPG"
              alt="Kazie Nguyen"
              className="w-48 md:w-64 h-48 md:h-90 rounded-full border-4 border-black shadow-2xl object-cover"
            />
          </motion.div>

          {/* Text Content - Right Side */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
              {/* Title Section */}
              <motion.div
                className="text-center md:text-left"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h1
                  className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
                  style={{ fontFamily: "Dream-Avenue" }}
                >
                  <span className="text-black">Kazie</span>
                  <br />
                  <span className="text-black">Nguyen's</span>
                  <br />
                  <span className="text-black">Portfolio</span>
                </h1>
              </motion.div>

              {/* Divider - Horizontal on mobile, vertical on desktop */}
              <motion.div
                className="w-full h-px md:w-px md:h-auto bg-black self-center md:self-stretch"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />

              {/* Description */}
              <motion.div
                className="flex-1 flex items-center justify-center h-full"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <p
                  className="text-base md:text-xl text-black/80 text-center md:text-left"
                  style={{ fontFamily: "Cardo99s" }}
                >
                  My name is Khanh Vy,
                  <br />
                  freely call me Kazie.
                  <br />
                  <br />
                  I'm driven by a passion for beauty and an endless curiosity to
                  discover new ideas. Creativity has always guided my path to
                  craft engaging content for communication.
                  <br />
                  <br />
                  For me, true creativity is not just about capturing attention
                  at first glance; it's about embedding meaningful messages that
                  resonate deeply with audiences.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <ScrollIndicator onClick={handleScrollDown} />
    </section>
  );
}

// Experience Section
function ExperienceSection() {
  const experiences = [
    {
      title: "RMIT University",
      period: "2024-2027",
      description: "Bachelor of Professional Communication",
      link: "https://www.rmit.edu.vn/",
      details: [],
    },
    {
      title: "NHH Photography Club",
      period: "2021-2025",
      description: "Photographer - Mentor/ Core team member",
      link: "https://www.facebook.com/NHHPTG",
      details: [
        "Built and maintained detailed project plans and task lists covering ideation, budgeting, styling, props, and logistics.",
        "Led an 8-member team to deliver the award-winning TeTrad Project; managed agenda, timeline, and budget sheets while tracking progress and driving contributions.",
        "Demonstrated strong time-management and conflict-resolution skills.",
        "Directed visual production for external events: Gấu Uniform Collaboration (2023), 'Chơi Chất-Chất Chơi' Rock Show, 'Hội Chợ Dân Gian – Nghe Hay Ha' (2024), and multiple yearbook projects.",
        "Produced the Yearbook Album for Sugie Band.",
        "Mentoring the next generation, planning event agendas, and scheduling team meetings.",
      ],
    },
    {
      title: "InnoEx 2024",
      period: "8/2024",
      description: "Media Collaborator",
      link: "https://innoex.vn/",
      details: [
        "Photographed every event zone.",
        "Curated and edited images for on-time posts on the official page.",
        "Directed visitors to exhibition areas and booths.",
      ],
    },
    {
      title: "White Acoustic Band",
      period: "2023 - 2024",
      description: "Media",
      link: "https://www.facebook.com/w.acoustic.nhh",
      details: [
        "Collaborated effectively with cross-department teams.",
        "Developed and executed a comprehensive social-media strategy for official channels.",
        "Led production of the Yearbook Album.",
      ],
    },
    {
      title: "HCDG Nguyen Huu Huan 2025 - Festival",
      period: "2023 - 2024",
      description: "External Relations",
      link: "https://www.facebook.com/hcdg.nhh",
      details: [
        "Researched and secured sponsorship opportunities from food-and-beverage businesses.",
        "Drafted and designed comprehensive event proposals.",
        "Liaised with artists' assistants and managed detailed performance timelines pre-event and on-event.",
        "Coordinated with the school president to finalize key festival logistics, including artist fees, stage setup, and staffing.",
      ],
    },
  ];

  return (
    <section id="experience" className="py-20 bg-[#fffff7]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center text-black mb-16"
          style={{ fontFamily: "Dream-Avenue" }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Experience
        </motion.h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-black/30 hidden md:block" />

          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className={`flex flex-col md:flex-row items-center mb-16 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
              initial={{ opacity: 0, x: index % 2 === 0 ? 100 : -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="hidden md:block w-1/2" />

              {/* Timeline dot */}
              <motion.div
                className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-black rounded-full border-4 border-[#fffff7] z-10 hidden md:block"
                whileHover={{ scale: 1.5 }}
              />

              <div
                className={`w-full md:w-1/2 ${
                  index % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"
                }`}
              >
                {exp.link ? (
                  <a
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <motion.div
                      className="bg-white/60 backdrop-blur-sm p-6 rounded-lg border border-black/20 cursor-pointer transition-all"
                      whileHover={{ scale: 1.05, borderColor: "#000000" }}
                    >
                      <h3
                        className="text-2xl font-bold text-black mb-2"
                        style={{ fontFamily: "Dream-Avenue" }}
                      >
                        {exp.title}
                      </h3>
                      <p
                        className="text-black/70 mb-2"
                        style={{ fontFamily: "Cardo99s" }}
                      >
                        {exp.period}
                      </p>
                      <p
                        className="text-black font-semibold mb-3"
                        style={{ fontFamily: "Cardo99s" }}
                      >
                        {exp.description}
                      </p>
                      <ul
                        className={`space-y-2 ${
                          index % 2 === 0 ? "md:text-left" : ""
                        }`}
                      >
                        {exp.details.map((detail, detailIndex) => (
                          <li
                            key={detailIndex}
                            className="text-black/70 flex items-start"
                            style={{ fontFamily: "Cardo99s" }}
                          >
                            <span className="mr-2 text-black/50">•</span>
                            <span className="flex-1">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </a>
                ) : (
                  <motion.div
                    className="bg-white/60 backdrop-blur-sm p-6 rounded-lg border border-black/20"
                    whileHover={{ scale: 1.05, borderColor: "#000000" }}
                  >
                    <h3
                      className="text-2xl font-bold text-black mb-2"
                      style={{ fontFamily: "Dream-Avenue" }}
                    >
                      {exp.title}
                    </h3>
                    <p
                      className="text-black/70 mb-2"
                      style={{ fontFamily: "Cardo99s" }}
                    >
                      {exp.period}
                    </p>
                    <p
                      className="text-black font-semibold mb-3"
                      style={{ fontFamily: "Cardo99s" }}
                    >
                      {exp.description}
                    </p>
                    <ul
                      className={`space-y-2 ${
                        index % 2 === 0 ? "md:text-left" : ""
                      }`}
                    >
                      {exp.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className="text-black/70 flex items-start"
                          style={{ fontFamily: "Cardo99s" }}
                        >
                          <span className="mr-2 text-black/50">•</span>
                          <span className="flex-1">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Project Card Component
function ProjectCard({ project, onClick }) {
  return (
    <motion.div
      className="bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden border border-black/20 cursor-pointer group"
      whileHover={{ scale: 1.05, borderColor: "#000000" }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <h3
          className="text-xl font-bold text-black mb-2 flex items-center justify-between"
          style={{ fontFamily: "Dream-Avenue" }}
        >
          {project.title}
          <ExternalLink
            size={20}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </h3>
        <p className="text-black/80" style={{ fontFamily: "Cardo99s" }}>
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}

// Professional Communication Section
function ProfessionalSection() {
  const designs = [
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1563089145-599997674d42?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1604871000636-074fa5117945?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400&h=400&fit=crop",
  ];

  return (
    <section id="professional-communication" className="py-20 bg-[#fffff7]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center text-black mb-16"
          style={{ fontFamily: "Dream-Avenue" }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Professional Communication
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <GalleryGrid images={designs} title="Design" />
        </motion.div>
      </div>
    </section>
  );
}

// Gallery Grid Component
function GalleryGrid({ images, title }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <motion.div
          key={index}
          className="relative group overflow-hidden rounded-lg aspect-square"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
        >
          <img
            src={image}
            alt={`${title} ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      ))}
    </div>
  );
}

// Personal Design Section
function PersonalDesignSection() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [itemsPerRow, setItemsPerRow] = useState(3);

  const projects = [
    {
      id: 1,
      title: "Food Magazine",
      year: "2024",
      gallery: ["/designs/Food_Magazine/official_1080.webp"],
    },
    {
      id: 2,
      title: "LipStick's Brochure",
      year: "2024",
      gallery: ["/designs/LipStick_Brochure/official_1080.webp"],
    },
    {
      id: 3,
      title: "MilkTea's Logo",
      year: "2025",
      gallery: ["/designs/MilkTea_Logo/official_1080.jpg"],
    },
    {
      id: 4,
      title: "Pastel Symphony",
      year: "2024",
      gallery: ["/designs/Pastel_Symphony/official_1080.webp"],
    },
  ];

  // Update items per row based on screen size
  useEffect(() => {
    const updateItemsPerRow = () => {
      if (window.innerWidth < 768) {
        setItemsPerRow(1); // Mobile: 1 column
      } else if (window.innerWidth < 1024) {
        setItemsPerRow(2); // Tablet: 2 columns
      } else {
        setItemsPerRow(3); // Desktop: 3 columns
      }
    };

    updateItemsPerRow();
    window.addEventListener("resize", updateItemsPerRow);
    return () => window.removeEventListener("resize", updateItemsPerRow);
  }, []);

  const handleCardClick = (project) => {
    // Toggle selection - if clicking the same card, deselect it
    setSelectedProject(selectedProject?.id === project.id ? null : project);
  };

  // Group projects into rows based on responsive items per row
  const projectRows = [];
  for (let i = 0; i < projects.length; i += itemsPerRow) {
    projectRows.push(projects.slice(i, i + itemsPerRow));
  }

  // Function to render the selected project display
  const renderProjectDisplay = (project) => (
    <AnimatePresence mode="wait">
      {selectedProject?.id === project.id && (
        <motion.div
          className="col-span-full"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            className="relative bg-white/60 backdrop-blur-sm border-4 border-black p-4 md:p-8 rounded-lg mt-4 md:mt-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Close button */}
            <motion.button
              className="absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
              onClick={() => setSelectedProject(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} className="md:hidden" />
              <X size={20} className="hidden md:block" />
            </motion.button>

            {/* Project Title */}
            {/* <h4
              className="text-2xl md:text-3xl font-bold text-black mb-4 md:mb-6 text-center pr-8 md:pr-0"
              style={{ fontFamily: "Dream-Avenue" }}
            >
              {selectedProject.title}
            </h4> */}

            {/* Image Gallery */}
            <div>
              {selectedProject.gallery.map((img, index) => (
                <motion.img
                  key={index}
                  src={img}
                  alt={`${selectedProject.title} ${index + 1}`}
                  className="w-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section id="personal-design" className="py-20 bg-[#fffff7]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center text-black mb-16 flex items-center justify-center gap-4"
          style={{ fontFamily: "Dream-Avenue" }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Palette className="text-black" />
          Personal Design
        </motion.h2>

        <div className="max-w-5xl mx-auto">
          {/* Render rows with inline displays */}
          {projectRows.map((row, rowIndex) => (
            <div key={rowIndex}>
              {/* Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-0">
                {row.map((project, index) => {
                  const globalIndex = rowIndex * itemsPerRow + index;
                  return (
                    <React.Fragment key={project.id}>
                      <motion.div
                        className={`border-4 p-6 md:p-8 cursor-pointer transition-all duration-300 aspect-[4/3] flex flex-col justify-center items-center text-center ${
                          selectedProject?.id === project.id
                            ? "border-black bg-black text-white shadow-2xl"
                            : "border-black bg-[#fffff7] hover:bg-black hover:text-white"
                        }`}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: globalIndex * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCardClick(project)}
                      >
                        <h3
                          style={{ fontFamily: "Dream-Avenue" }}
                          className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4"
                        >
                          {project.title}
                        </h3>
                        <p
                          style={{ fontFamily: "Cardo99s" }}
                          className="text-base md:text-lg opacity-70 font-serif"
                        >
                          Year: {project.year}
                        </p>
                      </motion.div>

                      {/* On mobile, show gallery right after each card */}
                      {itemsPerRow === 1 &&
                        selectedProject?.id === project.id && (
                          <div className="md:hidden">
                            {renderProjectDisplay(project)}
                          </div>
                        )}
                    </React.Fragment>
                  );
                })}

                {/* Fill empty grid cells in the last row (desktop only) */}
                {rowIndex === projectRows.length - 1 &&
                  row.length < itemsPerRow &&
                  itemsPerRow > 1 &&
                  Array.from({ length: itemsPerRow - row.length }).map(
                    (_, i) => (
                      <div key={`empty-${i}`} className="hidden md:block" />
                    )
                  )}
              </div>

              {/* Display selected project if it's in this row (tablet and desktop) */}
              {itemsPerRow > 1 &&
                row.some((project) => project.id === selectedProject?.id) && (
                  <div className="hidden md:block">
                    {renderProjectDisplay(selectedProject)}
                  </div>
                )}

              {/* Add margin only if not the last row or if there's a selected project display */}
              {(rowIndex < projectRows.length - 1 ||
                row.some((project) => project.id === selectedProject?.id)) && (
                <div className="mb-4 md:mb-8" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Photography Section
function PhotographySection() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photosPerRow, setPhotosPerRow] = useState(3);

  const photos = [
    {
      id: 1,
      title: "Studio",
      year: "2024",
      gallery: ["/designs/Studio/studio.jpg"],
    },
    {
      id: 2,
      title: "Graduation",
      year: "2024",
      gallery: [
        "/designs/Graduation/graduation_1.jpg",
        "/designs/Graduation/graduation_2.jpg",
      ],
    },
    {
      id: 3,
      title: "TeTrad",
      year: "2022",
      gallery: [
        "designs/TeTrad/TeTrad_1.jpg",
        "designs/TeTrad/TeTrad_2.jpg",
        "designs/TeTrad/TeTrad_3.jpg",
        "designs/TeTrad/TeTrad_4.jpg",
      ],
    },
  ];

  // Update photos per row based on screen size
  useEffect(() => {
    const updatePhotosPerRow = () => {
      if (window.innerWidth < 768) {
        setPhotosPerRow(1); // Mobile: 1 column
      } else if (window.innerWidth < 1024) {
        setPhotosPerRow(2); // Tablet: 2 columns
      } else {
        setPhotosPerRow(3); // Desktop: 3 columns
      }
    };

    updatePhotosPerRow();
    window.addEventListener("resize", updatePhotosPerRow);
    return () => window.removeEventListener("resize", updatePhotosPerRow);
  }, []);

  const handlePhotoClick = (photo) => {
    // Toggle selection - if clicking the same card, deselect it
    setSelectedPhoto(selectedPhoto?.id === photo.id ? null : photo);
  };

  // Group photos into rows based on responsive photos per row
  const photoRows = [];
  for (let i = 0; i < photos.length; i += photosPerRow) {
    photoRows.push(photos.slice(i, i + photosPerRow));
  }

  // Function to render the selected photo display
  const renderPhotoDisplay = (photo) => (
    <AnimatePresence mode="wait">
      {selectedPhoto?.id === photo.id && (
        <motion.div
          className="col-span-full"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            className="relative bg-white/60 backdrop-blur-sm border-4 border-black p-4 md:p-8 rounded-lg mt-4 md:mt-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Close button */}
            <motion.button
              className="absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
              onClick={() => setSelectedPhoto(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} className="md:hidden" />
              <X size={20} className="hidden md:block" />
            </motion.button>

            {/* Photo Title */}
            {/* <h4
              className="text-2xl md:text-3xl font-bold text-black mb-4 md:mb-6 text-center pr-8 md:pr-0"
              style={{ fontFamily: "Dream-Avenue" }}
            >
              {selectedPhoto.title}
            </h4> */}

            {/* Photo Gallery */}
            <div>
              {selectedPhoto.gallery.map((img, index) => (
                <motion.img
                  key={index}
                  src={img}
                  alt={`${selectedPhoto.title} ${index + 1}`}
                  className="w-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section id="photography" className="py-20 bg-[#fffff7]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center text-black mb-16 flex items-center justify-center gap-4"
          style={{ fontFamily: "Dream-Avenue" }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Camera className="text-black" />
          Photography
        </motion.h2>

        <div className="max-w-5xl mx-auto">
          {/* Render rows with inline displays */}
          {photoRows.map((row, rowIndex) => (
            <div key={rowIndex}>
              {/* Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-0">
                {row.map((photo, index) => {
                  const globalIndex = rowIndex * photosPerRow + index;
                  return (
                    <React.Fragment key={photo.id}>
                      <motion.div
                        className={`border-4 p-6 md:p-8 cursor-pointer transition-all duration-300 aspect-[4/3] flex flex-col justify-center items-center text-center ${
                          selectedPhoto?.id === photo.id
                            ? "border-black bg-black text-white shadow-2xl"
                            : "border-black bg-[#fffff7] hover:bg-black hover:text-white"
                        }`}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: globalIndex * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePhotoClick(photo)}
                      >
                        <h3
                          style={{ fontFamily: "Dream-Avenue" }}
                          className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4"
                        >
                          {photo.title}
                        </h3>
                      </motion.div>

                      {/* On mobile, show gallery right after each card */}
                      {photosPerRow === 1 && selectedPhoto?.id === photo.id && (
                        <div className="md:hidden">
                          {renderPhotoDisplay(photo)}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Fill empty grid cells in the last row (desktop only) */}
                {rowIndex === photoRows.length - 1 &&
                  row.length < photosPerRow &&
                  photosPerRow > 1 &&
                  Array.from({ length: photosPerRow - row.length }).map(
                    (_, i) => (
                      <div key={`empty-${i}`} className="hidden md:block" />
                    )
                  )}
              </div>

              {/* Display selected photo if it's in this row (tablet and desktop) */}
              {photosPerRow > 1 &&
                row.some((photo) => photo.id === selectedPhoto?.id) && (
                  <div className="hidden md:block">
                    {renderPhotoDisplay(selectedPhoto)}
                  </div>
                )}

              {/* Add margin only if not the last row or if there's a selected photo display */}
              {(rowIndex < photoRows.length - 1 ||
                row.some((photo) => photo.id === selectedPhoto?.id)) && (
                <div className="mb-4 md:mb-8" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer Section
function Footer() {
  return (
    <footer className="bg-black py-12 border-t border-black/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center">
          <motion.div
            className="flex space-x-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.a
              href="https://www.linkedin.com/in/kazie-nguyen-b38045320/"
              className="text-white hover:opacity-70 transition-opacity"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin size={24} />
            </motion.a>
            <motion.a
              href="https://www.instagram.com/_kazie.squirrel_/"
              className="text-white hover:opacity-70 transition-opacity"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Instagram size={24} />
            </motion.a>
          </motion.div>

          <motion.p
            className="text-white/70 text-center"
            style={{ fontFamily: "Cardo99s" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Website designed by{" "}
            <a
              className="text-white hover:opacity-70 transition-opacity"
              rel="noopener noreferrer"
            >
              @minhquan_nguyenn
            </a>{" "}
            with love to Kazie
          </motion.p>
        </div>
      </div>
    </footer>
  );
}

// Scroll to Top Button
function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="fixed bottom-8 right-8 bg-black hover:bg-black/80 text-white p-3 rounded-full shadow-lg z-50"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// Main App Component with Global Preloading
export default function App() {
  // Preload all heavy images across the site
  const imagesToPreload = [
    // Personal Design images
    "/designs/Food_Magazine/official_1080.webp",
    "/designs/LipStick_Brochure/official_1080.webp",
    "/designs/MilkTea_Logo/official_1080.jpg",
    "/designs/Pastel_Symphony/official_1080.webp",

    // Photo images
    "/designs/Studio/studio.jpg",
    "/designs/Graduation/graduation_1.jpg",
    "/designs/Graduation/graduation_2.jpg",
    "designs/TeTrad/TeTrad_1.jpg",
    "designs/TeTrad/TeTrad_2.jpg",
    "designs/TeTrad/TeTrad_3.jpg",
    "designs/TeTrad/TeTrad_4.jpg",

    // Hero portrait
    "/designs/IMG_4510.JPG",
  ];

  const { imagesLoaded, loadingProgress } = useImagePreloader(imagesToPreload);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Use the same approach for all screen sizes to account for fixed navbar
      const navBar = document.querySelector("nav");
      const navHeight = navBar ? navBar.offsetHeight : 0;

      // Get current scroll position
      const currentScrollY =
        window.pageYOffset || document.documentElement.scrollTop;

      // Get element position relative to document
      const elementRect = element.getBoundingClientRect();
      const elementTop = elementRect.top + currentScrollY;

      // Calculate target position with offset for navbar
      // Add a bit more padding for desktop for better visual spacing
      const extraPadding = window.innerWidth >= 768 ? 20 : 10;
      const targetPosition = elementTop - navHeight - extraPadding;

      // Perform the scroll
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  // Show loading screen while images are preloading
  if (!imagesLoaded) {
    return (
      <div className="fixed inset-0 bg-[#fffff7] flex items-center justify-center z-50">
        <GrainOverlay />
        <div className="text-center z-10">
          <motion.div
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-8"
            style={{ fontFamily: "Dream-Avenue" }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading Portfolio
          </motion.div>

          {/* Progress Bar */}
          <div className="w-64 md:w-80 h-2 bg-black/20 rounded-full overflow-hidden mx-auto mb-4">
            <motion.div
              className="h-full bg-black rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Loading percentage */}
          <motion.p
            className="text-black/70 text-lg"
            style={{ fontFamily: "Cardo99s" }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {Math.round(loadingProgress)}%
          </motion.p>

          {/* Decorative loading dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-black rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fffff7] overflow-hidden relative">
      <GrainOverlay />
      <Navigation scrollToSection={scrollToSection} />
      <HeroSection scrollToSection={scrollToSection} />
      <ExperienceSection />
      <ProfessionalSection />
      <PersonalDesignSection />
      <PhotographySection />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
