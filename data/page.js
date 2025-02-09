"use client";
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from "react";


// Static data import
import Features from "../data/Features.json";
import testomonials from "../data/testomonials.json";
import platforms from "../data/platforms.json";
import tools from "../data/tools.json";
const Page = () => {
  // Duplicate the cards for seamless scrolling
  const duplicatedCards = [...testomonials, ...testomonials,...testomonials,...testomonials];
  const controls = useAnimation();
  const [isPaused, setIsPaused] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const totalWidthRef = useRef(0); // Ref to avoid re-renders
  const videoRef = useRef(null);
  const cardsToShow = 4;
  const currentCards = Features.slice(startIndex, startIndex + cardsToShow);
  // Calculate width only on mount
  useEffect(() => {
    const calculateWidth = () => {
      const cardWidth = 229;
      const gapWidth = 16;
      const numCards = duplicatedCards.length;
      totalWidthRef.current = (cardWidth + gapWidth) * numCards;
    };

    calculateWidth();
  }, [duplicatedCards]);

  // Ensure video plays automatically
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Video autoplay failed: ", error);
      });
    }
  }, []);

  const handleMouseEnter = () => {
    setIsPaused(true);
    controls.stop();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    controls.start({
      x: -totalWidthRef.current,
      transition: {
        duration: duplicatedCards.length * 3,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      },
    });
  };

  const handleNext = () => {
    if (startIndex + 4 < Features.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };
  return (
    <>
      {/* Hero Section */}
      <div id="hero-section" className="bg-[#05030E] text-white overflow-x-hidden  ">
        <main className="flex flex-col items-center text-center mt-16 px-4">
          <h1 className="md:text-[60px] text-[42px]      text-white">
            MT Auto Clicker
          </h1>

          <div className="bg-[#05030E] py-4 px-4 md:px-10 max-w-4xl">
            <p className="text-[#938FAA] font-[600] text-[16px]     py-4 text-center">
              Streamline tasks with features like auto-clicking, scrolling,
              swiping, form-filling, hotkeys, zoom, screen capture, and more.
              Easily enhance efficiency and productivity.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-row flex-col items-center justify-center gap-x-10  bg-[#05030E]  md:gap-x-20 px-3 ">
            {/* Download Button */}
            <a href="/download/windows">
              <button
                className="mt-10 bg-[#71EE9E] text-black px-4 py-4 md:px-3 md:py-[10px] rounded-lg text-lg font-medium  flex items-center justify-center space-x-2"
                // onMouseEnter={() => setIsHovered(true)} // Show SVG on hover
                // onMouseLeave={() => setIsHovered(false)} // Show image when not hovered
                aria-label="Download MT Auto Clicker for Windows"
                title="Download MT Auto Clicker for Windows"
              >
                {/* Conditional Rendering */}


                <svg xmlns="http://www.w3.org/2000/svg" className='mb-1' width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none" /><path fill="#05030E" fillRule="evenodd" d="M12 1.25a.75.75 0 0 0-.75.75v10.973l-1.68-1.961a.75.75 0 1 0-1.14.976l3 3.5a.75.75 0 0 0 1.14 0l3-3.5a.75.75 0 1 0-1.14-.976l-1.68 1.96V2a.75.75 0 0 0-.75-.75" clipRule="evenodd" /><path fill="#05030E" d="M14.25 9v.378a2.249 2.249 0 0 1 2.458 3.586l-3 3.5a2.25 2.25 0 0 1-3.416 0l-3-3.5A2.25 2.25 0 0 1 9.75 9.378V9H8c-2.828 0-4.243 0-5.121.879C2 10.757 2 12.172 2 15v1c0 2.828 0 4.243.879 5.121C3.757 22 5.172 22 8 22h8c2.828 0 4.243 0 5.121-.879C22 20.243 22 18.828 22 16v-1c0-2.828 0-4.243-.879-5.121C20.243 9 18.828 9 16 9z" /></svg>


                {/* Button Text */}
                <span className="text-[16px] md:text-[20px]   leading-[18px]">
                  Download
                </span>
              </button>
            </a>
            {/* Pricing Button */}
            <a href="/pricing">
              <button
                className="border border-[#71EE9E] group text-[#71EE9E] hover:bg-[#71EE9E] hover:text-[#05030E] font-medium text-base md:text-lg md:px-4 md:py-[11px] px-5 py-4 flex items-center space-x-3
            mt-10 justify-between rounded-lg shadow-md hover:shadow-lg"
                aria-label="View MT Auto Clicker pricing plans"
                title="View pricing plans"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 14 14"><rect width="14" height="14" fill="none" /><path fill="#71ee9e" fillRule="evenodd" d="M13.463 9.692C13.463 12.664 10.77 14 7 14S.537 12.664.537 9.713c0-3.231 1.616-4.868 4.847-6.505L4.24 1.077A.7.7 0 0 1 4.843 0H9.41a.7.7 0 0 1 .603 1.023L8.616 3.208c3.23 1.615 4.847 3.252 4.847 6.484M7.625 4.887a.625.625 0 1 0-1.25 0v.627a1.74 1.74 0 0 0-.298 3.44l1.473.322a.625.625 0 0 1-.133 1.236h-.834a.625.625 0 0 1-.59-.416a.625.625 0 1 0-1.178.416a1.88 1.88 0 0 0 1.56 1.239v.636a.625.625 0 1 0 1.25 0v-.636a1.876 1.876 0 0 0 .192-3.696l-1.473-.322a.49.49 0 0 1 .105-.97h.968a.62.62 0 0 1 .59.416a.625.625 0 0 0 1.178-.417a1.87 1.87 0 0 0-1.56-1.238z" clipRule="evenodd" className='hover:text-[#05030E] group-hover:fill-[#05030E] ' /></svg>
                <span className="text-[16px] md:text-[20px]  leading-[18px]">
                  Pricing
                </span>
              </button>
            </a>
          </div>
        </main>
      </div>
      <div className="bg-[#05030e]  text-white py-16  lg:ml-16 mt-[90px]">
        <div className="container mx-auto px-6 lg:pl-20">
          <div className="mb-14">

            <h2 className="text-4xl   text-[#E93BF3] mb-4 font-semibold">
              Everything <span className="text-white">You Need</span>
            </h2>
            <p className="text-gray-400 font-semibold mt-4   text-base">
              Streamline tasks with features like auto-clicking, scrolling, swiping, form-filling, hotkeys, zoom, screen
            </p>
          </div>

          <div className="relative">
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-white md:bg-[#0A0419]  md:py-36  md:px-10 z-10 md:opacity-80 group hover:z-20  md:p-4   transition-opacity duration-300"
              style={{ visibility: startIndex === 0 ? "hidden" : "visible" }}
              aria-label="View previous features"
            >
              <svg width="31" height="48" className='opacity-60 group-hover:z-50 group-hover:opacity-100' viewBox="0 0 31 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M28.3491 1.82992C29.5208 3.00196 30.179 4.59139 30.179 6.24866C30.179 7.90594 29.5208 9.49536 28.3491 10.6674L15.0929 23.9237L28.3491 37.1799C29.5219 38.3518 30.1811 39.9416 30.1816 41.5996C30.1822 43.2575 29.5242 44.8478 28.3523 46.0205C27.1803 47.1933 25.5905 47.8525 23.9326 47.8531C22.2746 47.8536 20.6844 47.1956 19.5116 46.0237L1.83036 28.3424C0.65867 27.1704 0.000448227 25.5809 0.000448227 23.9237C0.000448227 22.2664 0.65867 20.677 1.83036 19.5049L19.5116 1.82992C20.6837 0.658222 22.2731 0 23.9304 0C25.5877 0 27.1771 0.658222 28.3491 1.82992Z" fill="#71EE9E" />
              </svg>

            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white md:bg-[#0A0419]  md:py-36 md:px-10 z-10 opacity-80 md:p-4 group hover:z-20 transition-opacity duration-300"
              style={{ visibility: startIndex + cardsToShow >= Features.length ? "hidden" : "visible" }}
              aria-label="View next features"
            >
              <svg width="31" className='opacity-60 group-hover:z-50 group-hover:opacity-100' height="48" viewBox="0 0 31 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M2.33056 1.90609C1.15887 3.07814 0.500646 4.66756 0.500646 6.32484C0.500646 7.98211 1.15887 9.57154 2.33056 10.7436L15.5868 23.9998L2.33056 37.2561C1.15781 38.428 0.498633 40.0178 0.498047 41.6757C0.497461 43.3337 1.15551 44.9239 2.32743 46.0967C3.49936 47.2695 5.08916 47.9286 6.7471 47.9292C8.40504 47.9298 9.99531 47.2718 11.1681 46.0998L28.8493 28.4186C30.021 27.2465 30.6792 25.6571 30.6792 23.9998C30.6792 22.3426 30.021 20.7531 28.8493 19.5811L11.1681 1.90609C9.99602 0.734394 8.40659 0.0761719 6.74931 0.0761719C5.09204 0.0761719 3.50261 0.734394 2.33056 1.90609Z" fill="#71EE9E" />
              </svg>

            </button>

            <div className="overflow-hidden ">
              <div
                className="flex gap-8 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${startIndex * (240 + 32)}px)` }}
              >
                {Features.map((card, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-60 bg-[#0A0419] p-5  border-[3px] rounded-xl border-[#1D1634] hover:shadow-lg transition duration-300"
                  >
                    {/* <div className={`w-16 h-16 mb-4 rounded-full ${card.gradient}`}></div> */}
                    <Image width={72} height={72} src={card.img} className='w-[72px] h-[72px] ' alt="" loading='lazy' />
                    <p className="text-white  text-lg  mt-6">
                      {card.title}
                    </p>
                    <p className="text-[#938FAA] text-sm  font-semibold mt-5 ">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2 className="text-[36px] text-white mb-16 mt-16 leading-[40px] text-center   font-[600]">
        What Makes Us Special?
      </h2>
      <div id="what-makes-us-special-section" className="bg-[#0A0419] border-[3px] rounded-xl border-[#1D1634] md:ml-36 md:mr-24  flex flex-col items-center p-6 text-white">
        <div className="w-full  max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className=''>
            <h3 className="text-2xl   leading-[40px]   font-bold mb-4  ">
              Cross Platform Compatibility
            </h3>
            <p className="text-wrap text-[#938FAA] leading-6 font-semibold text-[16px]  text-left   mt-2">
              Access MT Auto Clicker on Windows, macOS, Android, iOS, and web browsers like Chrome and Edge. MT Tokens let you sync usage across platforms, ensuring flexibility and ease of use.
            </p>
          </div>

          <div className="flex justify-center bg-[#16162E]">
            <video
              ref={videoRef}
              src="/cross.mp4" // Ensure the file is in the public folder
              loop
              muted
              autoPlay
              className="w-full h-auto muted playsInline"
              style={{ width: "100%", height: "auto" }}
              alt="Cross Compatibility video"
            ></video>
          </div>
        </div>
      </div>
      <div id="community-section" className="mt-10 bg-[#0A0419] border-[3px] rounded-xl border-[#1D1634] md:ml-36 md:mr-24 p-6 flex flex-col items-center  text-white">
        <div className="w-full max-w-7xl grid grid-cols-1   lg:grid-cols-2  ">
          <div className="bg-[#0A0419]  rounded-lg shadow-lg">
            <Image
            width={72}
            height={72}
              src="/images/MT-Community.svg"
              className="w-72 md:ml-[30px]  mx-auto  "
              alt="Mt community logo"
              loading="lazy"
            />
          </div>
          <div className="mt-24 max-sm:px-3 ">
            <h3 className="text-2xl   leading-[30px] text-right  md:leading-[40px]  font-bold mb-4    ">
              MT Community
            </h3>
            <p className="text-[#938FAA] text-wrap leading-6 font-semibold text-[16px] text-right   mt-2">
              Join the MT Community forum to ask questions, troubleshoot issues, and get quick support from MT Staff. A future update will enable users to share presets.
            </p>
          </div>
        </div>
      </div>
      <div id="token-management-section" className="mt-10 border-[3px] p-6 rounded-xl border-[#1D1634] bg-[#0A0419] md:ml-36 md:mr-24  flex flex-col items-center  text-white">
        <div className="w-full max-w-7xl gap-28 grid grid-cols-1 lg:grid-cols-2  ">
          <div className="mt-16 max-sm:px-3 ">
            <h3 className="text-2xl    leading-[30px] md:leading-[40px]  font-bold mb-4  ">
              Token Managment
            </h3>
            <p className="text-[#938FAA] leading-6 font-semibold text-[16px] text-left   mt-2">
              MT Tokens are your digital keys for MT Auto Clicker. Each generation adds 50 tokens, with a limit of 200 tokens per account. Use them across Windows, Mac, and browser extensions for easy access. Invite friends to earn more tokens!
            </p>
          </div>
          <div className="bg-[#0A0419] p-6 rounded-lg shadow-lg">
            <Image
            width={72}
            height={72}
              src="/images/Token-Management.svg"
              className="w-72 md:ml-[30px]  mx-auto  "
              alt="Mt Token Management Logo"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <div
        className="bg-[#05030e] text-white py-12 px-4 lg:ml-20 sm:px-8 lg:px-16 "
        onMouseEnter={(e) =>
          Array.from(e.currentTarget.querySelectorAll(".card")).forEach(
            (card) => (card.style.animationPlayState = "paused")
          )
        }
        onMouseLeave={(e) =>
          Array.from(e.currentTarget.querySelectorAll(".card")).forEach(
            (card) => (card.style.animationPlayState = "running")
          )
        }
        id='testomonial-setion'
      >
        <h2 className="text-[36px]  text-white mb-16 mt-10 leading-[40px] text-left    font-[600]">
          Why we Work?
        </h2>
        <div
          className="bg-[#05030e] text-white   group overflow-hidden"

        >
          <div
            className="flex gap-4 sm:gap-6 md:gap-8 justify-start w-full overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className="flex space-x-4 sm:space-x-6"
              animate={controls}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              initial={{ x: 0 }}
            >
              {duplicatedCards.map((card, index) => (
                <motion.div
                  key={index}
                  className="card w-[300px] h-[300px] bg-[#0A0419] p-5 border-[3px] rounded-xl border-[#1D1634] hover:shadow-lg flex flex-col justify-between"
                >
                  <div className="flex flex-col justify-between h-full w-full">
                    <p className="text-[#938FAA] leading-[25.6px] font-semibold text-md  text-left   mt-2">
                      {card.description}
                    </p>
                    <div className="flex  items-center">
                      <Image
                      width={10}
                      height={10}
                        src={card.image}
                        alt="Mt Auto Clicker Logo"
                        className="h-10 w-10 rounded-full object-cover"
                        loading="lazy"
                      />
                      <span className="text-gray-200 text-[18px] leading-[20px] font-medium ml-4">
                        {card.author}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

      </div>
      {/* Tools Section */}
      <div id='mt-tools-section' className="mt-10 mb-20  bg-[#05030E] text-white flex justify-center items-center  lg:mx-36">
        <div className="w-full text-center ">
          <h2 className="text-[36px]  text-center font- font-semibold tracking-wide  mb-9">
            MT Tools
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 md:gap-8 sm:gap-8 content-center md:ml-0 ml-2 lg:grid-cols-5 gap-4">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="bg-card p-6 py-4 w-[150px] md:w-[190px] border-[3px]  border-[#1D1634]   rounded-lg flex flex-col items-center bg-[#0A0419] hover:bg-[#1D1634] transition-transform duration-200"
              >
                <div className="text-4xl mb-4">
                  <Image
                  width={55}
                  height={55}
                    src={tool.icon}
                    alt="tools icon"
                    className="w-[55px] h-[50px]"
                    loading="lazy"
                  />
                </div>
                <div className="text-sm  font-semibold">{tool.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Download-section */}
      <div id='download-links-section' className=" bg-[#05030E] text-white flex flex-col max-sm:mt-20  items-center">
        <h2 className="text-[24px] leading-[24px]  font-[600]     mb-9">
          AVAILABLE ON
        </h2>
        <div className="flex flex-wrap   justify-center md:mx-0 gap-6" role="group" aria-label="Download options">
          {platforms.map((platform, index) => (
            <div
              key={index}
              className="bg-card p-4 border border-[#71EE9E] rounded-lg flex justify-center items-center w-20 h-20 hover:scale-105 transition-transform"
            >
              <a href={`/download/${platform.name}`}>
                <Image
            width={10}
            height={10}
                  src={platform.icon}
                  alt={platform.name}
                  className="w-10 h-10"
                  loading="lazy"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
      <div id='disclaimer-section' className={`mt-10 sm:p-10 p-0 flex max-sm:mt-20 flex-col gap-10`}>
        <div className="w-[88%] border-[3px] rounded-xl border-[#1D1634]   mx-auto bg-[#0A0419]">
          <div className={`rounded-lg shadow-md p-6 text-center`}>
            <p className={`text-[1.5rem] font-[700] mb-3`}>Disclaimer</p>
            <p className={` text-center text-[#938FAA]`}>
              MT Auto Clicker is intended for legitimate use only. Users are
              solely responsible for their actions and must comply with
              applicable laws. By using our Auto Clicker, you agree to these
              terms.
            </p>
          </div>
        </div>

        <div className="w-[88%] border-[3px] rounded-xl border-[#1D1634] mx-auto   bg-[#0A0419]">
          <div className={`rounded-lg shadow-md p-6 text-center `}>
            <h3 className={`text-[1.5rem] font-[700] mb-3 `}>
              Trademark Disclaimer
            </h3>
            <p className={` text-center text-[#938FAA]`}>
              All trademarks, logos, and brand names mentioned or displayed on
              the MT Auto Clicker website, software, apps, and extensions are
              the sole property of{" "}
              <a
                href="https://www.webtreta.com/"
                className={`no-underline  `}
              >
                Web Treta
              </a>
              . Using these trademarks, logos, and brand names does not imply
              endorsement or affiliation with any other entity.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
// export async function getStaticProps() {
//   const Features = require("../data/Features.json");
//   const platforms = require("../data/platforms.json");
//   const tools = require("../data/tools.json");
//   const testomonials = require("../data/testomonials.json");

//   // Duplicate cards for seamless carousel
//   const duplicatedCards = [...testomonials, ...testomonials,...testomonials,...testomonials];

//   return {
//     props: {
//       Features,
//       duplicatedCards,
//       platforms,
//       tools,
//     },
//     revalidate: 60 * 60 * 24, // Optional: Rebuild every 24 hours
//   };
// }

export default Page;
